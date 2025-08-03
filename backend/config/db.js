const mysql = require('mysql2');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
require('dotenv').config();

const dbOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
};

const db = mysql.createConnection(dbOptions);

db.connect((err) => {
  if (err) {
    console.error('❌ Error connecting to MySQL:', err.message);
    return;
  }
  console.log('✅ Connected to MySQL');
});

const sessionStore = new MySQLStore({
  ...dbOptions,
  createDatabaseTable: true  // ✅ this fixes the "table doesn't exist" error
});

module.exports = {
  db,
  sessionStore
};
