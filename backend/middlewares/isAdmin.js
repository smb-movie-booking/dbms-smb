module.exports = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  } else {
    return res.status(403).json({ message: 'Forbidden: Admins only.' });
  }
};