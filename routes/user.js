var express = require('express');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();

/* GET user page. */
router.get('/', function (req, res, next) {
  if (req.session.user) {
    let users = req.session.user
    console.log(users);
    productHelpers.getAllProducts().then((products) => {
      res.render('user/products', { title: 'user', products, user: true, users });
    })
  } else {
    res.redirect('/');
  }

});

module.exports = router;
