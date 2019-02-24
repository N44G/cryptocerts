const express     = require('express'),
      router      = express.Router(),
      fHelper     = require('../firebase/firebase-issuer'),
      sign        = require('../signature'),
      mailer      = require('../modules/mailer');
      contract    = require('../contract');
const signoutlink = '/issuer/logout';

router.get('/login', fHelper.checkLoginPage, function(req, res){
    res.render('login', {title: 'Issuer', action: '/issuer/login', signoutlink: ''});
});

router.post('/login', function(req, res){
    fHelper.loginWithEmail(req.body.email, req.body.password, function(){
        // sign.generateKeys(function(pub, pri){
        //     fHelper.addKeysToDb({PUBLIC: pub, PRIVATE: pri});
        // });
        res.redirect('/issuer/dashboard'); 
    });
});

router.get('/logout', function(req, res){
    fHelper.logout();
    res.redirect('/');
});

router.get('/dashboard', fHelper.isLoggedIn, function(req, res){
    fHelper.getCertListFromDb(function(data){
        res.render('issuerdash', {title: 'Dashboard', data: data, signoutlink:signoutlink});
    });
});

router.get('/issueCert', fHelper.isLoggedIn, function(req, res){
    res.render('addcertificate', {title: 'Issue Certificate', signoutlink: signoutlink});
});

router.post('/issueCert', fHelper.isLoggedIn, function(req, res){
    var data = {
        name: req.body.name,
        degree: req.body.degree,
        clg: req.body.clg,
        score: req.body.score,
        batch: req.body.batch,
    }

    var dataStr = req.body.name + req.body.degree + req.body.clg + req.body.score + req.body.batch;

    fHelper.getKeysFromDb(function(keys){
        sign.createSign(dataStr, keys.PRIVATE, function(sign){
            data.sign = sign;
            contract.deploy(data, function(address){
                var dbData = {
                    name: req.body.name,
                    degree: req.body.degree,
                    clg: req.body.clg,
                    address: address,
                    sign: sign,//Remove later
                }
                fHelper.addCertToDb(dbData);
                mailer.sendCertMail(req.body.email, 'http://localhost:3000/user/cert/' + address + '/add');
                console.log("ADDRESS: ", address);
                contract.getDeployedContract(address, function(data){
                    res.send(data);
                });
            });
        });
    });
    // contract.deploy(data, function(address){
    //     var dbData = {
    //         name: req.body.name,
    //         degree: req.body.degree,
    //         clg: req.body.clg,
    //         address: address,
    //     }
    //     fHelper.addCertToDb(dbData);
    //     console.log("ADDRESS: ", address);
    //     contract.getDeployedContract(address, function(data){
    //         res.send(data);
    //     });
    // });
});

module.exports = router;