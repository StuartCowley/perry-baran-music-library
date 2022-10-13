const { artistFactory } = require('./dataFactory');

const setupArtist = async (db, entries) => {
  for (let i = 0; i < entries; i++) {
    const data = artistFactory();
    await db.query('INSERT INTO Artist (name, genre) VALUES(?, ?)', 
    [data.name, data.genre]);
  }
};

module.exports = { setupArtist }