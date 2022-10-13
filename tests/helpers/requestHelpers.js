const request = require('supertest');
const app = require('../../src/app');

const post = async (path, data) => {
  try {
    return await request(app).post(path).send(data);
  } catch (err) {
    throw new Error(err);
  }
};

const get = async (path) => {
  try {
    return await request(app).get(path).send();
  } catch (err) {
    throw new Error(err);
  }
};

const patch = async (path, data) => {
  try {
    return await request(app).patch(path).send(data);
  } catch (err) {
    throw new Error(err);
  }
};

const del = async (path) => {
  try {
    return await request(app).delete(path);
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { post, get, patch, del };
