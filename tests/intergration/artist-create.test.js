const { expect } = require('chai');
const getDb = require('../../src/services/db');
const { post } = require('../helpers/requestHelpers');
const { artistFactory } = require('../helpers/dataFactory');
const { tearDown } = require('../helpers/setupHelpers');

describe('create artist', () => {
  let db;

  beforeEach(async () => (db = await getDb()));

  afterEach(async () => {
    await tearDown(db);
  });

  describe('/artist', () => {
    describe('POST', () => {
      it('creates a new artist in the database', async () => {
        const data = artistFactory();

        const { status } = await post('/artist', data);

        expect(status).to.equal(201);

        const [[artistEntries]] = await db.query(
          `SELECT * FROM Artist WHERE name = ?`,
          [data.name]
        );

        expect(artistEntries.name).to.equal(data.name);
        expect(artistEntries.genre).to.equal(data.genre);
      });
    });
  });
});
