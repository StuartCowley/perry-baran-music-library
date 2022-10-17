const { expect } = require('chai');
const { getDb } = require('../../src/services/db');
const { appGet } = require('../helpers/requestHelpers');
const {
  setupArtist,
  setupAlbum,
  setupSong,
  tearDown,
} = require('../helpers/setupHelpers');

describe('read song', () => {
  let db;
  let artists;
  let albums;
  let songs;

  beforeEach(async () => {
    try {
      db = await getDb();

      await setupArtist(db, 3);
      [artists] = await db.query('SELECT * from Artist');

      //add an album to the database to all but the last artist
      const albumLoop = artists.length - 1;
      for (let i = 0; i < albumLoop; i++) {
        await setupAlbum(db, artists[i]);
      }

      [albums] = await db.query('SELECT * from Album');

      //adds 2 songs to the database to all but the last album
      const songLoop = albums.length - 1;
      for (let i = 0; i < songLoop; i++) {
        await setupSong(db, albums[i], 2);
      }

      [songs] = await db.query('SELECT * from Song');
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

  describe('/song', () => {
    describe('GET', () => {
      it('returns all song records in the database', async () => {
        try {
          const { status, body } = await appGet('/song');

          expect(status).to.equal(200);
          expect(body.length).to.equal(songs.length);
          expect(body).to.deep.equal(songs);
        } catch (err) {
          throw new Error(err);
        }
      });
    });

    describe('/song/{songId}', () => {
      describe('GET', () => {
        it('returns a song with the correct id', async () => {
          try {
            const expected = songs[0];
            const { status, body } = await appGet(`/song/${expected.id}`);

            expect(status).to.equal(200);
            expect(body).to.deep.equal(expected);
          } catch (err) {
            throw new Error(err);
          }
        });

        it('returns a 404 if the song is not in the database', async () => {
          try {
            const { status } = await appGet('/song/9999999');

            expect(status).to.equal(404);
          } catch (err) {
            throw new Error(err);
          }
        });
      });
    });

    describe('/artist/{artistId}/song', () => {
      describe('GET', () => {
        it('returns all songs records of an artist in the database', async () => {
          try {
            const { id: artistId } = artists[0];
            const { status, body } = await appGet(`/artist/${artistId}/song`);

            expect(status).to.equal(200);

            const expectedSongs = songs.filter(
              (song) => song.artistId === artistId
            );

            expect(body.length).to.equal(expectedSongs.length);
            expect(body).to.deep.equal(expectedSongs);
          } catch (err) {
            throw new Error(err);
          }
        });

        it('return a 404 if no songs exists for that artist in the database', async () => {
          try {
            const { id: artistId } = artists[artists.length - 1];
            const { status } = await appGet(`/artist/${artistId}/song`);

            expect(status).to.equal(404);
          } catch (err) {
            throw new Error(err);
          }
        });

        it('return a 404 if the artist is not in the database', async () => {
          try {
            const { status } = await appGet(`/artist/999999999/album`);

            expect(status).to.equal(404);
          } catch (err) {
            throw new Error(err);
          }
        });
      });
    });

    describe('/album/{albumid}/song', () => {
      describe('GET', () => {
        it('returns all songs records of an album in the database', async () => {
          try {
            const { id: albumId } = albums[0];
            const { status, body } = await appGet(`/album/${albumId}/song`);

            expect(status).to.equal(200);

            const expectedSongs = songs.filter(
              (song) => song.albumId === albumId
            );

            expect(body.length).to.equal(expectedSongs.length);
            expect(body).to.deep.equal(expectedSongs);
          } catch (err) {
            throw new Error(err);
          }
        });

        it('return a 404 if no songs exists for that album in the database', async () => {
          try {
            const { id: albumId } = albums[albums.length - 1];
            const { status } = await appGet(`/album/${albumId}/song`);

            expect(status).to.equal(404);
          } catch (err) {
            throw new Error(err);
          }
        });

        it('return a 404 if the album is not in the database', async () => {
          try {
            const { status } = await appGet(`/album/9999999/song`);

            expect(status).to.equal(404);
          } catch (err) {
            throw new Error(err);
          }
        });
      });
    });
  });
});
