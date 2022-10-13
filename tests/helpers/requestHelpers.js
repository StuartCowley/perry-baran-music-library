const request = require('supertest');

const post = async (app, path, data) => {
  return await request(app).post(path).send(data);
};

const get = async (app, path) => {
  return await request(app).get(path).send();
};

const patch = async (app, path, data) => {
  return await request(app).patch(path).send(data);
};

const del = async (app, path) => {
  return await request(app).delete(path);
}

module.exports = { post, get, patch, del }