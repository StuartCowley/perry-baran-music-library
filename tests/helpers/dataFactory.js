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
  let position;
  if (options.position || options.position === 0) {
    position = options.position;
  } else {
    position = faker.datatype.number({ min: 0, max: 20 });
  }

  return {
    name: options.name || faker.lorem.word(),
    position,
  };
};

module.exports = { artistFactory, albumFactory, songFactory };
