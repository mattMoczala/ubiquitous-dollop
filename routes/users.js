var express = require('express');
const { createUser, loginExists } = require('../helpers');
var router = express.Router();

router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.post('/signup', async function(req, res, next){

  if (await loginExists(req.body.login)) {
    res.redirect('/signup')
  } else {
    createUser(req.body.login, req.body.password, req.body.displayName, "user")
    res.redirect('/')
  }
});

module.exports = router;
