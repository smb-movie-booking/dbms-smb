const mysql = require('mysql2');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
require('dotenv').config();
const fs = require('fs');

const dbOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.PORT,
  ssl: {
      ca: fs.readFileSync(__dirname + '/ca.pem')
    },
    waitForConnections: true,
  connectionLimit: 10, // Max 10 connections
  queueLimit: 0
};

const db = mysql.createPool(dbOptions);

const sessionStore = new MySQLStore({}, db.promise());

module.exports = {
  db,
  sessionStore
};
