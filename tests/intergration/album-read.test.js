const { expect } = require('chai');
const getDb = require('../../src/services/db');
const {
  setupArtist,
  setupAlbum,
  tearDown,
} = require('../helpers/setupHelpers');
const { albumFactory } = require('../helpers/dataFactory');
const { get } = require('../helpers/requestHelpers');

describe('read album', () => {
  let db;
  let artists;
  let albums;

  beforeEach(async () => {
    db = await getDb();

    await setupArtist(db, 3);

    [artists] = await db.query('SELECT * from Artist');

    await setupAlbum(db, artists);

    [albums] = await db.query('SELECT * from Album');
  });

  afterEach(async () => {
    await tearDown(db);
  });

  describe('/album', () => {
    describe('GET', () => {
      it('returns all album records in the database', async () => {
        const { status, body } = await get('/album');

        expect(status).to.equal(200);
        expect(body.length).to.equal(albums.length);
        expect(body).to.deep.equal(albums);
      });
    });
  });

  describe('album/{albumId}', () => {
    describe('GET', () => {
      it('returns a single album with the correct id', async () => {
        const expected = albums[0];
        const { status, body } = await get(`/album/${expected.id}`);

        expect(status).to.equal(200);
        expect(body).to.deep.equal(expected);
      });
    });

    it('returns a 404 if the album is not in the database', async () => {
      const { status } = await get('/artist/999999');

      expect(status).to.equal(404);
    });
  });

  describe('artist/{artistId}/album', () => {
    describe('GET', () => {
      it('returns all albums records of an artist in the database', async () => {
        const { id: artistId } = artists[0];
        const expected = albums.filter((album) => album.artistId === artistId);

        const { status, body } = await get(`/artist/${artistId}/album`);

        expect(status).to.equal(200);
        expect(body.length).to.equal(expected.length);
        expect(body).to.deep.equal(expected);
      });

      it('return a 404 if no albums exists for that artist in the database', async () => {
        const data = albumFactory();

        //adding a new artist to the database but not adding any albums for that artist
        await db.query('INSERT INTO Artist (name, genre) VALUES(?, ?)', [
          data.name,
          data.year,
        ]);

        [artists] = await db.query('SELECT * from Artist');

        const { id: artistId } = artists[artists.length - 1];
        const { status } = await get(`/artist/${artistId}/album`);

        expect(status).to.equal(404);
      });

      it('return a 404 if the artist is not in the database', async () => {
        const { status } = await get(`/artist/99999999999/album`);

        expect(status).to.equal(404);
      });
    });
  });
});
