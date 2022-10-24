const { expect } = require('chai');
const { getDb } = require('../../src/services/db');
const { appPost } = require('../helpers/requestHelpers');
const { albumFactory } = require('../helpers/dataFactory');
const { setupArtist, tearDown } = require('../helpers/setupHelpers');

describe('create album', () => {
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

  describe('/artist/{artistId}/album`', () => {
    describe('POST', () => {
      it('creates a new album in the database if artist exists', async () => {
        try {
          const { id: artistId } = artists[0];
          const data = albumFactory();

          const { status } = await appPost(`/artist/${artistId}/album`, data);

          expect(status).to.equal(201);

          const [[albumEntries]] = await db.query(
            `SELECT * FROM Album WHERE artistId = ?`,
            [artistId]
          );

          expect(albumEntries.name).to.equal(data.name);
          expect(albumEntries.year).to.equal(data.year);
        } catch (err) {
          throw new Error(err);
        }
      });

      it('returns a 404 if the artist is not in the database', async () => {
        try {
          const data = albumFactory();
          const { status } = await appPost(`/artist/999999999/album`, data);

          expect(status).to.equal(404);
        } catch (err) {
          throw new Error(err);
        }
      });
    });
  });
});
