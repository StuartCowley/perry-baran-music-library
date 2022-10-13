const { expect } = require('chai');
const getDb = require('../../src/services/db');
const { del } = require('../helpers/requestHelpers');
const { setupArtist, tearDown } = require('../helpers/setupHelpers');

describe('delete artist', () => {
  let db;
  let artists;

  beforeEach(async () => {
    try {
      db = await getDb();

      await setupArtist(db, 3);
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

  describe('/artist/{artistId}', () => {
    describe('DELETE', () => {
      it('deletes a single artist with the correct id', async () => {
        try {
          const { id: artistId } = artists[0];
          const { status } = await del(`/artist/${artistId}`);

          expect(status).to.equal(200);

          const [[deletedArtistRecord]] = await db.query(
            'SELECT * FROM Artist WHERE id = ?',
            [artistId]
          );

          expect(!!deletedArtistRecord).to.be.false;
        } catch (err) {
          throw new Error(err);
        }
      });

      it('returns a 404 if the artist is not in the database', async () => {
        try {
          const { status } = await del('/artist/999999');

          expect(status).to.equal(404);
        } catch (err) {
          throw new Error(err);
        }
      });
    });
  });
});
