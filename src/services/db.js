const mysql = require('mysql2/promise');

const { DB_PASSWORD, DB_USER, DB_NAME, DB_HOST, DB_PORT } = process.env;

exports.getDb = async () => {
  try {
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: DB_PORT,
      database: DB_NAME,
    });

    return connection;
  } catch (err) {
    throw new Error(err);
  }
};
