// // Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()

const { User } = require('../class/user')
const { Session } = require('../class/session')
const { Transactions } = require('../class/transactions')

router.post('/', (req, res) => {
  let { token, id, type, target, summ } = req.body

  if (!token || !id || !type || !target || !summ) {
    return req
      .status(400)
      .json({ message: 'Дані передано не вірно' })
  }

  summ = Number(summ)
  if (summ < 0) {
    return req.status(400).json({
      message: 'Значення сума повинно бути більше нуля',
    })
  }

  try {
    const session = Session.get(token)
    if (!session) {
      return req.status(400).json({
        message: 'Відсутня авторизація',
      })
    }

    if (id !== session.user.id) {
      return req.status(400).json({
        message: 'Можливий несанкціонований вхід',
      })
    }
    const user = User.getById(Number(id))

    if (!user) {
      return res.status(400).json({
        message: 'Користувача з таким ID не знайдено',
      })
    }

    Transactions.create(id, type, target, summ)
    User.changeBalance(id, type, summ)
    return res.status(200).json({
      message: 'Операцію виконано',
    })
  } catch (error) {
    if (!user) {
      return res.status(400).json({
        message: error.message,
      })
    }
  }
})

// ========================================================

module.exports = router
