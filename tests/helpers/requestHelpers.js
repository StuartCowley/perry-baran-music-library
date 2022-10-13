const request = require('supertest');
const app = require('../../src/app');

const post = async (path, data) => {
  return await request(app).post(path).send(data);
};

const get = async (path) => {
  return await request(app).get(path).send();
};

const patch = async (path, data) => {
  return await request(app).patch(path).send(data);
};

const del = async (path) => {
  return await request(app).delete(path);
};

module.exports = { post, get, patch, del };
