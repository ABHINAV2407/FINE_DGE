const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require("../config/jwtConfig");
const ApiError = require('../util/apiError');

const registrationHandler = async (req, res, next) => {
  try {
    const { name, email, password, preferences } = req.body;

    // check user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return next(new ApiError(400, `user already register with email : ${email}`));
    }

    // hashing password 
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const user = await userModel.create({ name, email, password: hashedPassword, preferences });
    res.status(201).send({
      success: true,
      messgae: 'user registered successfully'
    })

  } catch (error) {
    console.log(error);
    error.statusCode = 500;
    error.message = 'user registration failed';
    return next(error);
  }
}


const loginHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return next(new ApiError(400, `please provide correct credentials`));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ApiError(400, `please provide correct credentials`));
    }

    const token = jwt.generateToken({ userId: user._id, email: user.email });
    user.password = undefined
    res.status(200).send({
      success: true,
      messgae: 'user login successfully',
      user,
      token
    })

  } catch (error) {
    console.log(error);
    error.statusCode = 500;
    error.message = 'user login failed';
    return next(error);
  }
}

module.exports = {
  registrationHandler,
  loginHandler
}