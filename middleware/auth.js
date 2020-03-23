const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  //Get token from header
  const token = req.header('x-auth-token');

  //Check if not token
  if (!token) {
    return res.status(420).json({ msg: 'No token, authorization denied' });
  }
  //Verify token / 
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret')); //if have token, it will decode token by verify
    req.user = decoded.user; //set the request user = decoded user in the token
    next();
  } catch (err) { 
    res.status(420).json({ msg: 'Token is not valid' }); //if have token but not valid
  }
};
