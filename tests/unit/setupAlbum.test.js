const sinon = require('sinon');
const { setupAlbum } = require('../helpers/setupHelpers');
const dataFactory = require('../helpers/dataFactory');

describe('setupAlbum', () => {
  const artist = { id: 0 };
  const db = {
    query: () => {},
  };

  afterEach(() => {
    sinon.restore();
  });

  describe('spys', () => {
    it('called once by default', async () => {
      try {
        const factorySpy = sinon.spy(dataFactory, 'albumFactory');
        const dbSpy = sinon.spy(db, 'query');

        await setupAlbum(db, artist);

        sinon.assert.calledOnce(factorySpy);
        sinon.assert.calledOnce(dbSpy);
      } catch (err) {
        throw new Error(err);
      }
    });

    it('can be called multiple times', async () => {
      try {
        const factorySpy = sinon.spy(dataFactory, 'albumFactory');
        const dbSpy = sinon.spy(db, 'query');

        await setupAlbum(db, artist, 2);

        sinon.assert.calledTwice(factorySpy);
        sinon.assert.calledTwice(dbSpy);
      } catch (err) {
        throw new Error(err);
      }
    });
  });

  describe('stubs', () => {
    const data = [
      {
        name: 'fake album',
        year: 2000,
      },
      {
        name: 'fake album 2',
        year: 2001,
      },
    ];

    it('called once', async () => {
      try {
        const dbStub = sinon.stub(db, 'query');
        const factoryStub = sinon
          .stub(dataFactory, 'albumFactory')
          .callsFake((data) => data);

        await setupAlbum(db, artist, 1, data);

        sinon.assert.calledWith(factoryStub, data[0]);
        sinon.assert.calledWith(
          dbStub,
          `INSERT INTO Album (name, year, artistId) VALUES (?, ?, ?)`,
          [data[0].name, data[0].year, artist.id]
        );
      } catch (err) {
        throw new Error(err);
      }
    });

    it('multiple times', async () => {
      try {
        const dbStub = sinon.stub(db, 'query');
        const factoryStub = sinon
          .stub(dataFactory, 'albumFactory')
          .callsFake((data) => data);

        await setupAlbum(db, artist, 2, data);

        sinon.assert.calledWith(factoryStub, data[0]);
        sinon.assert.calledWith(
          dbStub,
          `INSERT INTO Album (name, year, artistId) VALUES (?, ?, ?)`,
          [data[0].name, data[0].year, artist.id]
        );
        sinon.assert.calledWith(factoryStub, data[1]);
        sinon.assert.calledWith(
          dbStub,
          `INSERT INTO Album (name, year, artistId) VALUES (?, ?, ?)`,
          [data[1].name, data[1].year, artist.id]
        );
      } catch (err) {
        throw new Error(err);
      }
    });
  });
});
