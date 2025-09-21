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

// CityID , City_Name , City_State , ZipCode
exports.findCityByName=(name,callback)=>{
  const sql="SELECT * FROM City WHERE lower(City_Name) = lower(?) LIMIT 1";
  db.query(sql, [name], (err, results) => {
    if (err) {
      console.error('❌ DB error in findCity:', err);  // <-- this will help you debug
      return callback(err);
    }
    if (results.length === 0) return callback(null, null);
    console.log(results[0])
    return callback(null, results[0]);
  });
}

exports.findCityById=(id,callback)=>{
  const sql='SELECT * from City WHERE CityID=?';
  db.query(sql,[id],(err,result)=>{
    if(err)return callback(err)
    if(result[0].length===0)return callback(null,null)
    return callback(null,result[0]);
  })
}

exports.addCity=(name,state,code,callback)=>{
  db.query('SELECT MAX(CityID) as maxid from City',(err,results)=>{
    if(err){
      console.log(err);
      return callback(err);
    }
    const newCityID=(results[0].maxid || 0) + 1;
    const sql='INSERT INTO City values(?,?,?,?)';
    db.query(sql,[newCityID,name,state,code],(err,results)=>{
      if(err){
        return callback(err)
      }
      return callback(null,{ inserted: true, cityId: newCityID })
    })
  })
}

exports.findCinemaById=(id,callback)=>{
  db.query('SELECT * FROM Cinema WHERE CinemaID=?',[id],(err,results)=>{
    if(err)return callback(err)
    if(results[0].length===0)return callback(null,null)
    return callback(null,results[0]);

  })
}


exports.findCinemaHallById=(id,callback)=>{
  const sql='SELECT * from Cinema_Hall WHERE CinemaHallID=?';
  db.query(sql,[id],(err,result)=>{
    if(err)return callback(err)
    if(result[0].length===0)return callback(null,null)
    return callback(null,result[0]);
  })
}

exports.findCinemaHallByName=(name,id,callback)=>{
  const sql="SELECT * FROM Cinema_Hall WHERE lower(Hall_Name) = lower(?) AND CinemaID=? LIMIT 1";
  db.query(sql, [name,id], (err, results) => {
    if (err) {
      console.error('❌ DB error in findCity:', err);  // <-- this will help you debug
      return callback(err);
    }
    if (results.length === 0) return callback(null, null);
    console.log(results[0])
    return callback(null, results[0]);
  });
}

exports.getOccupiedSeats=(hallId,callback)=>{
  const sql='select sum(s.seatNumber) as total_occupied from Cinema_Seat s INNER JOIN Cinema_Hall h ON s.CinemaHallID = h.CinemaHallID WHERE s.CinemaHallID=?';
  db.query(sql,[hallId],(err,result)=>{
    if(err)return callback(err,null);
    
    if(!result[0].total_occupied)return callback(null,{total_occupied:0});
    return callback(null,result[0])
    
  })
}


exports.findShow = (StartTime, EndTime, CinemaHallID, callback) => {
  const start = new Date(StartTime);
  const end = new Date(EndTime);
  const tenMinutes = 10 * 60 * 1000;

  // Optional 1-hour buffer
  const startWithBuffer = new Date(start.getTime() - tenMinutes);
  const endWithBuffer = new Date(end.getTime() + tenMinutes);

  const sql = `
    SELECT * 
    FROM movie_show 
    WHERE CinemaHallID = ? 
      AND (
        (StartTime BETWEEN ? AND ?) 
        OR (EndTime BETWEEN ? AND ?) 
        OR (? BETWEEN StartTime AND EndTime)
        OR (? BETWEEN StartTime AND EndTime)
      )
    LIMIT 1
  `;

  db.query(sql, [
    CinemaHallID,
    startWithBuffer, endWithBuffer,   // existing shows starting inside new show
    startWithBuffer, endWithBuffer,   // existing shows ending inside new show
    startWithBuffer, endWithBuffer    // new show starting or ending inside existing shows
  ], (err, result) => {
    if (err) return callback(err, null);
    return callback(null, result);
  });
};




