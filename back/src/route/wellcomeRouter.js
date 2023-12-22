const express = require('express')
const router = express.Router()

// Маршрут для сторінки wellcome-page
router.get('/', (req, res) => {
  // Підготовте дані для сторінки wellcome-page
  const wellcomeData = {
    title: 'Hello!',
    description: 'Welcome to bank app',
  }

  res.json(wellcomeData)
})

module.exports = router
