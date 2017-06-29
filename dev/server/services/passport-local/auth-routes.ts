// // var passport = require('passport');
// var Account = require('../data/account');
// var router = require('express').Router();
//
// router.get('/', function(req, res) {
//     res.render('index');
// });
//
// router.post('/register', function(req, res, next) {
//     //console.log('registering user');
//     Account.register(new Account({ username: req.body.username }), req.body.password, function(err) {
//         if (err) {
//             //console.log('error while user register!', err);
//             return next(err);
//         }
//
//         //console.log('user registered!');
//
//         res.redirect('/');
//     });
// });
//
// // router.get('/login', function(req, res) {
// //   res.render('login', {user: req.user});
// // });
//
// router.post('/login', passport.authenticate('local'), (req, res) => {
//     res.redirect('/');
// });
//
// router.get('/logout', function(req, res) {
//     req.logout();
//     res.redirect('/');
// });
//
// module.exports = router;
