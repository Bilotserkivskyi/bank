// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()

const { User } = require('../class/user')
const { Transactions } = require('../class/transactions')
const { Session } = require('../class/session')
const { Confirm } = require('../class/confirm')
const { Notification } = require('../class/notification')

const TRANSACTION_TYPE = {
  SEND: 'send',
  RECEIVE: 'receive',
}

Transactions.create(
  1,
  TRANSACTION_TYPE.RECEIVE,
  'CoinBase',
  100,
)
Transactions.create(
  1,
  TRANSACTION_TYPE.RECEIVE,
  'CoinBase',
  130,
)
Transactions.create(
  1,
  TRANSACTION_TYPE.SEND,
  'Aliexpres@china',
  100,
)
Transactions.create(
  1,
  TRANSACTION_TYPE.RECEIVE,
  'CoinBase',
  140,
)

User.changeBalance(1, TRANSACTION_TYPE.RECEIVE, 100)
User.changeBalance(1, TRANSACTION_TYPE.RECEIVE, 130)
User.changeBalance(1, TRANSACTION_TYPE.SEND, 100)
User.changeBalance(1, TRANSACTION_TYPE.RECEIVE, 140)
// const user = User.getById(1)
const balance = User.getBalance(1)

router.post('/', function (req, res) {
  const { userId, token } = req.body

  if (!userId || !token) {
    return res
      .status(400)
      .json({ message: 'Відсутній ID користувача' })
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
      return res
        .status(400)
        .json({ message: 'Користувача не знайдено' })
    }

    const balance = User.getBalance(Number(userId))

    const list = Transactions.getList(Number(userId))

    return res.status(200).json({
      list: list,
      balance: balance,
    })
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
})

// Експортуємо глобальний роутер
module.exports = router
