// const jwt = require('jsonwebtoken');
// exports.authenticate = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ error: 'No token' });
//   try {
//     req.user = jwt.verify(token, process.env.JWT_SECRET);
//     next();
//   } catch {
//     res.status(401).json({ error: 'Invalid token' });
//   }
// };
// exports.authorizeAdmin = (req, res, next) => {
//   if (!req.user.isAdmin) return res.status(403).json({ error: 'Access denied' });
//   next();
// };

const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ error: 'Invalid token' });
  }
};

exports.authorizeAdmin = (req, res, next) => {
  if (!req.user.isAdmin) return res.status(403).json({ error: 'Admins only' });
  next();
};
