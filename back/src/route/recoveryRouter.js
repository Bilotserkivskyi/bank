// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()

const { User } = require('../class/user')
const { Confirm } = require('../class/confirm')

router.post('/', (req, res) => {
  console.log('req.body', req.body)
  const { email } = req.body
  console.log('email: ', email)

  if (!email) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message:
          'Помилка. Користувача з таким email не існує',
      })
    }

    Confirm.create(email)

    return res.status(200).json({
      message: 'Код для відновлення паролю відправлено',
    })
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
})
// =============================================

// Експортуємо глобальний роутер
module.exports = router
