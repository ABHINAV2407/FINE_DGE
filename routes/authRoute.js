const express = require('express');
const authController = require('../controllers/authController');
const {registrationInputValidations,loginInputValidations} = require('../middlewares/validationMiddleware')
const authRoute = express.Router();

authRoute.post("/",registrationInputValidations, authController.registrationHandler);
authRoute.post("/login",loginInputValidations, authController.loginHandler);

module.exports = {
  authRoute
}