var express = require('express');
var router = express.Router();
var requestify = require('requestify'); 
var rp = require('request-promise');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
router.get('/tes',function(req, res, next){
    res.render('testing');
});
router.get('/jadwal', function (req,res,next) {
    res.render('jadwal', {hasil: requestify.get('http://178.128.104.74/pengelolaanjalurseleksipmb/student/jadwal').then(function(response) {
        JSON.stringify(response.getBody());
        })})
});
router.get('/berkas', function (req,res,next) {
    res.render('berkas');
});
router.get('/login', function (req,res,next) {
    res.render('login');
});
router.get('/register', function (req,res,next) {
    res.render('register');
});

module.exports = router;
