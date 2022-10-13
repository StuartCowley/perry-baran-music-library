const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../../src/services/db');
const app = require('../../src/app');

describe('read song', () => {
  let db;
  let artists;
  let albums;
  let songs;

  beforeEach(async () => {
    db = await getDb();

    await Promise.all([
      db.query(`INSERT INTO Artist (name, genre) VALUES (?, ?)`, [
        'Jenico',
        'Electronic',
      ]),
      db.query(`INSERT INTO Artist (name, genre) VALUES (?, ?)`, [
        'Jasmine Myra',
        'Jazz',
      ]),
    ]);

    [artists] = await db.query('SELECT * from Artist');

    await Promise.all([
      db.query(`INSERT INTO Album (name, year, artistId) VALUES (?, ?, ?)`, [
        'Dreaming of Detuned Love',
        2021,
        artists[0].id,
      ]),
      db.query(`INSERT INTO Album (name, year, artistId) VALUES (?, ?, ?)`, [
        'Ethereal',
        2019,
        artists[0].id,
      ]),
      db.query(`INSERT INTO Album (name, year, artistId) VALUES (?, ?, ?)`, [
        'Horizons',
        2022,
        artists[1].id,
      ]),
    ]);

    [albums] = await db.query('SELECT * from Album');

    await Promise.all([
      db.query(
        `INSERT INTO Song (name, position, albumId, artistId) VALUES (?, ?, ?, ?)`,
        ['Slumber', 0, albums[0].id, artists[0].id]
      ),
      db.query(
        `INSERT INTO Song (name, position, albumId, artistId) VALUES (?, ?, ?, ?)`,
        ['Your Careless Embrace', 1, albums[0].id, artists[0].id]
      ),
      db.query(
        `INSERT INTO Song (name, position, albumId, artistId) VALUES (?, ?, ?, ?)`,
        ['Distressed', 0, albums[1].id, artists[0].id]
      ),
    ]);

    [songs] = await db.query('SELECT * from Song');
  });

  afterEach(async () => {
    await db.query('DELETE FROM Artist');
    await db.query('DELETE FROM Album');
    await db.query('DELETE FROM Song');
    await db.close();
  });

  describe('/song', () => {
    describe('GET', () => {
      it('returns all song records in the database', async () => {
        const res = await request(app).get('/song').send();

        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(songs.length);

        res.body.forEach((songRecord) => {
          const expected = songs.find((song) => song.id === songRecord.id);

          expect(songRecord).to.deep.equal(expected);
        });
      });
    });

    describe('/song/{songId}', () => {
      describe('GET', () => {
        it('returns a sing song with the correct id', async () => {
          const expected = songs[0];
          const res = await request(app).get(`/song/${expected.id}`).send();

          expect(res.status).to.equal(200);
          expect(res.body).to.deep.equal(expected);
        });

        it('returns a 404 if the song is not in the database', async () => {
          const res = await request(app).get('/song/9999999').send();

          expect(res.status).to.equal(404);
        });
      });
    });

    describe('/artist/{artistId}/song', () => {
      describe('GET', () => {
        it('returns all songs records of an artist in the database', async () => {
          const { id: artistId } = artists[0];
          const res = await request(app).get(`/artist/${artistId}/song`).send();

          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(3);

          const expectedSongs = songs.filter(
            (song) => song.artistId === artistId
          );

          expect(res.body).to.deep.equal(expectedSongs);
        });

        it('return a 404 if no songs exists for that artist in the database', async () => {
          const { id: artistId } = artists[1];
          const res = await request(app).get(`/artist/${artistId}/song`).send();

          expect(res.status).to.equal(404);
        });

        it('return a 404 if the artist is not in the database', async () => {
          const res = await request(app).get(`/artist/999999999/album`).send();

          expect(res.status).to.equal(404);
        });
      });
    });

    describe('/album/{albumid}/song', () => {
      describe('GET', () => {
        it('returns all songs records of an album in the database', async () => {
          const { id: albumId } = albums[0];
          const res = await request(app).get(`/album/${albumId}/song`).send();

          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(2);

          const expectedSongs = songs.filter(
            (song) => song.albumId === albumId
          );

          expect(res.body).to.deep.equal(expectedSongs);
        });

        it('return a 404 if no songs exists for that album in the database', async () => {
          const { id: albumId } = albums[2];
          const res = await request(app).get(`/album/${albumId}/song`).send();

          expect(res.status).to.equal(404);
        });

        it('return a 404 if the album is not in the database', async () => {
          const res = await request(app).get(`/album/9999999/song`).send();

          expect(res.status).to.equal(404);
        });
      });
    });
  });
});
