const getDb = require('../services/db');

exports.post = async (req, res) => {
  const db = await getDb();
  const { name, year } = req.body;
  const { artistId } = req.params;

  try {
    const [[artist]] = await db.query(`SELECT * FROM Artist WHERE id = ?`, [
      artistId,
    ]);

    if (!artist) {
      res.status(404).send();
    } else {
      await db.query(
        `INSERT INTO Album (name, year, artistId) VALUE (?, ?, ?)`,
        [name, year, artistId]
      );

      res.status(201).send();
    }
  } catch (err) {
    res.status(500).json(err);
  }

  db.close();
};

exports.getAll = async (req, res) => {
  const db = await getDb();
  try {
    const [albums] = await db.query('SELECT * FROM Album');
    res.status(200).json(albums);
  } catch (err) {
    res.status(500).json(err);
  }
};
