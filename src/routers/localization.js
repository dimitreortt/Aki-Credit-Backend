const router = require('express').Router()

router.get('/localization', (req, res) => {
    res.send('This is GET localization ')
})

module.exports = router