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
        expect(res.body.length).to.equal(4);

        res.body.forEach((albumRecord) => {
          const expected = albums.find((album) => album.id === albumRecord.id);

          expect(albumRecord).to.deep.equal(expected);
        });
      });
    });
  });
});
