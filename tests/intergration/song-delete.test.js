const { expect } = require('chai');
const getDb = require('../../src/services/db');
const { setupArtist, setupAlbum, setupSong, tearDown } = require('../helpers/setupHelpers');
const { del } = require('../helpers/requestHelpers');

describe('read song', () => {
  let db;
  let artists;
  let albums;
  let songs;

  beforeEach(async () => {
    db = await getDb();

    await setupArtist(db, 3);
    [artists] = await db.query('SELECT * from Artist');

    await setupAlbum(db, artists);
    [albums] = await db.query('SELECT * from Album');

    await setupSong(db, albums);
    [songs] = await db.query('SELECT * from Song');
  });

  afterEach(async () => {
    await tearDown(db);
  });

  describe('/song/{songId}', () => {
    describe('DELETE', () => {
      it('deletes a single song with the correct id', async () => {
        const { id: songId } = songs[0];
        const { status } = await del(`/song/${songId}`);

        expect(status).to.equal(200);

        const [[deletedSongRecord]] = await db.query(
          `SELECT * FROM Song WHERE id = ?`,
          [songId]
        );

        expect(!!deletedSongRecord).to.be.false;
      });

      it('returns a 404 if the song is not in the database', async () => {
        const { status } = await del('/song/999999');

        expect(status).to.equal(404);
      });
    });
  });
});
