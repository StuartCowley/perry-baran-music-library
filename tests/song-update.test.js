const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');

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
    describe('PATCH', () => {
      it('updates a single song with correct id', async () => {
        const { id: songId } = songs[0];
        const res = await request(app)
          .patch(`/song/${songId}`)
          .send({ name: 'Restless Thoughts', position: 2});

          expect(res.status).to.equal(200);

          const [[newSongRecord]] = await db.query(
            `SELECT * FROM Song WHERE id = ?`,
            [songId]
          );

          expect(newSongRecord.name).to.equal('Restless Thoughts');
          expect(newSongRecord.position).to.equal(2);
      });

      it('returns a 404 if the Song is not in the database', async () => {
        const res = await request(app)
          .patch('/song/999999')
          .send({ name: 'test' });
  
        expect(res.status).to.equal(404);
      });
    });
  });
});