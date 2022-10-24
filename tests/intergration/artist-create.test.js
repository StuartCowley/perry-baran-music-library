const { expect } = require('chai');
const { getDb } = require('../../src/services/db');
const { appPost } = require('../helpers/requestHelpers');
const { artistFactory } = require('../helpers/dataFactory');
const { tearDown } = require('../helpers/setupHelpers');

describe('create artist', () => {
  let db;

  beforeEach(async () => {
    try {
      db = await getDb();
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
    describe('POST', () => {
      it('creates a new artist in the database', async () => {
        try {
          const data = artistFactory();

          const { status } = await appPost('/artist', data);

          expect(status).to.equal(201);

          const [[artistEntries]] = await db.query(
            `SELECT * FROM Artist WHERE name = ?`,
            [data.name]
          );

          expect(artistEntries.name).to.equal(data.name);
          expect(artistEntries.genre).to.equal(data.genre);
        } catch (err) {
          throw new Error(err);
        }
      });
    });
  });
});
