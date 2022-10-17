var express = require('express');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();

/* GET admin listing. */
router.get('/', function (req, res, next) {
  if (req.session.adminloggedIn) {
    productHelpers.getAllProducts().then((products) => {
      res.render('admin/view-products', { title: 'admin', products, admin: true });
    })
  } else {
    res.redirect('/admin/admin-login');
  }
});

router.get('/add-products', (req, res) => {
  res.render('admin/add-products')
})

router.post('/add-products', (req, res) => {
  productHelpers.addProduct(req.body, (id) => {
    let image = req.files.Image;
    image.mv('public/product-images/' + id + '.jpg', (err, done) => {
      if (!err) {
        res.redirect("/admin/add-products");
      } else {
        console.log(err);
      }
    })

  });
});
router.get('/delete-product/:id', (req, res) => {
  let proId = req.params.id
  console.log(proId);
  productHelpers.deleteProduct(proId).then((response) => {
    res.redirect('/admin/');
  })
})

router.get('/edit-product/:id', async (req, res) => {
  let product = await productHelpers.getProductDetails(req.params.id)
  console.log(product);
  res.render('admin/edit-product', { product })
})

router.post('/edit-product/:id', (req, res) => {
  console.log(req.params.id);
  let id = req.params.id;
  productHelpers.updateProduct(req.params.id, req.body).then(() => {
    res.redirect('/admin')
    if (req.files) {
      let image = req.files.Image
      image.mv('./public/product-images/' + id + '.jpg')
    }
  })
})

router.get('/admin-login', function (req, res, next) {
  if (req.session.adminloggedIn) {
    res.redirect('/admin');
  } else {
    res.render('admin/admin-login', { title: 'admin-login', home: true, loginErr: req.session.adminloginError });
  }
});

router.post('/admin-login', (req, res) => {
  let username = req.body.Email;
  let password = req.body.Password;

  if (username == 'admin@gmail.com' && password == 'admin') {
    req.session.adminloggedIn = true
    res.redirect('/admin')
  } else {
    req.session.adminloginError = "Invalid admin name or password";
    res.redirect('/admin/admin-login');
  }
})

module.exports = router;
