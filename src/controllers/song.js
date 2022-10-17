const connectDb = require('../services/db');

exports.post = async (req, res) => {
  const db = await connectDb.getDb();
  const { name, position } = req.body;
  const { albumId } = req.params;

  try {
    const [[album]] = await db.query(`SELECT * FROM Album WHERE id = ?`, [
      albumId,
    ]);

    if (!album) {
      res.status(404).send();
    } else {
      await db.query(
        `INSERT INTO Song (name, position, albumId, artistId) VALUES (?, ?, ?, ?)`,
        [name, position, albumId, album.artistId]
      );

      res.status(201).send();
    }
  } catch (err) {
    res.status(500).json(err);
  }

  db.close();
};

exports.getAll = async (req, res) => {
  const db = await connectDb.getDb();

  try {
    const [songs] = await db.query('SELECT * FROM Song');
    res.status(200).json(songs);
  } catch (err) {
    res.status(500).send();
  }

  db.close();
};

exports.getById = async (req, res) => {
  const db = await connectDb.getDb();
  const { songId } = req.params;

  try {
    const [[song]] = await db.query(`SELECT * FROM Song WHERE id = ?`, [
      songId,
    ]);

    if (!song) {
      res.status(404).send();
    } else {
      res.status(200).json(song);
    }
  } catch (err) {
    res.status(500).json(err);
  }

  db.close();
};

exports.getAllByArtistId = async (req, res) => {
  const db = await connectDb.getDb();
  const { artistId } = req.params;

  try {
    const [songs] = await db.query(`SELECT * FROM Song WHERE artistId = ?`, [
      artistId,
    ]);

    if (songs.length === 0) {
      res.status(404).send();
    } else {
      res.status(200).json(songs);
    }
  } catch (err) {
    res.status(500).json(err);
  }

  db.close();
};

exports.getAllByAlbumId = async (req, res) => {
  const db = await connectDb.getDb();
  const { albumId } = req.params;

  try {
    const [songs] = await db.query(`SELECT * FROM Song WHERE albumId = ?`, [
      albumId,
    ]);

    if (songs.length === 0) {
      res.status(404).send();
    } else {
      res.status(200).json(songs);
    }
  } catch (err) {
    res.status(500).json(err);
  }

  db.close();
};

exports.patch = async (req, res) => {
  const db = await connectDb.getDb();
  const { songId } = req.params;
  const data = req.body;

  try {
    const [{ affectedRows }] = await db.query(
      `UPDATE Song SET ? WHERE id = ?`,
      [data, songId]
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
  const db = await connectDb.getDb();
  const { songId } = req.params;

  try {
    const [{ affectedRows }] = await db.query(`DELETE FROM Song WHERE id = ?`, [
      songId,
    ]);

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
