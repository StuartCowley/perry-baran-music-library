const sinon = require('sinon');
const artist = require('../../src/controllers/artist');
const connectDb = require('../../src/services/db');

describe('artist controller', () => {
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
      artistId: 0,
    },
    body: {
      name: 'name',
      genre: 'genre',
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
      await artist.post(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(
        queryStub,
        `INSERT INTO Artist (name, genre) VALUES (?, ?)`,
        [req.body.name, req.body.genre]
      );

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 201);

      sinon.assert.calledOnce(endStub);
    });

    it('returns 500', async () => {
      queryStub.throws();

      await artist.post(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(
        queryStub,
        `INSERT INTO Artist (name, genre) VALUES (?, ?)`,
        [req.body.name, req.body.genre]
      );

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 500);

      sinon.assert.calledOnce(endStub);
    });
  });

  describe('getAll', () => {
    it('returns 201', async () => {
      const data = {};
      const jsonStub = sinon.stub(status, 'json');
      queryStub.returns([data]);

      await artist.getAll(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, 'SELECT * FROM Artist');

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 200);

      sinon.assert.calledOnce(jsonStub);
      sinon.assert.calledWith(jsonStub, data);

      sinon.assert.calledOnce(endStub);
    });

    it('returns 500', async () => {
      queryStub.throws();

      await artist.getAll(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, 'SELECT * FROM Artist');

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 500);

      sinon.assert.calledOnce(endStub);
    });
  });

  describe('getBydId', () => {
    it('returns 200', async () => {
      const data = {};
      queryStub.returns([[data]]);
      const jsonStub = sinon.stub(status, 'json');

      await artist.getById(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, `SELECT * FROM Artist WHERE id = ?`, [
        req.params.artistId,
      ]);

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 200);

      sinon.assert.calledOnce(jsonStub);
      sinon.assert.calledWith(jsonStub, data);

      sinon.assert.calledOnce(endStub);
    });

    it('returns 404', async () => {
      queryStub.returns([[false]]);

      await artist.getById(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, `SELECT * FROM Artist WHERE id = ?`, [
        req.params.artistId,
      ]);

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 404);

      sinon.assert.calledOnce(endStub);
    });

    it('returns 500', async () => {
      queryStub.throws();

      await artist.getById(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, `SELECT * FROM Artist WHERE id = ?`, [
        req.params.artistId,
      ]);

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 500);

      sinon.assert.calledOnce(endStub);
    });
  });

  describe('patch', () => {
    it('returns 200', async () => {
      queryStub.returns([{ affectedRows: true }]);

      await artist.patch(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, `UPDATE Artist SET ? WHERE id = ?`, [
        req.body,
        req.params.artistId,
      ]);

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 200);

      sinon.assert.calledOnce(endStub);
    });

    it('returns 404', async () => {
      queryStub.returns([{ affectedRows: false }]);

      await artist.patch(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, `UPDATE Artist SET ? WHERE id = ?`, [
        req.body,
        req.params.artistId,
      ]);

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 404);

      sinon.assert.calledOnce(endStub);
    });

    it('returns 500', async () => {
      queryStub.throws();

      await artist.patch(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, `UPDATE Artist SET ? WHERE id = ?`, [
        req.body,
        req.params.artistId,
      ]);

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 500);

      sinon.assert.calledOnce(endStub);
    });
  });

  describe('delete', () => {
    it('returns 200', async () => {
      queryStub.returns([{ affectedRows: true }]);

      await artist.delete(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, `DELETE FROM Artist WHERE id = ?`, [
        req.params.artistId,
      ]);

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 200);

      sinon.assert.calledOnce(endStub);
    });

    it('returns 404', async () => {
      queryStub.returns([{ affectedRows: false }]);

      await artist.delete(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, `DELETE FROM Artist WHERE id = ?`, [
        req.params.artistId,
      ]);

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 404);

      sinon.assert.calledOnce(endStub);
    });

    it('returns 500', async () => {
      queryStub.throws();

      await artist.delete(req, res);

      sinon.assert.calledOnce(getDbStub);

      sinon.assert.calledOnce(queryStub);
      sinon.assert.calledWith(queryStub, `DELETE FROM Artist WHERE id = ?`, [
        req.params.artistId,
      ]);

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 500);

      sinon.assert.calledOnce(endStub);
    });
  });
});
