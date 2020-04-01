const firebase = require('../firebase/firebase');

async function auth(req, res, next) {
  try {
    var user = firebase.auth().currentUser;

    if (!user) {
      throw new Error('User not logged in');
    }

    req.user = user;

    next();
  } catch (e) {
    res.status(401).send('Please authenticate.');
  }
}

module.exports = auth;
