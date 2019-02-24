var firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database')

// Initialize Firebase
const config = {
    apiKey: "AIzaSyDBHY_1u8g_dXyrACbyPGhQpbbpmzR8OtU",
    authDomain: "cryptocertsissuer.firebaseapp.com",
    databaseURL: "https://cryptocertsissuer.firebaseio.com",
    projectId: "cryptocertsissuer",
    storageBucket: "cryptocertsissuer.appspot.com",
    messagingSenderId: "790482151042"
  };
const mFirebase = firebase.initializeApp(config, 'issuer');
const database = mFirebase.database();

//Login with email and password
function loginWithEmail(email, password, callback){
    mFirebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(user){
        console.log("LoggedIn");
        callback();
    })
    .catch(function(error){
        console.log(error);
    });
}

//Logout of firebase account
function logout(){
    mFirebase.auth().signOut();
}

//Check Login status
function isLoggedIn(req, res, next){
    var user = mFirebase.auth().currentUser;
    if(user){
        return next();
    }
    else{
        res.redirect('/issuer/login');
    }
}

//Check Login status for login page
function checkLoginPage(req, res, next){
    var user = mFirebase.auth().currentUser;
    if(!user){
        return next();
    }
    else{
        res.redirect('/issuer/dashboard');
    }
}

//Add Certificate to database
function addCertToDb(data){
    console.log(data);
    //var data = {name: 'John', Year: '2019'};
    var dataref = database.ref('issuer/' + mFirebase.auth().currentUser.uid + '/certificates').push();
    dataref.set(data);
}

//Add keys to database
function addKeysToDb(keys){
    var dataref = database.ref('issuer/' + mFirebase.auth().currentUser.uid + '/keys');
    dataref.set(keys);
}

//Get certificates list from db
function getCertListFromDb(callback){
    var dataref = database.ref('issuer/' + mFirebase.auth().currentUser.uid + '/certificates');
    var arr = [];
    dataref.once('value').then(function(snapshot){
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            arr.push(childData);
          }); 
          callback(arr);       
    });
}

//Get the keys from db
function getKeysFromDb(callback){
    var dataref = database.ref('issuer/' + mFirebase.auth().currentUser.uid + '/keys');
    dataref.once('value').then(function(snapshot){
        callback(snapshot.val());
    });
}



module.exports = {loginWithEmail: loginWithEmail, isLoggedIn: isLoggedIn, 
    checkLoginPage: checkLoginPage, logout: logout, addCertToDb: addCertToDb, getCertListFromDb: getCertListFromDb,
    addKeysToDb: addKeysToDb, getKeysFromDb: getKeysFromDb};