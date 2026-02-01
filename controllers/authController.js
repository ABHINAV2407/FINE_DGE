const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require("../config/jwtConfig");

const registrationHandler = async (req, res) => {
  try {
    const { name, email, password, preferences } = req.body;

    //validation
    if (!name || !email || !password) {
      res.status(500).send({
        success: false,
        messgae: 'please provide required fields',
      })
    }

    // check user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      res.status(500).send({
        success: false,
        messgae: `user already register with email : ${email}`,
      })
    }

    // hashing password 
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const user = await userModel.create({ name, email, password : hashedPassword, preferences });
    res.status(201).send({
      success: true,
      messgae: 'user registered successfully'
    })

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      messgae: 'user registration failed',
      error: error
    })
  }
}


const loginHandler = async (req,res)=> {
    try{
        const {email,password} = req.body;

        if (!email || !password) {
        res.status(500).send({
          success: false,
          messgae: 'please provide email or password',
        })
      }

      const user = await userModel.findOne({email});
      if(!user){
          res.status(500).send({
          success: false,
          messgae: `please provide correct credentials`,
        })
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch){
        res.status(500).send({
          success: false,
          messgae: `please provide correct credentials`,
        })
      }
 
      const token = jwt.generateToken({userId: user._id, email: user.email});
      user.password = undefined
      res.status(200).send({
          success: true,
          messgae: 'user login successfully',
          user,
          token
      })

    }catch(error){
      console.log(error);
      res.status(500).send({
        success: false,
        messgae: 'user login failed',
        error: error
      })
    }
}

module.exports = {
  registrationHandler,
  loginHandler
}