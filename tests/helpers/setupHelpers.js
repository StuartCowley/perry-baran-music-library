const { artistFactory, albumFactory } = require('./dataFactory');

const setupArtist = async (db, entries) => {
  try {
    for (let i = 0; i < entries; i++) {
      const data = artistFactory();
      await db.query('INSERT INTO Artist (name, genre) VALUES(?, ?)', [
        data.name,
        data.genre,
      ]);
    }
  } catch (err) {
    throw new Error(err);
  }
};

const setupAlbum = async (db, artists) => {
  for (let j = 0; j < artists.length; j++) {
    const artistId = artists[j].id;
    const entries = Math.floor(Math.random() * 10) + 1;

    for (let i = 0; i < entries; i++) {
      const data = albumFactory();
      await db.query(
        `INSERT INTO Album (name, year, artistId) VALUES (?, ?, ?)`,
        [data.name, data.year, artistId]
      );
    }
  }
};

const tearDown = async (db) => {
  await db.query('DELETE FROM Artist');
  await db.query('DELETE FROM Album');
  await db.query('DELETE FROM Song');
  await db.close();
};

module.exports = { setupArtist, setupAlbum, tearDown };
