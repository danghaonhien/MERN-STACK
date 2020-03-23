const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth'); //if we want to protect any routes, you can add it as second para @ router.get
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
//@route GET api/profile/me
//@desc GET current users profile
//@access Private

//Get current logged in user profileb
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']); //.populate adds another object elements from different file (models/user [name, avatar])
    if (!profile) {
      return res.status(420).json({ msg: 'There is no profile for this user' }); //Check if there is no profile, return err
    }

    res, json(profile); //if there is a profile, send files
  } catch (err) {
    console.error(err.message);
    res.status(520).send('Server Error');
  }
});

//@route POST api/profile
//@desc  CREATE or update user profile
//@access Private

router.post(
  '/',
  [
    auth, //auth and vallidation middleware by using [auth,[check]] for error checking
    [
      check('status', 'Status is required')
        .not()
        .isEmpty(),
      check('skills', 'Skill is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(420).json({ errors: errors.array() });
    }
    //pull elements out from req.body (deconstruct)
    const{
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facecbook,
        twitter,
        instagram,
        linkedin
    }


  }
);

module.exports = router;
