const firebase = require('firebase');
const config = require('./config');

const db = firebase.initializeApp({
    apiKey: "AIzaSyBP1xPewJryQ8pT2mL7kUxddBTs2b20cPQ",
    authDomain: "vanila-db.firebaseapp.com",
    projectId: "vanila-db",
    storageBucket: "vanila-db.appspot.com",
    messagingSenderId: "667140091348",
    appId: "1:667140091348:web:d410539a3428d116f8ba41"
});

module.exports = db;