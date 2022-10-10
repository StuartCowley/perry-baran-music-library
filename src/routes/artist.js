const express = require('express');
const artistController = require('../controllers/artist');
const albumController = require('../controllers/album');

const router = express.Router();

router.get('/', artistController.getAll);

router.post('/', artistController.post);

router.get('/:artistId', artistController.getById);

router.patch('/:artistId', artistController.patch);

router.delete('/:artistId', artistController.delete);

router.post('/:artistId/album', albumController.post);

router.get('/:artistId/album', albumController.getAllByArtistId);

module.exports = router;
