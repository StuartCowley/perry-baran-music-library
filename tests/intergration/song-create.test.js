const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../../src/services/db');
const app = require('../../src/app');

describe('create song', () => {
  let db;
  let artists;
  let albums;

  beforeEach(async () => {
    db = await getDb();

    await db.query('INSERT INTO Artist (name, genre) VALUES(?, ?)', [
      'Jenico',
      'Electronic',
    ]);

    [artists] = await db.query('SELECT * FROM Artist');

    await db.query('INSERT INTO Album (name, year, artistId) VALUES(?, ?, ?)', [
      'Dreaming of Detuned Love',
      2021,
      artists[0].id,
    ]);

    [albums] = await db.query('SELECT * FROM Album');
  });

  afterEach(async () => {
    await db.query('DELETE FROM Artist');
    await db.query('DELETE FROM Album');
    await db.close();
  });

  describe('/album/{albumId}/song', () => {
    describe('POST', () => {
      it('creates a new song in the databse if the album exists', async () => {
        const [{ id: albumId }] = albums;
        const [{ id: artistId }] = artists;
        const res = await request(app).post(`/album/${albumId}/song`).send({
          name: 'Slumber',
          position: 0,
        });

        expect(res.status).to.equal(201);

        const [[songEntries]] = await db.query(
          `SELECT * FROM Song WHERE name = 'Slumber'`
        );

        expect(songEntries.position).to.equal(0);
        expect(songEntries.albumId).to.equal(albumId);
        expect(songEntries.artistId).to.equal(artistId);
      });

      it('returns a 404 if the album is not in the database', async () => {
        const res = await request(app).post(`/album/999999999/song`).send({
          name: 'Slumber',
          length: 98,
        });

        expect(res.status).to.equal(404);
      });
    });
  });
});
