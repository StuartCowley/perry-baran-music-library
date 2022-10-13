const { faker } = require('@faker-js/faker');

const artistFactory = (options = {}) => {
  return {
    name: options.name || faker.lorem.word(),
    genre: options.genre || faker.music.genre(),
  };
};

const albumFactory = (options = {}) => {
  return {
    name: options.name || faker.lorem.word(),
    year: options.year || faker.datatype.number({ min: 1000, max: 9999 }),
  };
};

const songFactory = (options = {}) => {
  return {
    name: options.name || faker.lorem.words(),
    positon: options.position || faker.lorem.number(),
  };
};

module.exports = { artistFactory, albumFactory, songFactory };
