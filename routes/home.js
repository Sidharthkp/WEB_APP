var express = require('express');
const accountHelpers = require('../helpers/account-helpers');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('./index', { title: 'home', home: true});
});

router.get('/login',(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/user')
  }else{
    res.render('login-signup/login', {loginErr: req.session.loginError});
    // req.session.loginErr = false;
  }
});

router.get('/admin-login',(req,res)=>{
  if(req.session.loggedIn){
    res.render('/admin')
  }
  else{
    res.render('admin/admin-login', {loginErr: req.session.loginError});
    // req.session.loginErr = false;
  }
});


router.get('/signup',(req,res)=>{
  res.render('login-signup/signup')
})

router.post('/signup',(req,res)=>{
  accountHelpers.doSignup(req.body).then((response)=>{
    console.log(response);
  });
  res.redirect('/');
})

router.post('/login',(req,res)=>{
  accountHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      req.session.user = response.user
      res.redirect('/user')
    }else{
      req.session.loginError = "Invalid username or password";
      res.redirect('/login');
    }
  });
});

router.get('/logout', (req,res)=>{
  req.session.destroy()
  res.redirect('/')
});

module.exports = router;
