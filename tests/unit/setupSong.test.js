const sinon = require('sinon');
const { setupSong } = require('../helpers/setupHelpers');
const dataFactory = require('../helpers/dataFactory');

describe('setupSong', () => {
  const album = {
    id: 0,
    artistId: 0,
  };
  const db = {
    query: () => {},
  };

  afterEach(() => {
    sinon.restore();
  });

  describe('spys', () => {
    it('called once by default', async () => {
      try {
        const factorySpy = sinon.spy(dataFactory, 'songFactory');
        const dbSpy = sinon.spy(db, 'query');

        await setupSong(db, album);

        sinon.assert.calledOnce(factorySpy);
        sinon.assert.calledOnce(dbSpy);
      } catch (err) {
        throw new Error(err);
      }
    });

    it('can be called multiple times', async () => {
      try {
        const factorySpy = sinon.spy(dataFactory, 'songFactory');
        const dbSpy = sinon.spy(db, 'query');

        await setupSong(db, album, 2);

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
        name: 'fake song',
        position: 0,
      },
      {
        name: 'fake song 2',
        position: 1,
      },
    ];

    it('called once', async () => {
      try {
        const dbStub = sinon.stub(db, 'query');
        const factoryStub = sinon
          .stub(dataFactory, 'songFactory')
          .callsFake((data) => data);

        await setupSong(db, album, 1, data);

        sinon.assert.calledWith(factoryStub, data[0]);
        sinon.assert.calledWith(
          dbStub,
          `INSERT INTO Song (name, position, albumId, artistId) VALUES (?, ?, ?, ?)`,
          [data[0].name, data[0].position, album.id, album.artistId]
        );
      } catch (err) {
        throw new Error(err);
      }
    });

    it('called multiple times', async () => {
      try {
        const dbStub = sinon.stub(db, 'query');
        const factoryStub = sinon
          .stub(dataFactory, 'songFactory')
          .callsFake((data) => data);

        await setupSong(db, album, 2, data);

        sinon.assert.calledWith(factoryStub, data[0]);
        sinon.assert.calledWith(
          dbStub,
          `INSERT INTO Song (name, position, albumId, artistId) VALUES (?, ?, ?, ?)`,
          [data[0].name, data[0].position, album.id, album.artistId]
        );
        sinon.assert.calledWith(factoryStub, data[1]);
        sinon.assert.calledWith(
          dbStub,
          `INSERT INTO Song (name, position, albumId, artistId) VALUES (?, ?, ?, ?)`,
          [data[1].name, data[1].position, album.id, album.artistId]
        );
      } catch (err) {
        throw new Error(err);
      }
    });
  });
});
