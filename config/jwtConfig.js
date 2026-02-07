const jwt = require('jsonwebtoken');

function generateToken(payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  return token;
}

function verifyToken(token,next) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.log(error);
    error.statusCode = 401;
    error.message = "Invalid or expired token"
    return next(error);
  }
}

module.exports = {
  generateToken,
  verifyToken
}

