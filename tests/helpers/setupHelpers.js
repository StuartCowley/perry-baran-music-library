const { artistFactory, albumFactory, songFactory } = require('./dataFactory');

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
  const { length } = artists
  for (let i = 0; i < length; i++) {
    const artistId = artists[i].id;
    const entries = Math.floor(Math.random() * 5) + 1;

    for (let j = 0; j < entries; j++) {
      const data = albumFactory();

      await db.query(
        `INSERT INTO Album (name, year, artistId) VALUES (?, ?, ?)`,
        [data.name, data.year, artistId]
      );
    }
  }
};

const setupSong = async (db, albums) => {
  const { length } = albums;
  for (let i = 0; i < length; i++) {
    const albumId = albums[i].id;
    const artistId = albums[i].artistId;
    const entries = Math.floor(Math.random() * 5) + 1;

    for (let j = 0; j < entries; j++) {
      const data = songFactory();

      db.query(
        `INSERT INTO Song (name, position, albumId, artistId) VALUES (?, ?, ?, ?)`,
        [data.name, data.position, albumId, artistId]
      )
    }
  }
};

const tearDown = async (db) => {
  await db.query('DELETE FROM Artist');
  await db.query('DELETE FROM Album');
  await db.query('DELETE FROM Song');
  await db.close();
};

module.exports = { setupArtist, setupAlbum, setupSong, tearDown };
