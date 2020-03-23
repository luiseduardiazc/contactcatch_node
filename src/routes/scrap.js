const { Router } = require('express');
const router = Router();

const scrapController = require('../controllers/scrap.controller');

router.post('/scrap', scrapController.scrap);

module.exports = router;
