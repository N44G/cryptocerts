var firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');

// Initialize Firebase
const config = {
    apiKey: "AIzaSyAWJKk-lpeb2B0Rj0HSsbz8kYAWE52-_t8",
    authDomain: "cryptocertsuser.firebaseapp.com",
    databaseURL: "https://cryptocertsuser.firebaseio.com",
    projectId: "cryptocertsuser",
    storageBucket: "cryptocertsuser.appspot.com",
    messagingSenderId: "576212006574"
  };
//firebase.initializeApp(config);
const mFirebase = firebase.initializeApp(config);
const database = mFirebase.database();

//SignUp with Email and Password
function createEmailUser(email, password){
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error){
        console.log(error);
    });
}

//Login with email and password
function loginWithEmail(email, password, callback){
    firebase.auth().signInWithEmailAndPassword(email, password)
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
    firebase.auth().signOut();
}

//Check Login status
function isLoggedIn(req, res, next){
    var user = firebase.auth().currentUser;
    if(user){
        return next();
    }
    else{
        res.redirect('/user/login');
    }
}

//Check Login status for login page
function checkLoginPage(req, res, next){
    var user = firebase.auth().currentUser;
    if(!user){
        return next();
    }
    else{
        res.redirect('/user/dashboard');
    }
}

//DB methods

//Add Certificate to database
function addCertToDb(data, callback){
    console.log(data);
    var dataref = database.ref('user/' + mFirebase.auth().currentUser.uid + '/certificates').push();
    dataref.set(data, function(err){
        if(err){
            console.log(err);
        } else {
            callback();
        }

    });
}

//Get certificates list from db
function getCertListFromDb(callback){
    var dataref = database.ref('user/' + mFirebase.auth().currentUser.uid + '/certificates');
    var arr = [];
    dataref.once('value').then(function(snapshot){
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            arr.push(childData);
          }); 
          callback(arr);       
    });
}


module.exports = {createEmailUser: createEmailUser, loginWithEmail: loginWithEmail, isLoggedIn: isLoggedIn, 
    checkLoginPage: checkLoginPage, logout: logout, addCertToDb: addCertToDb, getCertListFromDb: getCertListFromDb};