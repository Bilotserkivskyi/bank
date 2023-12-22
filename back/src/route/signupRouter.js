// ====================================================
const express = require('express')
const router = express.Router()

const { User } = require('../class/user')
const { Notification } = require('../class/notification')
const { Confirm } = require('../class/confirm')
const { Session } = require('../class/session')

// router.get('/signup', function (req, res) {
//   return res.status(200).json({
//     name: 'signup',
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
//       'alert',
//     ],
//     title: 'Sign up',
//     description: 'Choose a registration method',
//     data: {},
//   })
// })

User.create({
  email: 'admin1@admin.com',
  password: '123Admin',
})
const user = User.getByEmail('admin1@admin.com')
user.isConfirm = true

Notification.create({
  userId: 1,
  type: Notification.NOTIFIC_TYPE.WARNING,
  text: `Вхід в акаунт`,
})
Notification.create({
  userId: 1,
  type: Notification.NOTIFIC_TYPE.INFO,
  text: `Реєстрація підтверджена`,
})
// router.post('/signup', async function (req, res) {
//   const { email, password } = req.body

//   try {
//     const existingUser = User.getByEmail(email)

//     if (existingUser) {
//       return res.status(400).json({
//         message: 'Користувач із введеним e-mail вже існує!',
//       })
//     } else {
//       const newUser = User.create({
//         email,
//         password,
//       })

//       const session = Session.create(newUser)

//       // Отримання ID нового користувача та створення коду підтвердження
//       Confirm.create({ userId: newUser.id })

//       return res.status(200).json({
//         message: 'Користувач успішно зареєстрований!',
//         session,
//       })
//     }
//   } catch (err) {
//     return res.status(400).json({
//       message: 'Помилка створення користувача',
//     })
//   }
// })

// module.exports = router

// Підключаємо роутер до бек-енду
// const express = require('express')
// const router = express.Router()

// const User = require('../class/user')

// ================================================================

router.post('/', function (req, res) {
  let { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    const user = User.getByEmail(email)

    if (user) {
      return res.status(400).json({
        message: 'Користувач з таким email вже існує',
      })
    }

    const newUser = User.create({ email, password })

    const session = Session.create(newUser)

    Confirm.create(newUser.email)

    return res.status(200).json({
      message: 'Користувач успішно зареєстровиний',
      session,
    })
  } catch (error) {
    return res.status(400).json({
      message: 'Помилка створення користувача',
    })
  }
})
// =============================================

// router.post('/', (req, res) => {
//   const { email, password } = req.body

//   if (!email || !password) {
//     // Check if email or password are missing
//     return res
//       .status(400)
//       .json({ error: 'Email and password are required' })
//   } else {
//     const existingUser = User.getUserByEmail(email)

//     if (existingUser && existingUser.email === email) {
//       // Check if a user with the same email already exists

//       return res.status(409).json({
//         error: 'A user with the same email already exists',
//       })
//     } else {
//       const user = new User(email, password)

//       console.log('new user created: ', user)

//       user.notifications.push(
//         new Notification('Acount created', 'Announcement'),
//       )

//       res.status(201).json({
//         message: 'User registered successfully',
//       })
//     }
//   }
// })

// Експортуємо глобальний роутер
module.exports = router
