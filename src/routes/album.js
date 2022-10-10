const express = require('express');
const albumController = require('../controllers/album');

const router = express.Router();

router.get('/', albumController.getAll);

router.get('/:albumId', albumController.getById);

//router.patch('/albumId', albumController.patch);

//router.delete('/:albumId', albumController.delete);

module.exports = router;
