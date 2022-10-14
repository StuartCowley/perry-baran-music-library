const sinon = require('sinon');
const { setupArtist } = require('../helpers/setupHelpers');
const dataFactory = require('../helpers/dataFactory');

describe('setupArtist', () => {
  const db = {
    query: () => {},
  };

  afterEach(() => {
    sinon.restore();
  });

  describe('spys', () => {
    it('calls once by default', async () => {
      try {
        const factorySpy = sinon.spy(dataFactory, 'artistFactory');
        const dbSpy = sinon.spy(db, 'query');

        await setupArtist(db);

        sinon.assert.calledOnce(factorySpy);
        sinon.assert.calledOnce(dbSpy);
      } catch (err) {
        throw new Error(err);
      }
    });

    it('can be called multple times', async () => {
      try {
        const factorySpy = sinon.spy(dataFactory, 'artistFactory');
        const dbSpy = sinon.spy(db, 'query');

        await setupArtist(db, 2);

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
        name: 'fake artist',
        genre: 'fake genre',
      },
      {
        name: 'fake artist 2',
        genre: ' fake genre 2',
      },
    ];

    it('called once', async () => {
      try {
        const factoryStub = sinon
          .stub(dataFactory, 'artistFactory')
          .callsFake((data) => data);
        const dbStub = sinon.stub(db, 'query');

        await setupArtist(db, 1, data);

        sinon.assert.calledWith(factoryStub, data[0]);
        sinon.assert.calledWith(
          dbStub,
          `INSERT INTO Artist (name, genre) VALUES(?, ?)`,
          [data[0].name, data[0].genre]
        );
      } catch (err) {
        throw new Error(err);
      }
    });

    it('called multiple times', async () => {
      try {
        const dbStub = sinon.stub(db, 'query');
        const factoryStub = sinon
          .stub(dataFactory, 'artistFactory')
          .callsFake((data) => data);

        await setupArtist(db, 2, data);

        sinon.assert.calledWith(factoryStub, data[0]);
        sinon.assert.calledWith(
          dbStub,
          `INSERT INTO Artist (name, genre) VALUES(?, ?)`,
          [data[0].name, data[0].genre]
        );
        sinon.assert.calledWith(factoryStub, data[1]);
        sinon.assert.calledWith(
          dbStub,
          `INSERT INTO Artist (name, genre) VALUES(?, ?)`,
          [data[1].name, data[1].genre]
        );
      } catch (err) {
        throw new Error(err);
      }
    });
  });
});
