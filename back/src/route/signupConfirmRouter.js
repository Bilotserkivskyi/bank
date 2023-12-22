// Опишіть маршрут для сторінки /signup-page
const express = require('express')
const router = express.Router()

const { User } = require('../class/user')
const { Confirm } = require('../class/confirm')
const { Session } = require('../class/session')
const { Notification } = require('../class/notification')

// router.get('/signup-confirm', (req, res) => {
//   // Підготуйте дані для сторінки /signup-page
//   return res.status(200).json({
//     name: 'signup-confirm',
//     title: 'Confirm account',
//     description: 'Write the code you received',

//     component: [
//       'button-back',
//       'heading',
//       'title',
//       'description',
//       'input',
//       'button-dark',
//     ],
//     data: {},
//     // Додайте інші дані, які ви хочете вивести на сторінці.
//   })
// })

// =============================================
router.post('/', function (req, res) {
  const { renew, email } = req.body

  if (!renew || !email) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    const userData = User.getByEmail(email)

    if (!userData) {
      return res.status(400).json({
        message: 'Помилка. Користувача не існує',
      })
    }
    Confirm.create(email)

    return res.status(200).json({
      message: 'Код повторно відправлено',
    })
  } catch (error) {
    return res.status(400).json({
      message: 'Помилка. Відсутнє зєднання з сервером',
    })
  }
})

router.post('/renew', function (req, res) {
  const { code, token } = req.body

  if (!code || !token) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    const session = Session.get(token)

    if (!session) {
      return res.status(400).json({
        message: 'Помилка. Ви не увійшли в акаунт',
      })
    }

    const email = Confirm.getData(Number(code))

    if (!email) {
      return res.status(400).json({
        message: 'Помилка. Код не існує',
      })
    }

    if (email !== session.user.email) {
      return res.status(400).json({
        message: 'Помилка. Код не дійсний',
      })
    }

    const user = User.getByEmail(session.user.email)
    user.isConfirm = true

    session.user.isConfirm = true

    Notification.create({
      userId: user.id,
      type: Notification.NOTIFIC_TYPE.INFO,
      text: `Підтверджено акаунт`,
    })

    return res.status(200).json({
      message: 'Ви підтвердили свою пошту',
      session,
    })
    // ...
  } catch (error) {
    return res.status(400).json({ massage: error.message })
  }
})
// ========================================================

// Експортуємо глобальний роутер
module.exports = router
