const { faker } = require('@faker-js/faker');

const artistFactory = (options = {}) => {
  return {
    name: options.name || faker.lorem.words({ max: 25 }),
    genre: options.genre || faker.music.genre(),
  };
};

const albumFactory = (options = {}) => {
  return {
    name: options.name || faker.lorem.words({ max: 25 }),
    year: options.year || faker.datatype.number({ min: 1000, max: 9999 }),
  };
};

const songFactory = (options = {}) => {
  return {
    name: options.name || faker.lorem.words({ max: 25 }),
    position: options.position || faker.datatype.number({ min: 0, max: 20 }),
  };
};

module.exports = { artistFactory, albumFactory, songFactory };
