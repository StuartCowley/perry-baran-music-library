const { expect } = require('chai');
const getDb = require('../../src/services/db');
const app = require('../../src/app');
const { artistFactory } = require('../helpers/dataFactory');
const { patch } = require('../helpers/requestHelpers');
const { setupArtist } = require('../helpers/setupHelpers');

describe('update artist', () => {
  let db;
  let artists;

  beforeEach(async () => {
    db = await getDb();
    
    await setupArtist(db, 3);

    [artists] = await db.query('SELECT * FROM Artist');
  });

  afterEach(async () => {
    await db.query('DELETE FROM Artist');
    await db.close();
  });

  describe('/artist/{artistId}', () => {
    describe('PATCH', () => {
      it('updates a single artist with the correct id', async () => {
        const { id: artistId } = artists[0];
        const data = artistFactory();

        const { status } = await patch(app, `/artist/${artistId}`, data);

        expect(status).to.equal(200);

        const [[newArtistRecord]] = await db.query(
          'SELECT * FROM Artist WHERE id = ?',
          [artistId]
        );

        expect(newArtistRecord.name).to.equal(data.name);
        expect(newArtistRecord.genre).to.equal(data.genre);
      });

      it('returns a 404 if the artist is not in the database', async () => {
        const data = artistFactory();
        
        const { status } = await patch(app, '/artist/999999', data);

        expect(status).to.equal(404);
      });
    });
  });
});
