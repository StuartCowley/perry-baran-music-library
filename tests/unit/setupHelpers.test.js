const sinon = require('sinon');
const {
  setupArtist,
  setupAlbum,
  setupSong,
  tearDown,
} = require('../helpers/setupHelpers');
const dataFactory = require('../helpers/dataFactory');

describe('sinon', () => {
  let db = {
    query: () => {},
    close: () => {},
  };
  let data;

  afterEach(() => {
    sinon.restore();
  });

  describe('setupArtist', () => {
    beforeEach(() => {
      data = [
        {
          name: 'fake artist',
          genre: 'fake genre',
        },
        {
          name: 'fake artist 2',
          genre: ' fake genre 2',
        },
      ];
    });

    describe('spys', () => {
      it('calls once by default', async () => {
        const factorySpy = sinon.spy(dataFactory, 'artistFactory');
        const dbSpy = sinon.spy(db, 'query');

        await setupArtist(db);

        sinon.assert.calledOnce(factorySpy);
        sinon.assert.calledOnce(dbSpy);
      });

      it('can be called multple times', async () => {
        const factorySpy = sinon.spy(dataFactory, 'artistFactory');
        const dbSpy = sinon.spy(db, 'query');

        await setupArtist(db, 2);

        sinon.assert.calledTwice(factorySpy);
        sinon.assert.calledTwice(dbSpy);
      });
    });

    describe('stub', () => {
      it('called once', async () => {
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
      });

      it('called multiple times', async () => {
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
      });
    });
  });

  describe('setupAlbum', () => {
    let artist;

    beforeEach(() => {
      data = [
        {
          name: 'fake album',
          year: 2000,
        },
        {
          name: 'fake album 2',
          year: 2001,
        },
      ];

      artist = { id: 0 };
    });

    describe('spys', () => {
      it('called once by default', async () => {
        const factorySpy = sinon.spy(dataFactory, 'albumFactory');
        const dbSpy = sinon.spy(db, 'query');

        await setupAlbum(db, artist);

        sinon.assert.calledOnce(factorySpy);
        sinon.assert.calledOnce(dbSpy);
      });

      it('can be called multiple times', async () => {
        const factorySpy = sinon.spy(dataFactory, 'albumFactory');
        const dbSpy = sinon.spy(db, 'query');

        await setupAlbum(db, artist, 2);

        sinon.assert.calledTwice(factorySpy);
        sinon.assert.calledTwice(dbSpy);
      });
    });

    describe('stubs', () => {
      it('called once', async () => {
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
      });

      it('multiple times', async () => {
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
      });
    });
  });

  describe('setupSong', () => {
    let album;

    beforeEach(() => {
      data = [
        {
          name: 'fake song',
          position: 0,
        },
        {
          name: 'fake song 2',
          position: 1,
        },
      ];

      album = {
        id: 0,
        artistId: 0,
      };
    });

    describe('spys', () => {
      it('called once by default', async () => {
        const factorySpy = sinon.spy(dataFactory, 'songFactory');
        const dbSpy = sinon.spy(db, 'query');

        await setupSong(db, album);

        sinon.assert.calledOnce(factorySpy);
        sinon.assert.calledOnce(dbSpy);
      });

      it('can be called multiple times', async () => {
        const factorySpy = sinon.spy(dataFactory, 'songFactory');
        const dbSpy = sinon.spy(db, 'query');

        await setupSong(db, album, 2);

        sinon.assert.calledTwice(factorySpy);
        sinon.assert.calledTwice(dbSpy);
      });
    });

    describe('stubs', () => {
      it('called once', async () => {
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
      });

      it('called multiple times', async () => {
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
      });
    });
  });

  describe('tearDown', () => {
    it('spys', async () => {
      const querySpy = sinon.spy(db, 'query');
      const closeSpy = sinon.spy(db, 'close');

      await tearDown(db);

      sinon.assert.calledThrice(querySpy);
      sinon.assert.calledOnce(closeSpy);
    });

    it('stubs', async () => {
      const queryStub = sinon.stub(db, 'query');

      await tearDown(db);

      sinon.assert.calledWith(queryStub, 'DELETE FROM Artist');
      sinon.assert.calledWith(queryStub, 'DELETE FROM Album');
      sinon.assert.calledWith(queryStub, 'DELETE FROM Song');
    });
  });
});
