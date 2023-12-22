// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()

const { User } = require('../class/user')
const { Transactions } = require('../class/transactions')
const { Session } = require('../class/session')
const { Notification } = require('../class/notification')

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
    if (user.email === target) {
      return res.status(400).json({
        message: 'Ви не можете надіслати кошти самі собі',
      })
    }

    const balance = User.getBalance(user.id)
    if (balance < summ) {
      return res.status(400).json({
        message: 'Для цієї операції не достатньо коштів',
      })
    }

    const userReciever = User.getByEmail(target)

    Transactions.create(id, type, target, summ)
    User.changeBalance(id, type, summ)
    Notification.create({
      userId: id,
      type: Notification.NOTIFIC_TYPE.INFO,
      text: `Відправлено переказ на суму $${summ} до ${target}`,
    })

    if (userReciever) {
      Transactions.create(
        userReciever.id,
        TRANSACTION_TYPE.RECEIVE,
        user.email,
        summ,
      )
      User.changeBalance(
        userReciever.id,
        TRANSACTION_TYPE.RECEIVE,
        summ,
      )
      Notification.create({
        userId: userReciever.id,
        type: Notification.NOTIFIC_TYPE.INFO,
        text: `Отримано переказ від ${user.email} на суму $${summ}`,
      })
    }
    return res.status(200).json({
      message: 'Операція успішна',
    })
  } catch (error) {
    if (!user) {
      return res.status(400).json({
        message: error.message,
      })
    }
  }
})

// ================================================================

module.exports = router
