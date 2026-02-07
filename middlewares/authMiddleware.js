const { decode } = require("jsonwebtoken");
const ValidationError = require("../util/validationError");
const jwt = require("../config/jwtConfig")

function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(new ValidationError('Authorization header missing', 401));
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return next(new ValidationError('Invalid authorization format', 401));
    }

    const token = parts[1];

    try {
      const decoded = jwt.verifyToken(token,next);
      req.user = { userId: decoded.userId };
      next();
    } catch (error) {
      console.log(error);
      error.statusCode = 401;
      error.message
      return next(error);

    }
  } catch (error) {
    console.log(error);
    error.statusCode = 500;
    error.message = 'unable to verify token';
    return next(error);
  }

}

module.exports = {
  authMiddleware
}