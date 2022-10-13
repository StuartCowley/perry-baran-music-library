const { expect } = require('chai');
const getDb = require('../../src/services/db');
const { post } = require('../helpers/requestHelpers');
const { songFactory } = require('../helpers/dataFactory');
const { setupArtist, setupAlbum, tearDown } = require('../helpers/setupHelpers');

describe('create song', () => {
  let db;
  let artists;
  let albums;

  beforeEach(async () => {
    db = await getDb();

    await setupArtist(db, 3);
    [artists] = await db.query('SELECT * FROM Artist');

    await setupAlbum(db, artists);
    [albums] = await db.query('SELECT * FROM Album');
  });

  afterEach(async () => {
    await tearDown(db)
  });

  describe('/album/{albumId}/song', () => {
    describe('POST', () => {
      it('creates a new song in the database if the album exists', async () => {
        const { id: albumId } = albums[0];
        const { id: artistId } = artists[0];
        const data = songFactory();

        const { status } = await post(`/album/${albumId}/song`, data);

        expect(status).to.equal(201);

        const [[songEntries]] = await db.query(
          `SELECT * FROM Song WHERE name = ?`,
          [data.name]
        );

        expect(songEntries.name).to.equal(data.name);
        expect(songEntries.position).to.equal(data.position);
        expect(songEntries.albumId).to.equal(albumId);
        expect(songEntries.artistId).to.equal(artistId);
      });

      it('returns a 404 if the album is not in the database', async () => {
        const data = songFactory();
        
        const { status } = await post(`/album/999999999/song`, data);

        expect(status).to.equal(404);
      });
    });
  });
});
