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
        `INSERT INTO Album (name, year, artistId) VALUES (?, ?, ?)`,
        [name, year, artistId]
      );

      res.status(201).send();
    }
  } catch (err) {
    res.status(500).json(err);
  }

  db.close();
};

exports.getAll = async (_, res) => {
  const db = await getDb();

  try {
    const [albums] = await db.query('SELECT * FROM Album');
    res.status(200).json(albums);
  } catch (err) {
    res.status(500).json(err);
  }

  db.close();
};

exports.getById = async (req, res) => {
  const db = await getDb();
  const { albumId } = req.params;

  try {
    const [[album]] = await db.query(`SELECT * FROM Album WHERE id = ?`, [
      albumId,
    ]);

    if (!album) {
      res.status(404).send();
    } else {
      res.status(200).json(album);
    }
  } catch (err) {
    res.status(500).json(err);
  }

  db.close();
};

exports.getAllByArtistId = async (req, res) => {
  const db = await getDb();
  const { artistId } = req.params;

  try {
    const [albums] = await db.query(`SELECT * FROM Album WHERE artistId = ?`, [
      artistId,
    ]);

    if (!albums) {
      res.status(404).send();
    } else {
      res.status(200).json(albums);
    }
  } catch (err) {
    res.status(500).json(err);
  }

  db.close();
};

exports.patch = async (req, res) => {
  const db = await getDb();
  const { albumId } = req.params;
  const data = req.body;

  try {
    const [{ affectedRows }] = await db.query(
      `UPDATE Album SET ? WHERE id = ?`,
      [data, albumId]
    );

    if (!affectedRows) {
      res.status(404).send();
    } else {
      res.status(200).send();
    }
  } catch (err) {
    res.staus(500).send();
  }

  db.close();
};

exports.delete = async (req, res) => {
  const db = await getDb();
  const { albumId } = req.params;

  try {
    const [{ affectedRows }] = await db.query(
      `DELETE FROM Album WHERE id = ?`,
      [albumId]
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
