// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()

const { User } = require('../class/user')
const { Confirm } = require('../class/confirm')
const { Session } = require('../class/session')
const { Notification } = require('../class/notification')

router.post('/', (req, res) => {
  const { code, password } = req.body

  if (!code || !password) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    const email = Confirm.getData(Number(code))
    if (!email) {
      return res.status(400).json({
        message: 'Помилка. Код не існує',
      })
    }

    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message:
          'Помилка. Користувач з таким email не існує',
      })
    }

    user.password = password

    const session = Session.create(user)

    Notification.create({
      userId: user.id,
      type: Notification.NOTIFIC_TYPE.INFO,
      text: `Пароль змінено`,
    })
    return res.status(200).json({
      message: 'Пароль змінено',
      session,
    })

    // ...
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
})

// =============================================

// Експортуємо глобальний роутер
module.exports = router
