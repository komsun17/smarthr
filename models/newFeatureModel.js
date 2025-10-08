const { mysqlPool } = require('../config/db');

exports.create = async (data) => {
  const [result] = await mysqlPool.query(
    'INSERT INTO new_feature_table (field1, field2) VALUES (?, ?)',
    [data.field1, data.field2]
  );
  return result.insertId;
};

exports.findAll = async () => {
  const [rows] = await mysqlPool.query('SELECT * FROM new_feature_table');
  return rows;
};

exports.findById = async (id) => {
  const [rows] = await mysqlPool.query('SELECT * FROM new_feature_table WHERE id = ?', [id]);
  return rows[0];
};
