// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()

const { User } = require('../class/user')
const { Session } = require('../class/session')
const { Notification } = require('../class/notification')
const { Confirm } = require('../class/confirm')

router.post('/', (req, res) => {
  const { token, user_email, email, password } = req.body

  if (!token || !user_email || !email || !password) {
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
    const hasUser = User.getByEmail(email)

    if (hasUser) {
      return res.status(400).json({
        message:
          'Помилка. Користувач з таким email вже існує',
      })
    }

    const user = User.getByEmail(user_email)

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

    if (password === user.password) {
      user.email = email

      Notification.create({
        userId: user.id,
        type: Notification.NOTIFIC_TYPE.INFO,
        text: `Email змінено`,
      })

      const session = Session.create(user)

      return res.status(200).json({
        message: 'Пароль змінено',
        session,
      })
    }

    return res.status(400).json({
      message: 'Неправильний пароль',
    })

    // ...
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
})
//=====================================================

// Експортуємо глобальний роутер
module.exports = router
