// const express = require('express')
// const router = express.Router()

// // Опишіть маршрут для сторінки /signup-page
// router.get('/signin', (req, res) => {
//   // Підготуйте дані для сторінки /signup-page
//   return res.status(200).json({
//     name: 'signin',
//     component: [
//       'button-back',
//       'heading',
//       'title',
//       'description',
//       'input',
//       'link',
//       'input',
//       'grid',
//       'button-dark',
//     ],
//     title: 'Sign in',
//     description: 'Select login method',
//     data: {},
//     // Додайте інші дані, які ви хочете вивести на сторінці.
//   })
// })

// module.exports = router

// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()

const { User } = require('../class/user')
const { Session } = require('../class/session')
const { Notification } = require('../class/notification')

router.post('/', (req, res) => {
  let { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message:
          'Помилка. Користувач з таким email не існує',
      })
    }

    if (user.password !== password) {
      return res.status(400).json({
        message: 'Помилка. Пароль не підходить',
      })
    }

    const session = Session.create(user)

    Notification.create({
      userId: user.id,
      type: Notification.NOTIFIC_TYPE.WARNING,
      text: `Вхід в акаунт`,
    })

    return res.status(200).json({
      message: 'Вхід успішний',
      session,
    })
  } catch (error) {
    return res.status(400).json({
      message: 'Помилка  входу',
    })
  }
})

//=====================================================
// Експортуємо глобальний роутер
module.exports = router
