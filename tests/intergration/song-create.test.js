const { expect } = require('chai');
const { getDb } = require('../../src/services/db');
const { appPost } = require('../helpers/requestHelpers');
const { songFactory } = require('../helpers/dataFactory');
const {
  setupArtist,
  setupAlbum,
  tearDown,
} = require('../helpers/setupHelpers');

describe('create song', () => {
  let db;
  let artists;
  let albums;

  beforeEach(async () => {
    try {
      db = await getDb();

      await setupArtist(db);
      [artists] = await db.query('SELECT * FROM Artist');

      await setupAlbum(db, artists[0], 2);
      [albums] = await db.query('SELECT * FROM Album');
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

  describe('/album/{albumId}/song', () => {
    describe('POST', () => {
      it('creates a new song in the database if the album exists', async () => {
        try {
          const { id: albumId } = albums[0];
          const data = songFactory();

          const { status } = await appPost(`/album/${albumId}/song`, data);

          expect(status).to.equal(201);

          const { id: artistId } = artists[0];
          const [[songEntries]] = await db.query(
            `SELECT * FROM Song WHERE name = ?`,
            [data.name]
          );

          expect(songEntries.name).to.equal(data.name);
          expect(songEntries.position).to.equal(data.position);
          expect(songEntries.albumId).to.equal(albumId);
          expect(songEntries.artistId).to.equal(artistId);
        } catch (err) {
          throw new Error(err);
        }
      });

      it('returns a 404 if the album is not in the database', async () => {
        try {
          const data = songFactory();

          const { status } = await appPost(`/album/999999999/song`, data);

          expect(status).to.equal(404);
        } catch (err) {
          throw new Error(err);
        }
      });
    });
  });
});
