const express = require('express')
const router = express.Router()

// Опишіть маршрут для сторінки /settings
router.post('/', (req, res) => {
  const {
    token,
    email,
    email_new,
    password,
    password_new,
  } = req.body

  if (
    !token ||
    !email ||
    !email_new ||
    !password ||
    !password_new
  ) {
    return res.status(400).json({
      message: 'Заповніть обов’язкові поля!',
    })
  }

  try {
    let user_session = Session.get(token)

    if (!user_session) {
      return res.status(400).json({
        message: 'Спочатку авторизуйтесь!',
      })
    }
    const hasUser = user.getByEmail(email)

    if (hasUser) {
      return res.status(400).json({
        message: 'Користувач з таким email вже існує',
      })
    }
    // =================================================
    const user = user.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: 'Користувача з таким email не існує!',
      })
    }

    if (user.password !== password) {
      return res.status(400).json({
        message: 'Пароль невірний!',
      })
    }
    // =================================================
    if (user.id !== user_session.user.id) {
      return res.status(400).json({
        message: 'Можливий несанкціонований вхід',
      })
    }

    if (password === user.password) {
      user.email = email_new

      Notification.create({
        userId: user.id,
        type: Notification.NOTIFIC_TYPE.INFO,
        text: `Email успішно змінено`,
      })

      user.password = password_new

      Notification.create({
        userId: user.id,
        type: Notification.NOTIFIC_TYPE.INFO,
        text: `Пароль успішно змінено`,
      })

      const session = session.create(user)

      return res.status(200).json({
        message: 'Пароль змінено',
        session,
      })
    }

    return res.status(400).json({
      message: 'Неправильний пароль',
    })
    // ============================================
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

module.exports = router
