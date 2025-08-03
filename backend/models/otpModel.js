const { db } = require('../config/db');

exports.createOrUpdateOTP = (identifier, otp, expiresAt, callback) => {
  const sql = `
    INSERT INTO OTP (Identifier, OTP_Code, Expires_At, Verified)
    VALUES (?, ?, ?, FALSE)
    ON DUPLICATE KEY UPDATE OTP_Code = ?, Expires_At = ?, Verified = FALSE
  `;
  db.query(sql, [identifier, otp, expiresAt, otp, expiresAt], callback);
};

exports.getOTP = (identifier, callback) => {
  const sql = `
    SELECT * FROM OTP
    WHERE Identifier = ? AND Verified = FALSE AND Expires_At > NOW()
    ORDER BY Expires_At DESC
    LIMIT 1
  `;
  db.query(sql, [identifier], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};

exports.markAsVerified = (identifier, callback) => {
  const sql = `
    UPDATE OTP SET Verified = TRUE WHERE Identifier = ? AND Expires_At > NOW()
  `;
  db.query(sql, [identifier], callback);
};

exports.deleteOTP = (identifier, callback) => {
  const sql = `DELETE FROM OTP WHERE Identifier = ?`;
  db.query(sql, [identifier], callback);
};

exports.isVerified = (identifier, callback) => {
  const sql = `
    SELECT Verified FROM OTP
    WHERE Identifier = ?
    ORDER BY Expires_At DESC
    LIMIT 1
  `;
  db.query(sql, [identifier], (err, results) => {
    if (err) {
      console.error("OTP verification query error:", err);
      return callback(err);
    }
    const verified = results.length > 0 && results[0].Verified === 1;
    callback(null, verified);
  });
};
