const { expect } = require('chai');
const getDb = require('../../src/services/db');
const { get } = require('../helpers/requestHelpers');
const { setupArtist, tearDown } = require('../helpers/setupHelpers');

describe('read artist', () => {
  let db;
  let artists;

  beforeEach(async () => {
    db = await getDb();

    await setupArtist(db, 3);

    [artists] = await db.query('SELECT * from Artist');
  });

  afterEach(async () => {
    await tearDown(db);
  });

  describe('/artist', () => {
    describe('GET', () => {
      it('returns all artist records in the database', async () => {
        const { status, body } = await get('/artist');

        expect(status).to.equal(200);
        expect(body.length).to.equal(artists.length);
        expect(body).to.deep.equal(artists);
      });
    });
  });

  describe('/artist/{artistId}', () => {
    describe('GET', () => {
      it('returns a single artist with the correct id', async () => {
        const expected = artists[0];
        const { status, body } = await get(`/artist/${expected.id}`);

        expect(status).to.equal(200);
        expect(body).to.deep.equal(expected);
      });

      it('returns a 404 if the artist is not in the database', async () => {
        const { status } = await get('/artist/999999');

        expect(status).to.equal(404);
      });
    });
  });
});
