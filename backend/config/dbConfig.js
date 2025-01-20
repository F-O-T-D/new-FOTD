const mysql = require('mysql');
const sql = require('../sql/sql.js');

const pool = mysql.createPool({
  connectionLimit: process.env.MYSQL_LIMIT,
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
});

const query = async (alias, values) => {
  return new Promise((resolve, reject) =>
    pool.query(sql[alias], values, (error, results) => {
      if (error) reject(error);
      else resolve(results);
    })
  );
};


console.log('DB Config:', {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  limit: process.env.MYSQL_LIMIT,
});



module.exports = { query };
