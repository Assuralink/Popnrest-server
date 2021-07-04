const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {

    console.log("--> Headers AUTH")
    console.log(req.headers);

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    
    if (req.body.userId && Number(req.body.userId) !== userId) {
      throw 'Invalid user ID';
      console.log('>> Invalid user ID');
    } else {
      console.log('>> Auth OK');
      next();
    }
  } catch {
    res.status(403).json({
      error: new Error('User token not recognized, but sure to set your Token in Header Authorization Bearer')
    });
  }

};