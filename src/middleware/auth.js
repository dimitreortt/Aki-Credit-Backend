const firebase = require('../firebase/firebase')

async function auth(req, res, next) {
    var user = firebase.auth().currentUser;

    if (user) {
         req.user = user         
    } else {
        throw new Error('User not logged in')
    }
    next()
}