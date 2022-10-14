const sinon = require('sinon');
const {
  setupArtist,
  setupAlbum,
  setupSong,
} = require('../helpers/setupHelpers');

describe('db mocks', () => {
  let db;
  let data;
  let dbMock;

  beforeEach(() => {
    db = {
      query: () => {},
    };

    dbMock = sinon.mock(db);
  });

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
      ];
    });

    it('dbMock', () => {
      dbMock
        .expects('query')
        .once()
        .withArgs('INSERT INTO Artist (name, genre) VALUES(?, ?)', [
          data[0].name,
          data[0].genre,
        ])
        .returns();

      setupArtist(db, 1, data);

      dbMock.verify();
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
      ];

      artist = { id: 0 };
    });

    it('mock', () => {
      dbMock
        .expects('query')
        .once()
        .withArgs(`INSERT INTO Album (name, year, artistId) VALUES (?, ?, ?)`, [
          data[0].name,
          data[0].year,
          artist.id,
        ])
        .returns();

      setupAlbum(db, artist, 1, data);

      dbMock.verify();
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
      ];

      album = {
        id: 0,
        artistId: 0,
      };
    });

    it('mock', () => {
      dbMock
        .expects('query')
        .once()
        .withArgs(
          `INSERT INTO Song (name, position, albumId, artistId) VALUES (?, ?, ?, ?)`,
          [data[0].name, data[0].position, album.id, album.artistId]
        )
        .returns();

      setupSong(db, album, 1, data);

      dbMock.verify();
    });
  });
});
