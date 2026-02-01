const express = require('express');
const authController = require('../controllers/authController');
const authRoute = express.Router();

authRoute.post("/", authController.registrationHandler);
authRoute.post("/login", authController.loginHandler);

module.exports = {
  authRoute
}