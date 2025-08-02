const {db} = require('../config/db');

exports.createUser = (name, hashedPassword, email, phone, isAdmin = false, callback) => {
  db.query('SELECT MAX(UserID) AS maxId FROM User', (err, results) => {
    if (err) return callback(err);

    const newUserId = (results[0].maxId || 0) + 1;
    const sql = 'INSERT INTO User (UserID, User_Name, User_Password, Email, Phone, IsAdmin) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [newUserId, name, hashedPassword, email, phone, isAdmin], callback);
  });
};

exports.getByEmail = (email, callback) => {
  db.query('SELECT * FROM User WHERE Email = ?', [email], (err, results) => {
    if (err || results.length === 0) return callback(err || null, null);
    callback(null, results[0]);
  });
};

exports.findByPhone = (phone, callback) => {
  db.query('SELECT * FROM User WHERE Phone = ?', [phone], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0] || null);
  });
};

exports.findByEmailOrPhone = (email, phone, callback) => {
  db.query('SELECT * FROM User WHERE Email = ? OR Phone = ?', [email, phone], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0] || null);
  });
};


exports.getUserById = (id, callback) => {
  db.query('SELECT UserID, User_Name, Email, Phone FROM User WHERE UserID = ?', [id], (err, results) => {
    if (err || results.length === 0) return callback(err || null, null);
    callback(null, results[0]);
  });
};

exports.updateUser = (id, name, phone, email, callback) => {
  db.query(
    'UPDATE User SET User_Name = ?, Phone = ?, Email = ? WHERE UserID = ?',
    [name, phone, email, id],
    callback
  );
};

exports.deleteUserById = (id, callback) => {
  db.query('DELETE FROM User WHERE UserID = ?', [id], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

exports.updatePassword = (userId, newHashedPassword, callback) => {
  db.query(
    'UPDATE User SET User_Password = ? WHERE UserID = ?',
    [newHashedPassword, userId],
    callback
  );
};

exports.updatePasswordByPhone = (phone, hashedPassword, callback) => {
  db.query('UPDATE User SET User_Password = ? WHERE Phone = ?', [hashedPassword, phone], callback);
};


