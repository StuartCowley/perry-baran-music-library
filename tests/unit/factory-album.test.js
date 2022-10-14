const { expect } = require('chai');
const { albumFactory } = require('../helpers/dataFactory');

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
