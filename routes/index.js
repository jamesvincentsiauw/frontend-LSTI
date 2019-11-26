var express = require('express');
var router = express.Router();
var requestify = require('requestify');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
router.get('/tes',function(req, res, next){
    if (req.session.loggedIn){
        var data = true
    }
    else{
        var data = false
    }
    res.render('testing', {req: data, username: req.session.username});
});
router.get('/jadwal', function (req,res,next) {
    requestify.get('http://178.128.104.74/pengelolaanjalurseleksipmb/student/jadwal')
        .then(function (response) {
            if (req.session.loggedIn){
                var data = true
            }
            else{
                var data = false
            }
            res.render('jadwal',{req: data,hasil: response.getBody()['results']})
        });
});
router.get('/berkas', function (req,res,next) {
    if (req.session.loggedIn){
        requestify.get('http://178.128.104.74/pengelolaanjalurseleksipmb/student/requirements')
            .then(function (response) {
                if (req.session.loggedIn){
                    var data = true
                }
                else{
                    var data = false
                }
                res.render('berkas',{data:data, req: response.getBody()['results'], username: req.session.username})
            });
    }
    else{
        res.redirect('/login')
    }
});
router.get('/status', function (req,res,next) {
    requestify.get('http://178.128.104.74/pengelolaanjalurseleksipmb/student/files')
        .then(function (response) {
            if (req.session.loggedIn){
                var data = true
            }
            else{
                var data = false
            }
            res.render('status',{req:data,file: response.getBody()['results'], username: req.session.username})
        });
});
router.get('/login', function (req,res,next) {
    if (req.session.loggedIn){
        res.redirect('/')
    }
    else {
        res.render('login')
    }
});
router.post('/login', function (req,res,next) {
    requestify.request('http://178.128.104.74/pengelolaanjalurseleksipmb/auth/login', {
        method: 'POST',
        body:{
            username: req.body.username,
            password: req.body.password
        }
    })
        .then(function (response) {
            console.log(response.getBody());
            if (response.getBody()['description'] !== 'Anda belum terdaftar sebagai user') {
                req.session.loggedIn = true;
                req.session.username = req.body.username;
                res.redirect('/tes')
            }
            else {
                res.render('login', {message: response.getBody()['results']})
            }
        })
});
router.get('/register', function (req,res,next) {
    if (req.session.loggedIn){
        res.redirect('/tes')
    }
    else{
        res.render('register')
    }
});
router.post('/register', function (req, res) {
    requestify.request('http://178.128.104.74/pengelolaanjalurseleksipmb/auth/register', {
        method: 'POST',
        body: {
            nama: req.body.nama,
            alamat: req.body.alamat,
            fakultas: req.body.fakultas,
            ttl: req.body.ttl,
            tingkat: req.body.tingkat,
            jalur: req.body.jalur,
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        }
    })
        .then(function (response) {
            console.log(response.getBody());
            if (response.getBody()['description'] === 'User Registered'){
                res.redirect('/login')
            }
            else {
                res.redirect('back');
            }
        })
});
router.post('/logout', function (req,res) {
    requestify.request('http://178.128.104.74/pengelolaanjalurseleksipmb/auth/logout',{
        method: 'POST'
    })
        .then(function (response) {
            console.log(response);
            req.session.loggedIn = false;
            res.redirect('/tes');
        })
});
router.get('/jadwaladmin', function (req,res,next) {
    requestify.get('http://178.128.104.74/pengelolaanjalurseleksipmb/student/jadwal')
        .then(function (response) {
            // res.send(response.getBody()['results'][0].kegiatan);
            res.render('jadwaladmin',{hasil: response.getBody()['results']})
        });
});
module.exports = router;
