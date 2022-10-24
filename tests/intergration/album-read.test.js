const { expect } = require('chai');
const { getDb } = require('../../src/services/db');
const {
  setupArtist,
  setupAlbum,
  tearDown,
} = require('../helpers/setupHelpers');
const { appGet } = require('../helpers/requestHelpers');

describe('read album', () => {
  let db;
  let artists;
  let albums;

  beforeEach(async () => {
    try {
      db = await getDb();

      await setupArtist(db, 3);
      [artists] = await db.query('SELECT * from Artist');

      await setupAlbum(db, artists[0], 2);
      await setupAlbum(db, artists[1]);
      [albums] = await db.query('SELECT * from Album');
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

  describe('/album', () => {
    describe('GET', () => {
      it('returns all album records in the database', async () => {
        try {
          const { status, body } = await appGet('/album');

          expect(status).to.equal(200);
          expect(body.length).to.equal(albums.length);
          expect(body).to.deep.equal(albums);
        } catch (err) {
          throw new Error(err);
        }
      });
    });
  });

  describe('album/{albumId}', () => {
    describe('GET', () => {
      it('returns a single album with the correct id', async () => {
        try {
          const expected = albums[0];
          const { status, body } = await appGet(`/album/${expected.id}`);

          expect(status).to.equal(200);
          expect(body).to.deep.equal(expected);
        } catch (err) {
          throw new Error(err);
        }
      });
    });

    it('returns a 404 if the album is not in the database', async () => {
      try {
        const { status } = await appGet('/artist/999999');

        expect(status).to.equal(404);
      } catch (err) {
        throw new Error(err);
      }
    });
  });

  describe('artist/{artistId}/album', () => {
    describe('GET', () => {
      it('returns all album records of an artist in the database', async () => {
        try {
          const { id: artistId } = artists[0];

          const { status, body } = await appGet(`/artist/${artistId}/album`);

          const expected = albums.filter(
            (album) => album.artistId === artistId
          );

          expect(status).to.equal(200);
          expect(body.length).to.equal(expected.length);
          expect(body).to.deep.equal(expected);
        } catch (err) {
          throw new Error(err);
        }
      });

      it('return a 404 if no albums exists for that artist in the database', async () => {
        try {
          const { id: artistId } = artists[artists.length - 1];
          const { status } = await appGet(`/artist/${artistId}/album`);

          expect(status).to.equal(404);
        } catch (err) {
          throw new Error(err);
        }
      });

      it('return a 404 if the artist is not in the database', async () => {
        try {
          const { status } = await appGet(`/artist/99999999999/album`);

          expect(status).to.equal(404);
        } catch (err) {
          throw new Error(err);
        }
      });
    });
  });
});
