const { expect } = require('chai');
const getDb = require('../../src/services/db');
const { del } = require('../helpers/requestHelpers');
const { setupArtist, tearDown } = require('../helpers/setupHelpers');

describe('delete artist', () => {
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

  describe('/artist/{artistId}', () => {
    describe('DELETE', () => {
      it('deletes a single artist with the correct id', async () => {
        const { id: artistId } = artists[0];
        const { status } = await del(`/artist/${artistId}`);

        expect(status).to.equal(200);

        const [[deletedArtistRecord]] = await db.query(
          'SELECT * FROM Artist WHERE id = ?',
          [artistId]
        );

        expect(!!deletedArtistRecord).to.be.false;
      });

      it('returns a 404 if the artist is not in the database', async () => {
        const { status } = await del('/artist/999999');

        expect(status).to.equal(404);
      });
    });
  });
});
