const { mysqlPool } = require('../config/db');

exports.findByUsername = async (username) => {
  const [rows] = await mysqlPool.query('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
};

exports.createUser = async (username, passwordHash) => {
  const [result] = await mysqlPool.query(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, passwordHash]
  );
  return result.insertId;
};
