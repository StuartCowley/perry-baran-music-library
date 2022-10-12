const { restart } = require('nodemon');
const getDb = require('../services/db');

exports.post = async (req, res) => {
  const db = await getDb();
  const { name, length } = req.body;
  const { albumId } = req.params;

  try {
    const [[album]] = await db.query(`SELECT * FROM Album WHERE id = ?`, [
      albumId,
    ]);

    if (!album) {
      res.status(400).send();
    } else {
      await db.query(
        `INSERT INTO Song (name, length, albumId, artistId) VALUES (?, ?, ?, ?)`,
        [name, length, albumId, album.artistId]
      );

      res.status(201).send();
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
