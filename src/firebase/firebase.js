// Configure firebase
const firebase = require('firebase')

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDomMyza0WU8W66bbdCar5RDg1LeEAgtp8",
    authDomain: "aki-credit-test.firebaseapp.com",
    databaseURL: "https://aki-credit-test.firebaseio.com",
    projectId: "aki-credit-test",
    storageBucket: "aki-credit-test.appspot.com",
    messagingSenderId: "926824409618",
    appId: "1:926824409618:web:e9ffcf43f3e43cea9f86cb"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

module.exports = firebase