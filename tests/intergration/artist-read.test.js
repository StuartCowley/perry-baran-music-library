const { expect } = require('chai');
const { getDb } = require('../../src/services/db');
const { appGet } = require('../helpers/requestHelpers');
const { setupArtist, tearDown } = require('../helpers/setupHelpers');

describe('read artist', () => {
  let db;
  let artists;

  beforeEach(async () => {
    try {
      db = await getDb();

      await setupArtist(db, 2);
      [artists] = await db.query('SELECT * from Artist');
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

  describe('/artist', () => {
    describe('GET', () => {
      it('returns all artist records in the database', async () => {
        try {
          const { status, body } = await appGet('/artist');

          expect(status).to.equal(200);
          expect(body.length).to.equal(artists.length);
          expect(body).to.deep.equal(artists);
        } catch (err) {
          throw new Error(err);
        }
      });
    });
  });

  describe('/artist/{artistId}', () => {
    describe('GET', () => {
      it('returns a single artist with the correct id', async () => {
        try {
          const expected = artists[0];
          const { status, body } = await appGet(`/artist/${expected.id}`);

          expect(status).to.equal(200);
          expect(body).to.deep.equal(expected);
        } catch (err) {
          throw new Error(err);
        }
      });

      it('returns a 404 if the artist is not in the database', async () => {
        try {
          const { status } = await appGet('/artist/999999');

          expect(status).to.equal(404);
        } catch (err) {
          throw new Error(err);
        }
      });
    });
  });
});
