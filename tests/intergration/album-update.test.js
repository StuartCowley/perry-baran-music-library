const { expect } = require('chai');
const getDb = require('../../src/services/db');
const {
  setupArtist,
  setupAlbum,
  tearDown,
} = require('../helpers/setupHelpers');
const { patch } = require('../helpers/requestHelpers');
const { albumFactory } = require('../helpers/dataFactory');

describe('update album', () => {
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
    describe('PATCH', () => {
      it('updates a single album with the correct id', async () => {
        const { id: albumId } = albums[0];
        const data = albumFactory();

        const { status } = await patch(`/album/${albumId}`, data);

        expect(status).to.equal(200);

        const [[newAlbumRecord]] = await db.query(
          `SELECT * FROM Album WHERE id = ?`,
          [albumId]
        );

        expect(newAlbumRecord.name).to.equal(data.name);
        expect(newAlbumRecord.year).to.equal(data.year);
      });
    });

    it('returns a 404 if the album is not in the database', async () => {
      const data = albumFactory();
      const { status } = await patch('/album/999999', data);

      expect(status).to.equal(404);
    });
  });
});
