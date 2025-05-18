const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'fdaedbec7fb17e4c40e95e5f401d6c142cc1c1211907fa091663e57692b596af'; // env variable in prod

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });

    req.user = { id: user.id }; // Attach user info from token to request
    next();
  });
}

module.exports = authenticateToken;
