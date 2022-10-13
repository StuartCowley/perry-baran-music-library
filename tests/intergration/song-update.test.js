const { expect } = require('chai');
const getDb = require('../../src/services/db');
const { setupArtist, setupAlbum, setupSong, tearDown } = require('../helpers/setupHelpers');
const { patch } = require('../helpers/requestHelpers');
const { songFactory } = require('../helpers/dataFactory');

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
    describe('PATCH', () => {
      it('updates a single song with correct id', async () => {
        const { id: songId } = songs[0];
        const data = songFactory();
        const { status } = await patch(`/song/${songId}`, data);

        expect(status).to.equal(200);

        const [[newSongRecord]] = await db.query(
          `SELECT * FROM Song WHERE id = ?`,
          [songId]
        );

        expect(newSongRecord.name).to.equal(data.name);
        expect(newSongRecord.position).to.equal(data.position);
      });

      it('returns a 404 if the Song is not in the database', async () => {
        const data = songFactory();
        const { status } = await patch('/song/999999', data);

        expect(status).to.equal(404);
      });
    });
  });
});
