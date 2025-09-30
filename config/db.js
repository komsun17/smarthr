const mysql = require('mysql2/promise');
const mssql = require('mssql');

// Check required MySQL env vars
['MYSQL_HOST', 'MYSQL_USER', 'MYSQL_PASSWORD', 'MYSQL_DATABASE'].forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing environment variable: ${key}`);
  }
});

// MySQL connection pool
const mysqlPool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// MSSQL config
const mssqlConfig = {
  user: process.env.MSSQL_USER,
  password: process.env.MSSQL_PASSWORD,
  server: process.env.MSSQL_SERVER,
  database: process.env.MSSQL_DATABASE,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

async function getMssqlConnection() {
  try {
    const pool = await mssql.connect(mssqlConfig);
    return pool;
  } catch (err) {
    console.error('MSSQL connection error:', err);
    throw err;
  }
}

module.exports = {
  mysqlPool,
  getMssqlConnection,
  mssql
};

