const express = require('express');
const controller = require('../controllers/artist');

const router = express.Router();

router.post('/', controller.post);
router.get('/', controller.get);

module.exports = router;