const { expect } = require('chai');
const { songFactory } = require('../helpers/dataFactory');

describe('songFactory', () => {
  it('returns passed options', () => {
    const data = {
      name: 'test name',
      position: 10,
    };
    const { name, position } = songFactory(data);

    expect(name).to.equal(data.name);
    expect(position).to.equal(data.position);
  });

  it('can be passed just name and returns a random position', () => {
    const data = { name: 'test name' };
    const { name, position } = songFactory(data);

    expect(name).to.equal(data.name);
    expect(typeof position).to.equal('number');
  });

  it('can be passed just position and returns a random name', () => {
    const data = { position: 10 };
    const { name, position } = songFactory(data);

    expect(position).to.equal(data.position);
    expect(typeof name).to.equal('string');
  });

  it('works when passed 0 as a position', () => {
    const data = { position: 0 };
    const { position } = songFactory(data);

    expect(position).to.equal(data.position);
  });

  it('can return random values when not passed data', () => {
    const { name, position } = songFactory();

    expect(typeof position).to.equal('number');
    expect(typeof name).to.equal('string');
  });
});
