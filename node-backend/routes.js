const express = require('express');
const router = express.Router();
const { getHolidays } = require('./controllers/holidaysController');
const { getShabbat } = require('./controllers/shabbatController');

router.get('/api/holidays/:date', getHolidays);
router.get('/api/shabbat/:date', getShabbat);

module.exports = router;
