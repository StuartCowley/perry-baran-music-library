const sinon = require('sinon');
const song = require('../../src/controllers/song');
const connectDb = require('../../src/services/db');

describe('song controller', () => {
  const res = {
    status: () => {},
  };
  const db = {
    query: () => {},
    close: () => {},
  };
  const status = {
    json: () => {},
    send: () => {},
  };
  const req = {
    params: {
      artistId: 0,
      albumId: 0,
      songId: 0,
    },
    body: {
      name: 'name',
      position: 0,
    },
  };

  let getDbStub;
  let queryStub;
  let closeStub;
  let statusStub;

  beforeEach(() => {
    getDbStub = sinon.stub(connectDb, 'getDb').resolves(db);
    queryStub = sinon.stub(db, 'query');
    closeStub = sinon.stub(db, 'close');
    statusStub = sinon.stub(res, 'status').returns(status);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('post', () => {
    it('returns 201', async () => {
      const { name, position } = req.body;
      const { albumId } = req.params;
      const artistId = 0;
      queryStub.returns([[{ artistId }]]);

      await song.post(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledTwice(queryStub);
      sinon.assert.calledWith(queryStub, `SELECT * FROM Album WHERE id = ?`, [
        albumId,
      ]);
      sinon.assert.calledWith(
        queryStub,
        `INSERT INTO Song (name, position, albumId, artistId) VALUES (?, ?, ?, ?)`,
        [name, position, albumId, artistId]
      );

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 201);

      sinon.assert.calledOnce(closeStub);
    });

    it('returns 404', async () => {
      const { albumId } = req.params;
      queryStub.returns([[false]]);

      await song.post(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, `SELECT * FROM Album WHERE id = ?`, [
        albumId,
      ]);

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 404);

      sinon.assert.calledOnce(closeStub);
    });

    it('returns 500', async () => {
      const { albumId } = req.params;
      queryStub.throws();

      await song.post(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, `SELECT * FROM Album WHERE id = ?`, [
        albumId,
      ]);

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 500);

      sinon.assert.calledOnce(closeStub);
    });
  });

  describe('getAll', () => {
    it('returns 200', async () => {
      const data = {};
      const jsonStub = sinon.stub(status, 'json');
      queryStub.returns([data]);

      await song.getAll(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, 'SELECT * FROM Song');

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 200);

      sinon.assert.calledOnce(jsonStub);
      sinon.assert.calledWith(jsonStub, data);

      sinon.assert.calledOnce(closeStub);
    });

    it('returns 500', async () => {
      queryStub.throws();

      await song.getAll(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, 'SELECT * FROM Song');

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 500);

      sinon.assert.calledOnce(closeStub);
    });
  });

  describe('getById', () => {
    it('returns 200', async () => {
      const data = {};
      const jsonStub = sinon.stub(status, 'json');
      queryStub.returns([[data]]);

      await song.getById(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, `SELECT * FROM Song WHERE id = ?`, [
        req.params.songId,
      ]);

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 200);

      sinon.assert.calledOnce(jsonStub);
      sinon.assert.calledWith(jsonStub, data);

      sinon.assert.calledOnce(closeStub);
    });

    it('returns 404', async () => {
      queryStub.returns([[false]]);

      await song.getById(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, `SELECT * FROM Song WHERE id = ?`, [
        req.params.songId,
      ]);

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 404);

      sinon.assert.calledOnce(closeStub);
    });

    it('returns 500', async () => {
      queryStub.throws();

      await song.getById(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, `SELECT * FROM Song WHERE id = ?`, [
        req.params.songId,
      ]);

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 500);

      sinon.assert.calledOnce(closeStub);
    });
  });

  describe('gettAllByArtistId', () => {
    it('returns 200', async () => {
      const data = [{}];
      const jsonStub = sinon.stub(status, 'json');
      queryStub.returns([data]);

      await song.getAllByArtistId(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(
        queryStub,
        `SELECT * FROM Song WHERE artistId = ?`,
        [req.params.artistId]
      );

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 200);

      sinon.assert.calledOnce(jsonStub);
      sinon.assert.calledWith(jsonStub, data);

      sinon.assert.calledOnce(closeStub);
    });

    it('returns 404', async () => {
      queryStub.returns([[]]);

      await song.getAllByArtistId(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(
        queryStub,
        `SELECT * FROM Song WHERE artistId = ?`,
        [req.params.artistId]
      );

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 404);

      sinon.assert.calledOnce(closeStub);
    });

    it('returns 500', async () => {
      queryStub.throws();

      await song.getAllByArtistId(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(
        queryStub,
        `SELECT * FROM Song WHERE artistId = ?`,
        [req.params.artistId]
      );

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 500);

      sinon.assert.calledOnce(closeStub);
    });
  });

  describe('getAllByAlbumId', () => {
    it('returns 200', async () => {
      const data = [{}];
      const jsonStub = sinon.stub(status, 'json');
      queryStub.returns([data]);

      await song.getAllByAlbumId(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(
        queryStub,
        `SELECT * FROM Song WHERE albumId = ?`,
        [req.params.albumId]
      );

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 200);

      sinon.assert.calledOnce(jsonStub);
      sinon.assert.calledWith(jsonStub, data);

      sinon.assert.calledOnce(closeStub);
    });

    it('returns 404', async () => {
      queryStub.returns([[]]);

      await song.getAllByAlbumId(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(
        queryStub,
        `SELECT * FROM Song WHERE albumId = ?`,
        [req.params.albumId]
      );

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 404);

      sinon.assert.calledOnce(closeStub);
    });

    it('returns 500', async () => {
      queryStub.throws();

      await song.getAllByAlbumId(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(
        queryStub,
        `SELECT * FROM Song WHERE albumId = ?`,
        [req.params.albumId]
      );

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 500);

      sinon.assert.calledOnce(closeStub);
    });
  });

  describe('patch', () => {
    it('returns 200', async () => {
      queryStub.returns([{ affectedRows: true }]);

      await song.patch(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, `UPDATE Song SET ? WHERE id = ?`, [
        req.body,
        req.params.songId,
      ]);

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 200);

      sinon.assert.calledOnce(closeStub);
    });

    it('returns 404', async () => {
      queryStub.returns([{ affectedRows: false }]);

      await song.patch(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, `UPDATE Song SET ? WHERE id = ?`, [
        req.body,
        req.params.songId,
      ]);

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 404);

      sinon.assert.calledOnce(closeStub);
    });

    it('returns 500', async () => {
      queryStub.throws();

      await song.patch(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, `UPDATE Song SET ? WHERE id = ?`, [
        req.body,
        req.params.songId,
      ]);

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 500);

      sinon.assert.calledOnce(closeStub);
    });
  });

  describe('delete', () => {
    it('returns 200', async () => {
      queryStub.returns([{ affectedRows: true }]);

      await song.delete(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, `DELETE FROM Song WHERE id = ?`, [
        req.params.songId,
      ]);

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 200);

      sinon.assert.calledOnce(closeStub);
    });

    it('returns 404', async () => {
      queryStub.returns([{ affectedRows: false }]);

      await song.delete(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, `DELETE FROM Song WHERE id = ?`, [
        req.params.songId,
      ]);

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 404);

      sinon.assert.calledOnce(closeStub);
    });

    it('returns 500', async () => {
      queryStub.throws();

      await song.delete(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, `DELETE FROM Song WHERE id = ?`, [
        req.params.songId,
      ]);

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 500);

      sinon.assert.calledOnce(closeStub);
    });
  });
});
