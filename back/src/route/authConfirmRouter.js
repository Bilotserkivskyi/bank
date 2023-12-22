// Опишіть маршрут для сторінки /signup-page
const express = require('express')
const router = express.Router()
const { User } = require('../class/user')
const { Session } = require('../class/session')
const { Confirm } = require('../class/confirm')
const { Notification } = require('../class/notification')

router.post('/', function (req, res) {
  const { token, email } = req.body

  if (!email || !token) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    const session = Session.get(token)

    if (!session) {
      return res.status(400).json({
        message: 'Помилка. Токен відсутній в системі',
      })
    }
    const userData = User.getByEmail(email)

    if (!userData) {
      return res.status(400).json({
        message: 'Помилка. Користувача не існує',
      })
    }

    if (session.user.email !== userData.email) {
      return res.status(400).json({
        message: 'Увага. Несанкціонований вхід',
      })
    }

    return res.status(200).json({
      message: 'Вхід дозволено',
      session,
    })
    // ...
  } catch (error) {
    return res
      .status(400)
      .json({ massage: 'ServerRequestError' })
  }
})

//=====================================================

// Експортуємо глобальний роутер
module.exports = router
