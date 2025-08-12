const {db} = require('../config/db');

exports.createUser = (name, hashedPassword, email, phone, isAdmin = false, callback) => {
  db.query('SELECT MAX(UserID) AS maxId FROM User', (err, results) => {
    if (err) return callback(err);
    const newUserId = (results[0].maxId || 0) + 1;
    const sql = 'INSERT INTO User (UserID, User_Name, User_Password, Email, Phone, IsAdmin) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [newUserId, name, hashedPassword, email, phone, isAdmin], (err, results) => {
      if (err) {
        console.error("Create User Error:", err);
        // Check for duplicate phone number
        if (err.code === 'ER_DUP_ENTRY') {
          return callback({ code: 'DUPLICATE_PHONE', message: 'Phone number already registered' });
        }
        return callback(err);
      }
      callback(null, results);
    });
  });
};


exports.getByEmail = (email, callback) => {
  const sql = 'SELECT * FROM User WHERE LOWER(Email) = LOWER(?) LIMIT 1';
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('❌ DB error in getByEmail:', err);  // <-- this will help you debug
      return callback(err);
    }
    if (results.length === 0) return callback(null, null);
    console.log(results[0])
    return callback(null, results[0]);
  });
};


exports.findByPhone = (phone, callback) => {
  db.query('SELECT * FROM User WHERE Phone = ?', [phone], (err, results) => {
    if (err) return callback(err);
    console.log(results[0])
    callback(null, results[0] || null);
  });
};

exports.findByEmailOrPhone = (email, phone, callback) => {
  db.query('SELECT * FROM User WHERE Email = ? OR Phone = ?', [email, phone], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0] || null);
  });
};

exports.getPasswordById = (userId, callback) => {
  const query = 'SELECT User_Password FROM User WHERE UserID = ?';
  db.query(query, [userId], (err, results) => {
    if (err) return callback(err);
    if (results.length === 0) return callback(null, null); // No user found
    callback(null, results[0]);
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

exports.updateName = (userId, name, callback) => {
  const query = 'UPDATE User SET User_Name = ? WHERE UserID = ?';
  db.query(query, [name, userId], (err, result) => {
    if (err) return callback(err);
    callback(null);
  });
};

exports.updateEmail = (userId, email, callback) => {
  const query = 'UPDATE User SET Email = ? WHERE UserID = ?';
  db.query(query, [email, userId], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

exports.updatePhone = (userId, phone, callback) => {
  const query = 'UPDATE User SET Phone = ? WHERE UserID = ?';
  db.query(query, [phone, userId], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

exports.updatePasswordByPhone = (phone, hashedPassword, callback) => {
  db.query('UPDATE User SET User_Password = ? WHERE Phone = ?', [hashedPassword, phone], callback);
};

exports.updatePasswordByEmail = (email, hashedPassword, callback) => {
  db.query('UPDATE User SET User_Password = ? WHERE Email = ?', [hashedPassword, email], callback);
};


