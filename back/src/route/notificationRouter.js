// const express = require('express')
// const router = express.Router()

// // Опишіть маршрут для сторінки /signup-page
// router.get('/notifications', (req, res) => {
//   // Підготуйте дані для сторінки /balance-page
//   const notificationsData = {
//     title: 'Notifications',

//     // Додайте інші дані, які ви хочете вивести на сторінці.
//   }

//   res.status(200).json(notificationsData)
// })

// module.exports = router
// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()

const { User } = require('../class/user')
const { Session } = require('../class/session')
const { Notification } = require('../class/notification')
const { Confirm } = require('../class/confirm')
// const { Transactions } = require('../class/transactions')

router.post('/', (req, res) => {
  const { userId, token } = req.body

  if (!userId || !token) {
    return res
      .status(400)
      .json({ message: 'Відсутній ID користувача' })
  }

  try {
    const session = Session.get(token)

    if (!session) {
      return res.status(400).json({
        message: 'Відсутня авторизація',
      })
    }

    if (userId !== session.user.id) {
      return res.status(400).json({
        message: 'Можливий несанкціонований вхід',
      })
    }
    const user = User.getById(Number(userId))
    if (!user) {
      return res
        .status(400)
        .json({ message: 'Користувач не знайдений' })
    }
    const list = Notification.getList(Number(userId))

    return res.status(200).json({
      list: list,
    })
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
})

// ========================================================

// Експортуємо глобальний роутер
module.exports = router
