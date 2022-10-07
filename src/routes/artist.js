const express = require('express');
const controller = require('../controllers/artist');

const router = express.Router();

router.post('/', controller.post);
router.get('/', controller.get);
router.get('/:artistId', controller.getById);
router.patch('/:artistId', controller.patch);

module.exports = router;