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
                console.log('id '+req.session.idPendaftar);
                res.render('berkas',{data:data, req: response.getBody()['results'], username: req.session.username, idpendaftar: req.session.idPendaftar})
            });
    }
    else{
        res.redirect('/login')
    }
});
router.get('/status', function (req,res,next) {
    requestify.get('http://178.128.104.74/pengelolaanjalurseleksipmb/student/files?id='+req.session.idPendaftar)
        .then(function (response) {
            if (req.session.loggedIn){
                var data = true
            }
            else{
                var data = false
            }
            console.log(response.getBody());
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
        });
    requestify.get('http://178.128.104.74/pengelolaanjalurseleksipmb/student')
        .then(function (response) {
            console.log(response);
            req.session.idPendaftar = response.getBody()['results'][0]['idpendaftar'];
            req.session.name = response.getBody()['results'][0]['namapendaftar'];
            console.log(req.session.idPendaftar);
            console.log(req.session.name)
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
router.post('/jadwaladmin/:id', function (req, res) {
    requestify.delete('http://178.128.104.74/pengelolaanjalurseleksipmb/admin/jadwal/'+req.params.id+'?token=8t7aBO1Q6Y0ZcC76A')
        .then(function (response) {
            console.log(response.getBody());
            res.redirect('back');
        })
});
router.get('/jadwaladmin/update/:id', function (req, res) {
    requestify.get('http://178.128.104.74/pengelolaanjalurseleksipmb/student/jadwal/')
        .then(function (response) {
            response.getBody()['results'].forEach(function (value) {
               if (value['id'] === req.params.id){
                   var hasil = value;
                   console.log(hasil);
                   res.render('editjadwal',{jadwal: hasil, id: req.params.id});
               }
            });
        })
});
router.post('/jadwaladmin/update/:id', function (req,res) {
    requestify.request('http://178.128.104.74/pengelolaanjalurseleksipmb/admin/jadwal/'+req.params.id+'?token='+req.body.token, {
        method: 'PUT',
        body: {
            kegiatan: req.body.kegiatan,
            tanggalMulai: req.body.tanggalMulai,
            tanggalAkhir: req.body.tanggalAkhir
        }
    })
        .then(function (response) {
            console.log(response.getBody());
            res.redirect('/jadwaladmin');
        })
        .fail(function (response) {
            console.log(response.getBody());
        });
    console.log(req.body.kegiatan);
    console.log(req.body.tanggalMulai);
});
router.get('/addjadwal',function (req,res) {
    res.render('addjadwal')
});
router.post('/addjadwal', function (req,res) {
    requestify.request('http://178.128.104.74/pengelolaanjalurseleksipmb/admin/jadwal?token='+req.body.token, {
        method: 'POST',
        body: {
            kegiatan: req.body.kegiatan,
            tanggalMulai: req.body.tanggalMulai,
            tanggalAkhir: req.body.tanggalAkhir
        }
    })
        .then(function (response) {
            console.log(response.getBody());
            res.redirect('/jadwaladmin');
        })
});
router.post('/berkas', function (req, res) {
    requestify.request('http://178.128.104.74/pengelolaanjalurseleksipmb/student/requirements?id='+req.session.idPendaftar, {
        method: 'POST',
        body: {
            idfiles: req.body.files,
            jalur: req.body.jalur
        }
    })
        .then(function (response) {
            console.log(response);
            res.redirect('back')
        })
});
module.exports = router;
