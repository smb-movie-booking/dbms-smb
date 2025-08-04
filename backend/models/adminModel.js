const fs = require('fs');
const path = require('path');
const {db} = require('../config/db'); // Assumes you have mysql2 or mysql db connection

const sqlPath = path.join(__dirname, '../../database/smb.sql');

exports.extractTablesFromSQL = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(sqlPath, 'utf8', (err, data) => {
      if (err) return reject(err);

      const tableRegex = /CREATE TABLE\s+`?(\w+)`?/gi;
      const tables = [];
      let match;

      while ((match = tableRegex.exec(data)) !== null) {
        tables.push(match[1]);
      }

      resolve(tables);
    });
  });
};

exports.truncateTables = async (tables) => {
  const connection = db.promise();

  // Disable FK constraints
  await connection.query('SET FOREIGN_KEY_CHECKS = 0');

  // Optional: reverse order to truncate child tables before parent tables
  for (let i = tables.length - 1; i >= 0; i--) {
    const table = tables[i];
    console.log(`Truncating: ${table}`);
    await connection.query(`TRUNCATE TABLE \`${table}\``);
  }

  // Re-enable FK constraints
  await connection.query('SET FOREIGN_KEY_CHECKS = 1');
};

