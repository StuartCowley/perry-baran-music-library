const connectDb = require('../services/db');

exports.post = async (req, res) => {
  const db = await connectDb.getDb();
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
  } catch (error) {
    res.status(500).json({ error });
  }

  db.end();
};

exports.getAll = async (_, res) => {
  const db = await connectDb.getDb();

  try {
    const [albums] = await db.query('SELECT * FROM Album');
    res.status(200).json(albums);
  } catch (error) {
    res.status(500).json({ error });
  }

  db.end();
};

exports.getById = async (req, res) => {
  const db = await connectDb.getDb();
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
  } catch (error) {
    res.status(500).json({ error });
  }

  db.end();
};

exports.getAllByArtistId = async (req, res) => {
  const db = await connectDb.getDb();
  const { artistId } = req.params;

  try {
    const [albums] = await db.query(`SELECT * FROM Album WHERE artistId = ?`, [
      artistId,
    ]);

    if (albums.length === 0) {
      res.status(404).send();
    } else {
      res.status(200).json(albums);
    }
  } catch (error) {
    res.status(500).json({ error });
  }

  db.end();
};

exports.patch = async (req, res) => {
  const db = await connectDb.getDb();
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
  } catch (error) {
    res.status(500).json({ error });
  }

  db.end();
};

exports.delete = async (req, res) => {
  const db = await connectDb.getDb();
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
  } catch (error) {
    res.status(500).json({ error });
  }

  db.end();
};
