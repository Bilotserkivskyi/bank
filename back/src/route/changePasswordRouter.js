// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()

const { User } = require('../class/user')
const { Session } = require('../class/session')
const { Notification } = require('../class/notification')
const { Confirm } = require('../class/confirm')

router.post('/', (req, res) => {
  const { token, email, password, password_new } = req.body
  if (!token || !email || !password || !password_new) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    let user_session = Session.get(token)

    if (!user_session) {
      return res.status(400).json({
        message: 'Відсутня авторизація',
      })
    }

    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message:
          'Помилка. Користувач з таким email не існує',
      })
    }

    if (user.id !== user_session.user.id) {
      return res.status(400).json({
        message: 'Можливий несанкціонований вхід',
      })
    }

    if (user.password === password) {
      user.password = password_new
    }
    Notification.create({
      userId: user.id,
      type: Notification.NOTIFIC_TYPE.INFO,
      text: `Змінено пароль`,
    })

    const session = Session.create(user)

    return res.status(200).json({
      message: 'Пароль змінено',
      session,
    })

    // ...
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
})
//=====================================================

module.exports = router
