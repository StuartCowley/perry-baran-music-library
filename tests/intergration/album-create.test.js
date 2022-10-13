const { expect } = require('chai');
const getDb = require('../../src/services/db');
const { post } = require('../helpers/requestHelpers');
const { albumFactory } = require('../helpers/dataFactory');
const { setupArtist, tearDown } = require('../helpers/setupHelpers');

describe('create album', () => {
  let db;
  let artists;

  beforeEach(async () => {
    db = await getDb();

    await setupArtist(db, 3);
    [artists] = await db.query('SELECT * FROM Artist');
  });

  afterEach(async () => {
    await tearDown(db);
  });

  describe('/artist/{artistId}/album`', () => {
    describe('POST', () => {
      it('creates a new album in the database if artist exists', async () => {
        const { id: artistId } = artists[0];
        const data = albumFactory();

        const res = await post(`/artist/${artistId}/album`, data);

        expect(res.status).to.equal(201);

        const [[albumEntries]] = await db.query(
          `SELECT * FROM Album WHERE artistId = ?`,
          [artistId]
        );

        expect(albumEntries.name).to.equal(data.name);
        expect(albumEntries.year).to.equal(data.year);
      });

      it('returns a 404 if the artist is not in the database', async () => {
        const data = albumFactory();
        const { status } = await post(`/artist/999999999/album`, data);

        expect(status).to.equal(404);
      });
    });
  });
});
