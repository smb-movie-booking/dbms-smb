const {db} = require('../config/db');

exports.getByEmail = (email, callback) => {
  db.query('SELECT * FROM User WHERE Email = ?', [email], (err, results) => {
    if (err || results.length === 0) return callback(err || null, null);
    callback(null, results[0]);
  });
};

exports.createUser = (name, hashedPassword, email, phone, callback) => {
  db.query('SELECT MAX(UserID) AS maxId FROM User', (err, results) => {
    if (err) return callback(err);
    const newUserId = (results[0].maxId || 0) + 1;

    const sql = 'INSERT INTO User (UserID, User_Name, User_Password, Email, Phone) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [newUserId, name, hashedPassword, email, phone], callback);
  });
};


exports.getUserById = (id, callback) => {
  db.query('SELECT UserID, User_Name, Email, Phone FROM User WHERE UserID = ?', [id], (err, results) => {
    if (err || results.length === 0) return callback(err || null, null);
    callback(null, results[0]);
  });
};

exports.updateUser = (id, name, phone, callback) => {
  db.query(
    'UPDATE User SET User_Name = ?, Phone = ? WHERE UserID = ?',
    [name, phone, id],
    (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    }
  );
};
