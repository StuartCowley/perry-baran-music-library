const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');

describe('read album', () => {
  let db;
  let artists;
  let albums;

  beforeEach(async () => {
    db = await getDb();

    await Promise.all([
      db.query(`INSERT INTO Artist (name, genre) VALUES(?, ?)`, [
        'Jenico',
        'Electronic',
      ]),
      db.query(`INSERT INTO Artist (name, genre) VALUES(?, ?)`, [
        'Tame Impala',
        'rock',
      ]),
      db.query(`INSERT INTO Artist (name, genre) VALUES(?, ?)`, [
        'Jasmine Myra',
        'Jazz',
      ]),
    ]);

    [artists] = await db.query('SELECT * from Artist');

    await Promise.all([
      db.query(`INSERT INTO Album (name, year, artistId) VALUE (?, ?, ?)`, [
        'Dreaming of Detuned Love',
        2021,
        artists[0].id,
      ]),
      db.query(`INSERT INTO Album (name, year, artistId) VALUE (?, ?, ?)`, [
        'Ethereal',
        2019,
        artists[0].id,
      ]),
      db.query(`INSERT INTO Album (name, year, artistId) VALUE (?, ?, ?)`, [
        'Currents',
        2015,
        artists[1].id,
      ]),
      db.query(`INSERT INTO Album (name, year, artistId) VALUE (?, ?, ?)`, [
        'Horizons',
        2022,
        artists[2].id,
      ]),
    ]);

    [albums] = await db.query('SELECT * from Album');
  });

  afterEach(async () => {
    await db.query('DELETE FROM Artist');
    await db.query('DELETE FROM Album');
    await db.close();
  });

  describe('/album', () => {
    describe('GET', () => {
      it('returns all album records in the database', async () => {
        const res = await request(app).get('/album').send();

        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(albums.length);

        res.body.forEach((albumRecord) => {
          const expected = albums.find((album) => album.id === albumRecord.id);

          expect(albumRecord).to.deep.equal(expected);
        });
      });
    });
  });

  describe('album/:albumId', () => {
    describe('GET', () => {
      it('returns a single album with the correct id', async () => {
          const expected = albums[0]
          const res = await request(app).get(`/album/${expected.id}`).send();
          
          expect(res.status).to.equal(200);
          expect(res.body).to.deep.equal(expected);
      });
    });

    it('returns a 404 if the album is not in the database', async () => {
      const res = await request(app).get('/artist/999999').send();

      expect(res.status).to.equal(404);
    });
  });

  describe('artist/:artistId/album', () => {
    describe('GET', () => {
      it('returns all albums records of an artist in the database', async () => {
        const { id: artistId } = artists[0];
        const res = await request(app).get(`/artist/${artistId}/album`).send();

        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(2);

        res.body.forEach((albumRecord) => {
          expect(albumRecord.artistId).to.equal(artistId);
        });
      });
    });
  });
});
