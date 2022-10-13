const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../../src/services/db');
const app = require('../../src/app');

describe('create album', () => {
  let db;
  let artists;

  beforeEach(async () => {
    db = await getDb();

    await db.query('INSERT INTO Artist (name, genre) VALUES (?, ?)', [
      'Jenico',
      'Electronic',
    ]);

    [artists] = await db.query('SELECT * FROM Artist');
  });

  afterEach(async () => {
    await db.query('DELETE FROM Album');
    await db.close();
  });

  describe('/artist/{artistId}/album`', () => {
    describe('POST', () => {
      it('creates a new album in the database if artist exists', async () => {
        const { id: artistId } = artists[0];
        const res = await request(app).post(`/artist/${artistId}/album`).send({
          name: 'Dreaming of Detuned Love',
          year: 2021,
        });

        expect(res.status).to.equal(201);

        const [[albumEntries]] = await db.query(
          `SELECT * FROM Album WHERE name = 'Dreaming of Detuned Love'`
        );

        expect(albumEntries.year).to.equal(2021);
        expect(albumEntries.artistId).to.equal(artistId);
      });

      it('returns a 404 if the artist is not in the database', async () => {
        const res = await request(app).post(`/artist/999999999/album`).send({
          name: 'Dreaming of Detuned Love',
          year: 2021,
        });

        expect(res.status).to.equal(404);
      });
    });
  });
});
