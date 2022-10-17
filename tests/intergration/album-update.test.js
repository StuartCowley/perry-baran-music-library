const { expect } = require('chai');
const { getDb } = require('../../src/services/db');
const {
  setupArtist,
  setupAlbum,
  tearDown,
} = require('../helpers/setupHelpers');
const { appPatch } = require('../helpers/requestHelpers');
const { albumFactory } = require('../helpers/dataFactory');

describe('update album', () => {
  let db;
  let artists;
  let albums;

  beforeEach(async () => {
    try {
      db = await getDb();

      await setupArtist(db);
      [artists] = await db.query('SELECT * from Artist');

      await setupAlbum(db, artists[0], 2);
      [albums] = await db.query('SELECT * from Album');
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

  describe('/album/{albumId}', () => {
    describe('PATCH', () => {
      it('updates a single album with the correct id', async () => {
        try {
          const { id: albumId } = albums[0];
          const data = albumFactory();

          const { status } = await appPatch(`/album/${albumId}`, data);

          expect(status).to.equal(200);

          const [[newAlbumRecord]] = await db.query(
            `SELECT * FROM Album WHERE id = ?`,
            [albumId]
          );

          expect(newAlbumRecord.name).to.equal(data.name);
          expect(newAlbumRecord.year).to.equal(data.year);
        } catch (err) {
          throw new Error(err);
        }
      });
    });

    it('returns a 404 if the album is not in the database', async () => {
      try {
        const data = albumFactory();
        const { status } = await appPatch('/album/999999', data);

        expect(status).to.equal(404);
      } catch (err) {
        throw new Error(err);
      }
    });
  });
});
