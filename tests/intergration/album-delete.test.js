const { expect } = require('chai');
const getDb = require('../../src/services/db');
const {
  setupArtist,
  setupAlbum,
  tearDown,
} = require('../helpers/setupHelpers');
const { del } = require('../helpers/requestHelpers');

describe('delete album', () => {
  let db;
  let artists;
  let albums;

  beforeEach(async () => {
    db = await getDb();

    await setupArtist(db, 3);
    [artists] = await db.query('SELECT * from Artist');

    await setupAlbum(db, artists);
    [albums] = await db.query('SELECT * from Album');
  });

  afterEach(async () => {
    await tearDown(db);
  });

  describe('/album/{albumId}', () => {
    describe('DELETE', () => {
      it('deletes a single album with the correct id', async () => {
        const { id: albumId } = albums[0];
        const { status } = await del(`/album/${albumId}`);

        expect(status).to.equal(200);

        const [[deletedAlbumRecord]] = await db.query(
          'SELECT * FROM Album WHERE id = ?',
          [albumId]
        );

        expect(!!deletedAlbumRecord).to.be.false;
      });

      it('returns a 404 if the album is not in the database', async () => {
        const { status } = await del('/album/999999');

        expect(status).to.equal(404);
      });
    });
  });
});
