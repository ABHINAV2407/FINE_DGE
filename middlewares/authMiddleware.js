const { decode } = require("jsonwebtoken");
const jwt = require("../config/jwtConfig")

function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: 'Authorization header missing'
      });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        message: 'Invalid authorization format'
      });
    }

    const token = parts[1];

    try {
      const decoded = jwt.verifyToken(token);
      req.user = { userId: decoded.userId };
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'unable to verify token',
      error
    });
  }

}

module.exports = {
  authMiddleware
}