const { expect } = require('chai');
const { getDb } = require('../../src/services/db');
const {
  setupArtist,
  setupAlbum,
  tearDown,
} = require('../helpers/setupHelpers');
const { appDelete } = require('../helpers/requestHelpers');

describe('delete album', () => {
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
    describe('DELETE', () => {
      it('deletes a single album with the correct id', async () => {
        try {
          const { id: albumId } = albums[0];
          const { status } = await appDelete(`/album/${albumId}`);

          expect(status).to.equal(200);

          const [[deletedAlbumRecord]] = await db.query(
            'SELECT * FROM Album WHERE id = ?',
            [albumId]
          );

          expect(!!deletedAlbumRecord).to.be.false;
        } catch (err) {
          throw new Error(err);
        }
      });

      it('returns a 404 if the album is not in the database', async () => {
        try {
          const { status } = await appDelete('/album/999999');

          expect(status).to.equal(404);
        } catch (err) {
          throw new Error(err);
        }
      });
    });
  });
});
