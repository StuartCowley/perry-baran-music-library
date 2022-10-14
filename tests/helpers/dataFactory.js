const { faker } = require('@faker-js/faker');

const artistFactory = (options = {}) => {
  const { name, genre } = options;
  return {
    name: name || faker.lorem.word(),
    genre: genre || faker.music.genre(),
  };
};

const albumFactory = (options = {}) => {
  const { name, year } = options;
  return {
    name: name || faker.lorem.word(),
    year: year || faker.datatype.number({ min: 1000, max: 9999 }),
  };
};

const songFactory = (options = {}) => {
  const { name, position } = options;
  return {
    name: name || faker.lorem.word(),
    position:
      position || position === 0
        ? position
        : faker.datatype.number({ min: 0, max: 20 }),
  };
};

module.exports = { artistFactory, albumFactory, songFactory };
