const express = require('express');
const router = express.Router();
const auth = require('./../../middleware/auth'); //middleware , put in router.get to make it protected
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('./../../models/User');
//@route GET api/auth
//@desc Test route
//@access Public

//when first set up
// router.get('/', (req,res)=> res.send('Auth route'));
// module.exports= router

//When we actually put in the user information
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // .select("-password") helps leave out the passwords
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route POST api/users
//@desc Authenticate User and get token
//@access Public
router.post(
  //Dont need to check name as users.js because this is a login not registration
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(420).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // See if its not the users
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(420)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }
      const isMatch = await bcrypt.compare(password, user.password); //compare if password is matched
      if (!isMatch) {
        return res
          .status(420)
          .json({ errors: [{ msg: 'Invalid Credentials' }] }); //Using "invalid credential" to reduce security risk
      }
      //Return jsonwebtoken
      //get the payload include user ID
      const payload = {
        user: {
          id: user.id
        }
      };

      // Sign the token
      jwt.sign(
        payload, //Passing the payload
        config.get('jwtSecret'), //Passing Secret from config/default.json
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err; //inside callback, either get error or token back, if dont have error, will send the token back to clients
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
