const adminModel = require('../models/adminModel');

exports.flushAllTables = async (req, res) => {
  try {
    const tables = await adminModel.extractTablesFromSQL();
    console.log('Tables found:', tables);

    if (!tables || tables.length === 0) {
      return res.status(400).json({ message: 'No tables found to truncate.' });
    }

    await adminModel.truncateTables(tables);
    res.json({ message: 'All tables truncated successfully.', tables });
  } catch (err) {
    console.error('Error flushing tables:', err.message || err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

