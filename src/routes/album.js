const express = require('express');
const albumController = require('../controllers/album');
const songController = require('../controllers/song');

const router = express.Router();

router.get('/', albumController.getAll);

router.get('/:albumId', albumController.getById);

router.patch('/:albumId', albumController.patch);

router.delete('/:albumId', albumController.delete);

router.post('/:albumId/song', songController.post);

router.get('/:albumId/song', songController.getAllByAlbumId);

module.exports = router;
