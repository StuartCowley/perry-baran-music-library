const { expect } = require('chai');
const { artistFactory } = require('../helpers/dataFactory');

describe('artistFactory', () => {
  it('returns passed options', () => {
    const data = {
      name: 'test name',
      genre: 'test genre',
    };
    const { name, genre } = artistFactory(data);

    expect(name).to.equal(data.name);
    expect(genre).to.equal(data.genre);
  });

  it('can be passed just name and returns a random genre', () => {
    const data = { name: 'test name' };
    const { name, genre } = artistFactory(data);

    expect(name).to.equal(data.name);
    expect(typeof genre).to.equal('string');
  });

  it('can be passed just genre and returns a random name', () => {
    const data = { genre: 'test genre' };
    const { name, genre } = artistFactory(data);

    expect(genre).to.equal(data.genre);
    expect(typeof name).to.equal('string');
  });

  it('can return random values when not passed data', () => {
    const { name, genre } = artistFactory();

    expect(typeof genre).to.equal('string');
    expect(typeof name).to.equal('string');
  });
});
