const { artistFactory, albumFactory, songFactory } = require('./dataFactory');

const setupArtist = async (db, entries = 1, data = [{}]) => {
  try {
    for (let i = 0; i < entries; i++) {
      const { name, genre } = artistFactory(data[i]);

      await db.query('INSERT INTO Artist (name, genre) VALUES(?, ?)', [
        name,
        genre,
      ]);
    }
  } catch (err) {
    throw new Error(err);
  }
};

const setupAlbum = async (db, artist, entries = 1, data = [{}]) => {
  const { id: artistId } = artist;

  try {
    for (let i = 0; i < entries; i++) {
      const { name, year } = albumFactory(data[i]);

      await db.query(
        `INSERT INTO Album (name, year, artistId) VALUES (?, ?, ?)`,
        [name, year, artistId]
      );
    }
  } catch (err) {
    throw new Error(err);
  }
};

const setupSong = async (db, album, entries = 1, data = [{}]) => {
  const { id: albumId, artistId } = album;

  try {
    for (let i = 0; i < entries; i++) {
      const { name, position } = songFactory(data[i]);

      await db.query(
        `INSERT INTO Song (name, position, albumId, artistId) VALUES (?, ?, ?, ?)`,
        [name, position, albumId, artistId]
      );
    }
  } catch (err) {
    throw new Error(err);
  }
};

const tearDown = async (db) => {
  try {
    await db.query('DELETE FROM Artist');
    await db.query('DELETE FROM Album');
    await db.query('DELETE FROM Song');
    await db.close();
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { setupArtist, setupAlbum, setupSong, tearDown };
