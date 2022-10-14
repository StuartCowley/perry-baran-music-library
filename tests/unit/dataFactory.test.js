const { expect } = require('chai');
const {
  artistFactory,
  albumFactory,
  songFactory,
} = require('../helpers/dataFactory');

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

describe('albumFactory', () => {
  it('returns passed options', () => {
    const data = {
      name: 'test name',
      year: 1000,
    };
    const { name, year } = albumFactory(data);

    expect(name).to.equal(data.name);
    expect(year).to.equal(data.year);
  });

  it('can be passed just name and returns a random year', () => {
    const data = { name: 'test name' };
    const { name, year } = albumFactory(data);

    expect(name).to.equal(data.name);
    expect(typeof year).to.equal('number');
  });

  it('can be passed just year and returns a random name', () => {
    const data = { year: 1000 };
    const { name, year } = albumFactory(data);

    expect(year).to.equal(data.year);
    expect(typeof name).to.equal('string');
  });

  it('can return random values when not passed data', () => {
    const { name, year } = albumFactory();

    expect(typeof year).to.equal('number');
    expect(typeof name).to.equal('string');
  });
});

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
