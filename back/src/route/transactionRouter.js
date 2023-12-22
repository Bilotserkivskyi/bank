const express = require('express')
const router = express.Router()

const { User } = require('../class/user')
const { Transactions } = require('../class/transactions')
const { Session } = require('../class/session')
const { Notification } = require('../class/notification')

router.post('/', (req, res) => {
  const { token, userId, transactionId } = req.body
  if (!token || !userId || !transactionId) {
    return res
      .status(400)
      .json({ message: 'Дані не передано' })
  }

  try {
    const session = Session.get(token)

    if (!session) {
      return req.status(400).json({
        message: 'Відсутня авторизація',
      })
    }

    if (userId !== session.user.id) {
      return req.status(400).json({
        message: 'Можливий несанкціонований вхід',
      })
    }

    const user = User.getById(Number(userId))

    if (!user) {
      return res.status(400).json({
        message: 'Користувача з таким ID не знайдено',
      })
    }

    const transaction = Transactions.getById(
      Number(transactionId),
    )

    if (userId !== transaction.userid) {
      return res.status(400).json({
        message:
          'Транзакції користувача з таким ID  не знайдено',
      })
    }
    return res.status(200).json({
      transaction,
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

module.exports = router
