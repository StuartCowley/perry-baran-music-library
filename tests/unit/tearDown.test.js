const sinon = require('sinon');
const { tearDown } = require('../helpers/setupHelpers');

describe('tearDown', () => {
  const db = {
    query: () => {},
    close: () => {},
  };

  afterEach(() => {
    sinon.restore();
  });

  it('spys', async () => {
    try {
      const querySpy = sinon.spy(db, 'query');
      const closeSpy = sinon.spy(db, 'close');

      await tearDown(db);

      sinon.assert.calledThrice(querySpy);
      sinon.assert.calledOnce(closeSpy);
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
