const sinon = require('sinon');
const { tearDown } = require('../helpers/setupHelpers');

describe('tearDown', () => {
  const db = {
    query: () => {},
    end: () => {},
  };

  afterEach(() => {
    sinon.restore();
  });

  it('spys', async () => {
    try {
      const querySpy = sinon.spy(db, 'query');
      const endSpy = sinon.spy(db, 'end');

      await tearDown(db);

      sinon.assert.calledThrice(querySpy);
      sinon.assert.calledOnce(endSpy);
    } catch (err) {
      throw new Error(err);
    }
  });

  it('stubs', async () => {
    try {
      const queryStub = sinon.stub(db, 'query');

      await tearDown(db);

      sinon.assert.calledWith(queryStub, 'DELETE FROM Artist');
      sinon.assert.calledWith(queryStub, 'DELETE FROM Album');
      sinon.assert.calledWith(queryStub, 'DELETE FROM Song');
    } catch (err) {
      throw new Error(err);
    }
  });
});
