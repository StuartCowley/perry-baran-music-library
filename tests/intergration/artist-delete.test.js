const { expect } = require('chai');
const getDb = require('../../src/services/db');
const app = require('../../src/app');
const { del } = require('../helpers/requestHelpers');
const { setupArtist } = require('../helpers/setupHelpers');

describe('delete artist', () => {
  let db;
  let artists;

  beforeEach(async () => {
    db = await getDb();
    
    await setupArtist(db, 3);

    [artists] = await db.query('SELECT * from Artist');
  });

  afterEach(async () => {
    await db.query('DELETE FROM Artist');
    await db.close();
  });

  describe('/artist/{artistId}', () => {
    describe('DELETE', () => {
      it('deletes a single artist with the correct id', async () => {
        const { id: artistId } = artists[0];
        const { status } = await del(app, `/artist/${artistId}`);

        expect(status).to.equal(200);

        const [[deletedArtistRecord]] = await db.query(
          'SELECT * FROM Artist WHERE id = ?',
          [artistId]
        );

        expect(!!deletedArtistRecord).to.be.false;
      });

      it('returns a 404 if the artist is not in the database', async () => {
        const { status } = await del(app, '/artist/999999');

        expect(status).to.equal(404);
      });
    });
  });
});
