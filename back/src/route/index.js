// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()

// Підключіть файли роутів
// const test = require('./test')
// Підключіть інші файли роутів, якщо є
const wellcomeRouter = require('./wellcomeRouter')
const signupRouter = require('./signupRouter')
const signinRouter = require('./signinRouter')
const recoveryConfirmRouter = require('./recoveryConfirmRouter')
const signupConfirmRouter = require('./signupConfirmRouter')
const authConfirmRouter = require('./authConfirmRouter')
const recoveryRouter = require('./recoveryRouter')
const balanceRouter = require('./balanceRouter')
const notificationRouter = require('./notificationRouter')
// const settingsRouter = require('./settingsRouter')
const receiveRouter = require('./receiveRouter')
const sendRouter = require('./sendRouter')
const transactionRouter = require('./transactionRouter')
// const testRouter = require('./testRouter')
const changeEmailRouter = require('./changeEmailRouter')
const changePasswordRouter = require('./changePasswordRouter')

// Імпортуємо інші маршрути за потреби.

// Об'єднайте файли роутів за потреби
// router.use('/', test)
// Використовуйте інші файли роутів, якщо є

router.use('/wellcome', wellcomeRouter)
router.use('/signup', signupRouter)
router.use('/signin', signinRouter)
router.use('/recovery-confirm', recoveryConfirmRouter)
router.use('/signup-confirm', signupConfirmRouter)
router.use('/auth-confirm', authConfirmRouter)
router.use('/recovery', recoveryRouter)
router.use('/balance', balanceRouter)
router.use('/notification', notificationRouter)
// router.use('/settings', settingsRouter)
router.use('/receive', receiveRouter)
router.use('/send', sendRouter)
router.use('/transaction', transactionRouter)
router.use('/change-email', changeEmailRouter)
router.use('/change-password', changePasswordRouter)
// router.use('/', testRouter)

router.get('/', (req, res) => {
  res.status(200).json('Hello World')
})

// Експортуємо глобальний роутер
module.exports = router
