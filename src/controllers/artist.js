const getDb = require('../services/db');

exports.post = async (req, res) => {
  const db = await getDb();
  const { name, genre } = req.body;

  try {
    await db.query(`INSERT INTO Artist (name, genre) VALUES (?, ?)`, [
      name,
      genre,
    ]);
    res.status(201).send();
  } catch (err) {
    res.status(500).json(err);
  }

  db.close();
};

exports.getAll = async (req, res) => {
  const db = await getDb();
  try {
    const [artists] = await db.query('SELECT * FROM Artist');
    res.status(200).json(artists);
  } catch (err) {
    res.status(500).json(err);
  }

  db.close();
};

exports.getById = async (req, res) => {
  const db = await getDb();
  const { artistId } = req.params;

  try {
    const [[artist]] = await db.query(`SELECT * FROM Artist WHERE id = ?`, [
      artistId,
    ]);

    if (!artist) {
      res.status(404).send();
    } else {
      res.status(200).json(artist);
    }
  } catch (err) {
    res.status(500).json(err);
  }

  db.close();
};

exports.patch = async (req, res) => {
  const db = await getDb();
  const { artistId } = req.params;
  const data = req.body;

  try {
    const [{ affectedRows }] = await db.query(
      `UPDATE Artist SET ? WHERE id = ?`,
      [data, artistId]
    );

    if (!affectedRows) {
      res.status(404).send();
    } else {
      res.status(200).send();
    }
  } catch (err) {
    res.status(500).send();
  }

  db.close();
};

exports.delete = async (req, res) => {
  const db = await getDb();
  const { artistId } = req.params;

  try {
    const [{ affectedRows }] = await db.query(
      `DELETE FROM Artist WHERE id = ?`,
      [artistId]
    );

    if (!affectedRows) {
      res.status(404).send();
    } else {
      res.status(200).send();
    }
  } catch (err) {
    res.status(500).send();
  }

  db.close();
};
