const { expect } = require('chai');
const { getDb } = require('../../src/services/db');
const { appDelete } = require('../helpers/requestHelpers');
const {
  setupArtist,
  setupAlbum,
  setupSong,
  tearDown,
} = require('../helpers/setupHelpers');

describe('delete song', () => {
  let db;
  let artists;
  let albums;
  let songs;

  beforeEach(async () => {
    try {
      db = await getDb();

      await setupArtist(db);
      [artists] = await db.query('SELECT * from Artist');

      await setupAlbum(db, artists[0]);
      [albums] = await db.query('SELECT * from Album');

      await setupSong(db, albums[0], 2);
      [songs] = await db.query('SELECT * from Song');
    } catch (err) {
      throw new Error(err);
    }
  });

  afterEach(async () => {
    try {
      await tearDown(db);
    } catch (err) {
      throw new Error(err);
    }
  });

  describe('/song/{songId}', () => {
    describe('DELETE', () => {
      it('deletes a single song with the correct id', async () => {
        try {
          const { id: songId } = songs[0];
          const { status } = await appDelete(`/song/${songId}`);

          expect(status).to.equal(200);

          const [[deletedSongRecord]] = await db.query(
            `SELECT * FROM Song WHERE id = ?`,
            [songId]
          );

          expect(!!deletedSongRecord).to.be.false;
        } catch (err) {
          throw new Error(err);
        }
      });

      it('returns a 404 if the song is not in the database', async () => {
        try {
          const { status } = await appDelete('/song/999999');

          expect(status).to.equal(404);
        } catch (err) {
          throw new Error(err);
        }
      });
    });
  });
});
