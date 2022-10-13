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

  describe('/song/{songId}', () => {
    describe('DELETE', () => {
      it('deletes a single songwith teh correct id', async () => {
        const { id: songId } = songs[0];
        const res = await request(app).delete(`/song/${songId}`).send();

        expect(res.status).to.equal(200);

        const [[deletedSongRecord]] = await db.query(
          `SELECT * FROM Song WHERE id = ?`,
          [songId]
        );

        expect(!!deletedSongRecord).to.be.false;
      });

      it('returns a 404 if the song is not in the database', async () => {
        const res = await request(app).delete('/song/999999').send();

        expect(res.status).to.equal(404);
      });
    });
  });
});
