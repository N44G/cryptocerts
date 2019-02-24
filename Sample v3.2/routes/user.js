const express   = require('express'),
      router    = express.Router(),
      fHelper      = require('../firebase/firebase-user'),
      contract  = require('../contract');
const signoutlink = '/user/logout';

router.get('/login', fHelper.checkLoginPage, function(req, res){
    res.render('login', {title: 'User', action: '/user/login', signoutlink: ''});
});

router.post('/login', function(req, res){
    fHelper.loginWithEmail(req.body.email, req.body.password, function(){
        res.redirect('/user/dashboard'); 
    });
});

router.get('/logout', function(req, res){
    fHelper.logout();
    res.redirect('/');
});


router.get('/dashboard', fHelper.isLoggedIn, function(req, res){
    fHelper.getCertListFromDb(function(certs){
        res.render('userdash', {title: 'Dashboard', certs: certs, signoutlink: signoutlink});
    });
});

router.get('/cert/:address', fHelper.isLoggedIn, function(req, res){
    res.send('Certificate');
});

router.get('/cert/:address/add', fHelper.isLoggedIn, function(req, res){
    var address = req.params.address;
    contract.getDeployedContract(address, function(data){
        var dbData = {issuer: data.college, degree: data.degree, address: address};
        fHelper.addCertToDb(dbData, function(){
            res.redirect('/user/dashboard');
        });
    });
});

router.get('/downloadverify', fHelper.isLoggedIn, function(req, res){
    res.download('./temp/verify.json');
});

module.exports = router;