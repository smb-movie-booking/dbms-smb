const db = require('../config/db');

exports.createOrUpdateOTP = (phone, otp, expiresAt, callback) => {
  const sql = `
    INSERT INTO OTP (Phone, OTP_Code, Expires_At, Verified)
    VALUES (?, ?, ?, FALSE)
    ON DUPLICATE KEY UPDATE OTP_Code = ?, Expires_At = ?, Verified = FALSE
  `;
  db.query(sql, [phone, otp, expiresAt, otp, expiresAt], callback);
};

exports.getOTP = (phone, callback) => {
  db.query('SELECT * FROM OTP WHERE Phone = ?', [phone], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};

exports.markVerified = (phone, callback) => {
  db.query('UPDATE OTP SET Verified = TRUE WHERE Phone = ?', [phone], callback);
};

exports.deleteOTP = (phone, callback) => {
  db.query('DELETE FROM OTP WHERE Phone = ?', [phone], callback);
};

exports.isPhoneVerified = (phone, callback) => {
  db.query('SELECT Verified FROM OTP WHERE Phone = ?', [phone], (err, results) => {
    if (err) return callback(err);
    const verified = results.length > 0 && results[0].Verified === 1;
    callback(null, verified);
  });
};