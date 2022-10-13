const { faker } = require('@faker-js/faker');

const artistFactory = (options = {}) => {
  return {
    name: options.name || faker.lorem.word(),
    genre: options.genre || faker.lorem.word()
  };
};

const albumFactory = (options = {}) => {
  return {
    name: options.name || faker.lorem.words(),
    year: options.year || faker.date.year()
  };
};

const songFactory = (options = {}) => {
  return {
    name: options.name || faker.lorem.words(),
    positon: options.position || faker.lorem.number()
  };
};

module.exports = { artistFactory, albumFactory, songFactory }