const ValidationError = require("../util/validationError");


function registrationInputValidations(req, res, next) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ValidationError('please provide required fields'));
  }

  next();
};

function loginInputValidations(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ValidationError('please provide email or password'));
  }

  next();
};

function TransactionInputValidations(req, res, next) {
  const { type, category, amount, } = req.body;

  if (!type || !category || !amount) {
    return next(new ValidationError('please provide required fields',400));
  }

  if (amount <= 0) {
     return next(new ValidationError('Amount must be greater than 0',400));
  }

  next();
};

module.exports = {
  registrationInputValidations,
  loginInputValidations,
  TransactionInputValidations
}