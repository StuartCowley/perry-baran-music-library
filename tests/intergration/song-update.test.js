const { expect } = require('chai');
const { getDb } = require('../../src/services/db');
const { songFactory } = require('../helpers/dataFactory');
const { appPatch } = require('../helpers/requestHelpers');
const {
  setupArtist,
  setupAlbum,
  setupSong,
  tearDown,
} = require('../helpers/setupHelpers');

describe('update song', () => {
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
    describe('PATCH', () => {
      it('updates a single song with correct id', async () => {
        try {
          const { id: songId } = songs[0];
          const data = songFactory();
          const { status } = await appPatch(`/song/${songId}`, data);

          expect(status).to.equal(200);

          const [[newSongRecord]] = await db.query(
            `SELECT * FROM Song WHERE id = ?`,
            [songId]
          );

          expect(newSongRecord.name).to.equal(data.name);
          expect(newSongRecord.position).to.equal(data.position);
        } catch (err) {
          throw new Error(err);
        }
      });

      it('returns a 404 if the Song is not in the database', async () => {
        try {
          const data = songFactory();
          const { status } = await appPatch('/song/999999', data);

          expect(status).to.equal(404);
        } catch (err) {
          throw new Error(err);
        }
      });
    });
  });
});
