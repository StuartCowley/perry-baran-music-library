const dataFactory = require('./dataFactory');

//optional artistData is an array of objects following [{ name: string, genre: string }]
const setupArtist = async (db, entries = 1, artistData = [{}]) => {
  try {
    for (let i = 0; i < entries; i++) {
      const { name, genre } = dataFactory.artistFactory(artistData[i]);

      await db.query(`INSERT INTO Artist (name, genre) VALUES(?, ?)`, [
        name,
        genre,
      ]);
    }
  } catch (err) {
    throw new Error(err);
  }
};

//optional albumData is an array of objects following [{ name: string, year: number }]
const setupAlbum = async (db, artist, entries = 1, albumData = [{}]) => {
  const { id: artistId } = artist;

  try {
    for (let i = 0; i < entries; i++) {
      const { name, year } = dataFactory.albumFactory(albumData[i]);

      await db.query(
        `INSERT INTO Album (name, year, artistId) VALUES (?, ?, ?)`,
        [name, year, artistId]
      );
    }
  } catch (err) {
    throw new Error(err);
  }
};

//optional songData is an array of objects following [{ name: string, position: number }]
const setupSong = async (db, album, entries = 1, songData = [{}]) => {
  const { id: albumId, artistId } = album;

  try {
    for (let i = 0; i < entries; i++) {
      const { name, position } = dataFactory.songFactory(songData[i]);

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
    await db.end();
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { setupArtist, setupAlbum, setupSong, tearDown };
