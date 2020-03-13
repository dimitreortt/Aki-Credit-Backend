const router = require('express').Router()
const User = require('../models/user')
const firebase = require('../firebase/firebase')
const db = firebase.database()

// Test literals
const email = 'tes2t@mail.com'
const password = 'randompassword'

router.get('/user', (req, res) => {
    res.send('This is GET user ')
})

router.post('/signIn', async (req, res) => {
    try {
        await firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password)

        res.send('Signed in successfully')
    } catch (e) {
        res.status(400).send('Unable to login...')
    }
})

router.post('/signUp', async (req, res) => {
    try {       
        firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
        });

        await firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password)

        var user = firebase.auth().currentUser;
        if (user) {
            console.log('logged')
        } else {
           throw new Error('User not logged in')
        }
        res.send(user)

    } catch (e) {
        console.log(e.message)
        res.status(400).send('Unable to sign up...')
    }
})

router.post('/googleSignUp', async (req, res) => {
    console.log('Aqui')
    var provider = new firebase.auth.GoogleAuthProvider();
    
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

    firebase.auth().useDeviceLanguage();

    provider.setCustomParameters({
        'login_hint': 'user@example.com'
    });

    await firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        document.write('Hello ' + user.displayName)
        res.send('Hello' + user.displayName)
        // ...
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        res.send({ errorCode, errorMessage, email, credential})
    });

})

router.post('/signOut', async (req, res) => {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        res.send('Sign-out successful.')
    }).catch(function(error) {
        // An error happened.
        res.send('An error happened.')
      });      
})

router.get('/isLogged', (req, res) => {
    var user = firebase.auth().currentUser;

    if (user) {
         req.body.email === user.email
         res.send('User is logged')
    } else {
        res.status(400).send('Not logged')
    }
})


module.exports = router