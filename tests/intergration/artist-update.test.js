const { expect } = require('chai');
const { getDb } = require('../../src/services/db');
const { artistFactory } = require('../helpers/dataFactory');
const { appPatch } = require('../helpers/requestHelpers');
const { setupArtist, tearDown } = require('../helpers/setupHelpers');

describe('update artist', () => {
  let db;
  let artists;

  beforeEach(async () => {
    try {
      db = await getDb();

      await setupArtist(db, 2);
      [artists] = await db.query('SELECT * FROM Artist');
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
    describe('PATCH', () => {
      it('updates a single artist with the correct id', async () => {
        try {
          const { id: artistId } = artists[0];
          const data = artistFactory();

          const { status } = await appPatch(`/artist/${artistId}`, data);

          expect(status).to.equal(200);

          const [[newArtistRecord]] = await db.query(
            'SELECT * FROM Artist WHERE id = ?',
            [artistId]
          );

          expect(newArtistRecord.name).to.equal(data.name);
          expect(newArtistRecord.genre).to.equal(data.genre);
        } catch (err) {
          throw new Error(err);
        }
      });

      it('returns a 404 if the artist is not in the database', async () => {
        try {
          const data = artistFactory();

          const { status } = await appPatch('/artist/999999', data);

          expect(status).to.equal(404);
        } catch (err) {
          throw new Error(err);
        }
      });
    });
  });
});
