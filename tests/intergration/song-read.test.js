const { expect } = require('chai');
const getDb = require('../../src/services/db');
const { get } = require('../helpers/requestHelpers');
const { setupArtist, setupAlbum, setupSong, tearDown } = require('../helpers/setupHelpers');
const { songFactory } = require('../helpers/dataFactory');

describe('read song', () => {
  let db;
  let artists;
  let albums;
  let songs;

  beforeEach(async () => {
    db = await getDb();

    await setupArtist(db, 3);
    [artists] = await db.query('SELECT * from Artist');

    await setupAlbum(db, artists);
    [albums] = await db.query('SELECT * from Album');

    await setupSong(db, albums);
    [songs] = await db.query('SELECT * from Song');
  });

  afterEach(async () => {
    await tearDown(db);
  });

  describe('/song', () => {
    describe('GET', () => {
      it('returns all song records in the database', async () => {
        const { status, body } = await get('/song');

        expect(status).to.equal(200);
        expect(body.length).to.equal(songs.length);
        expect(body).to.deep.equal(songs);
      });
    });

    describe('/song/{songId}', () => {
      describe('GET', () => {
        it('returns a sing song with the correct id', async () => {
          const expected = songs[0];
          const { status, body } = await get(`/song/${expected.id}`);

          expect(status).to.equal(200);
          expect(body).to.deep.equal(expected);
        });

        it('returns a 404 if the song is not in the database', async () => {
          const { status } = await get('/song/9999999');

          expect(status).to.equal(404);
        });
      });
    });

    describe('/artist/{artistId}/song', () => {
      describe('GET', () => {
        it('returns all songs records of an artist in the database', async () => {
          const { id: artistId } = artists[0];
          const { status, body } = await get(`/artist/${artistId}/song`);

          expect(status).to.equal(200);

          const expectedSongs = songs.filter(
            (song) => song.artistId === artistId
          );

          expect(body.length).to.equal(expectedSongs.length);
          expect(body).to.deep.equal(expectedSongs);
        });

        it('return a 404 if no songs exists for that artist in the database', async () => {
          const data = songFactory();

          //add an artist to the database but not adding any songs
          await db.query('INSERT INTO Artist (name, genre) VALUES(?, ?)', [
            data.name,
            data.year,
          ]);

          [artists] = await db.query('SELECT * from Artist');

          const { id: artistId } = artists[artists.length - 1];
          const { status } = await get(`/artist/${artistId}/song`);

          expect(status).to.equal(404);
        });

        it('return a 404 if the artist is not in the database', async () => {
          const { status } = await get(`/artist/999999999/album`);

          expect(status).to.equal(404);
        });
      });
    });

    describe('/album/{albumid}/song', () => {
      describe('GET', () => {
        it('returns all songs records of an album in the database', async () => {
          const { id: albumId } = albums[0];
          const { status, body} = await get(`/album/${albumId}/song`);

          expect(status).to.equal(200);
        
          const expectedSongs = songs.filter(
            (song) => song.albumId === albumId
          );
          
          expect(body.length).to.equal(expectedSongs.length);
          expect(body).to.deep.equal(expectedSongs);
        });

        it('return a 404 if no songs exists for that album in the database', async () => {
          const data = songFactory();

          //add an artist and album to the database but not adding any songs
          await db.query('INSERT INTO Artist (name, genre) VALUES(?, ?)', [
            data.name,
            data.year,
          ]);

          [artists] = await db.query('SELECT * from Artist');

          const { id: artistId } = artists[artists.length - 1];

          await db.query(
            `INSERT INTO Album (name, year, artistId) VALUES (?, ?, ?)`,
            [data.name, data.year, artistId]
          );

          [albums] = await db.query('SELECT * from Artist');

          const { id: albumId } = albums[albums.length - 1];
          const { status } = await get(`/album/${albumId}/song`);

          expect(status).to.equal(404);
        });

        it('return a 404 if the album is not in the database', async () => {
          const { status } = await get(`/album/9999999/song`);

          expect(status).to.equal(404);
        });
      });
    });
  });
});
