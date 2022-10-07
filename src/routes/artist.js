const express = require('express');
const controller = require('../controllers/artist');

const router = express.Router();

router.get('/', controller.get);

router.post('/', controller.post);

router.get('/:artistId', controller.getById);

router.patch('/:artistId', controller.patch);

router.delete('/:artistId', controller.delete);

module.exports = router;
