const sinon = require('sinon');
const album = require('../../src/controllers/album');
const connectDb = require('../../src/services/db');

describe('album controller', () => {
  const res = {
    status: () => {},
  };
  const db = {
    query: () => {},
    end: () => {},
  };
  const status = {
    json: () => {},
    send: () => {},
  };
  const req = {
    params: {
      albumId: 0,
      artistId: 0,
    },
    body: {
      name: 'name',
      year: 2000,
    },
  };

  let getDbStub;
  let queryStub;
  let endStub;
  let statusStub;

  beforeEach(() => {
    getDbStub = sinon.stub(connectDb, 'getDb').resolves(db);
    queryStub = sinon.stub(db, 'query');
    endStub = sinon.stub(db, 'end');
    statusStub = sinon.stub(res, 'status').returns(status);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('post', () => {
    it('returns 201', async () => {
      const { name, year } = req.body;
      const { artistId } = req.params;
      queryStub.returns([[true]]);

      await album.post(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledTwice(queryStub);
      sinon.assert.calledWith(queryStub, `SELECT * FROM Artist WHERE id = ?`, [
        artistId,
      ]);
      sinon.assert.calledWith(
        queryStub,
        `INSERT INTO Album (name, year, artistId) VALUES (?, ?, ?)`,
        [name, year, artistId]
      );

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 201);

      sinon.assert.calledOnce(endStub);
    });

    it('returns 404', async () => {
      const { artistId } = req.params;
      queryStub.returns([[false]]);

      await album.post(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, `SELECT * FROM Artist WHERE id = ?`, [
        artistId,
      ]);

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 404);

      sinon.assert.calledOnce(endStub);
    });

    it('returns 500', async () => {
      const { artistId } = req.params;
      queryStub.throws();

      await album.post(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, `SELECT * FROM Artist WHERE id = ?`, [
        artistId,
      ]);

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 500);

      sinon.assert.calledOnce(endStub);
    });
  });

  describe('getAll', () => {
    it('returns 200', async () => {
      const data = {};
      const jsonStub = sinon.stub(status, 'json');
      queryStub.returns([data]);

      await album.getAll(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, 'SELECT * FROM Album');

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 200);

      sinon.assert.calledOnce(jsonStub);
      sinon.assert.calledWith(jsonStub, data);

      sinon.assert.calledOnce(endStub);
    });

    it('returns 500', async () => {
      queryStub.throws();

      await album.getAll(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, 'SELECT * FROM Album');

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 500);

      sinon.assert.calledOnce(endStub);
    });
  });

  describe('getById', () => {
    it('returns 200', async () => {
      const data = {};
      const jsonStub = sinon.stub(status, 'json');
      queryStub.returns([[data]]);

      await album.getById(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, `SELECT * FROM Album WHERE id = ?`, [
        req.params.albumId,
      ]);

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 200);

      sinon.assert.calledOnce(jsonStub);
      sinon.assert.calledWith(jsonStub, data);

      sinon.assert.calledOnce(endStub);
    });

    it('returns 404', async () => {
      queryStub.returns([[false]]);

      await album.getById(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, `SELECT * FROM Album WHERE id = ?`, [
        req.params.albumId,
      ]);

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 404);

      sinon.assert.calledOnce(endStub);
    });

    it('returns 500', async () => {
      queryStub.throws();

      await album.getById(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, `SELECT * FROM Album WHERE id = ?`, [
        req.params.albumId,
      ]);

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 500);

      sinon.assert.calledOnce(endStub);
    });
  });

  describe('getAllByArtistId', () => {
    it('returns 200', async () => {
      const data = [{}];
      const jsonStub = sinon.stub(status, 'json');
      queryStub.returns([data]);

      await album.getAllByArtistId(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(
        queryStub,
        `SELECT * FROM Album WHERE artistId = ?`,
        [req.params.artistId]
      );

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 200);

      sinon.assert.calledOnce(jsonStub);
      sinon.assert.calledWith(jsonStub, data);

      sinon.assert.calledOnce(endStub);
    });

    it('returns 404', async () => {
      queryStub.returns([[]]);

      await album.getAllByArtistId(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(
        queryStub,
        `SELECT * FROM Album WHERE artistId = ?`,
        [req.params.artistId]
      );

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 404);

      sinon.assert.calledOnce(endStub);
    });

    it('returns 500', async () => {
      queryStub.throws();

      await album.getAllByArtistId(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(
        queryStub,
        `SELECT * FROM Album WHERE artistId = ?`,
        [req.params.artistId]
      );

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 500);

      sinon.assert.calledOnce(endStub);
    });
  });

  describe('patch', () => {
    it('returns 200', async () => {
      queryStub.returns([{ affectedRows: true }]);

      await album.patch(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, `UPDATE Album SET ? WHERE id = ?`, [
        req.body,
        req.params.albumId,
      ]);

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 200);

      sinon.assert.calledOnce(endStub);
    });

    it('returns 404', async () => {
      queryStub.returns([{ affectedRows: false }]);

      await album.patch(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, `UPDATE Album SET ? WHERE id = ?`, [
        req.body,
        req.params.albumId,
      ]);

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 404);

      sinon.assert.calledOnce(endStub);
    });

    it('returns 500', async () => {
      queryStub.throws();

      await album.patch(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, `UPDATE Album SET ? WHERE id = ?`, [
        req.body,
        req.params.albumId,
      ]);

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 500);

      sinon.assert.calledOnce(endStub);
    });
  });

  describe('delete', () => {
    it('returns 200', async () => {
      queryStub.returns([{ affectedRows: true }]);

      await album.delete(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, `DELETE FROM Album WHERE id = ?`, [
        req.params.albumId,
      ]);

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 200);

      sinon.assert.calledOnce(endStub);
    });

    it('returns 404', async () => {
      queryStub.returns([{ affectedRows: false }]);

      await album.delete(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, `DELETE FROM Album WHERE id = ?`, [
        req.params.albumId,
      ]);

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 404);

      sinon.assert.calledOnce(endStub);
    });

    it('returns 500', async () => {
      queryStub.throws();

      await album.delete(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, `DELETE FROM Album WHERE id = ?`, [
        req.params.albumId,
      ]);

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 500);

      sinon.assert.calledOnce(endStub);
    });
  });
});
