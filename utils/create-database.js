const mysql = require('mysql2/promise');

const path = require('path');

// extract any command line arguments from argv
const args = process.argv.slice(2)[0];

// use args to determine if .env or .env.test should be loaded
const envFile = args === 'test' ? '../.env.test' : '../.env';

// load environment variables from env files
require('dotenv').config({
  path: path.join(__dirname, envFile),
});

const { DB_PASSWORD, DB_NAME, DB_USER, DB_HOST, DB_PORT } = process.env;

const setUpDatabase = async () => {
  try {
    // connect to the database
    const db = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: DB_PORT,
    });

    // create the database if it doesn't already exist
    await db.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);

    //configure database
    await db.query(`USE ${DB_NAME}`);

    await db.query(`CREATE TABLE IF NOT EXISTS Artist (
      id INT PRIMARY KEY auto_increment,
      name VARCHAR(25),
      genre VARCHAR(25)
    )`);

    await db.query(`CREATE TABLE IF NOT EXISTS Album (
      id INT PRIMARY KEY auto_increment,
      name VARCHAR(25),
      year INT,
      artistId INT,
      FOREIGN KEY (artistId) REFERENCES Artist(id) ON DELETE CASCADE
    )`);

    await db.query(`CREATE TABLE IF NOT EXISTS Song (
      id INT PRIMARY KEY auto_increment,
      name VARCHAR(25),
      position INT,
      artistId INT,
      albumId INT,
      FOREIGN KEY (artistId) REFERENCES Artist(id) ON DELETE CASCADE,
      FOREIGN KEY (albumId) REFERENCES Album(id) ON DELETE CASCADE
    )`);

    db.close();
  } catch (err) {
    console.log(
      `Your environment variables might be wrong. Please double check .env file`
    );
    console.log('Environment Variables are:', {
      DB_PASSWORD,
      DB_NAME,
      DB_USER,
      DB_HOST,
      DB_PORT,
    });
    console.log(err);
  }
};

setUpDatabase();
