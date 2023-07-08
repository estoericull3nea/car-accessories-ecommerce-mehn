const router = require('express').Router()

const {
  gTempHomepage,
  gLogin,
  gRegister,
  pRegister,
  pLogin,
  usingMiddleware,
  pAddToCart,
  gCart,
  pDeleteItemCart,
  gProduct,
  gOurTeam,
  pCart,
  gFaq,
  gTermsnConditions,
  gPrivacyPolicy,
  gAboutUs,
  gHome,
  pConfirmation,
  pContactUsForm,
  gSearchItem,
  gProfile,
  pLogout,
  pPayment,
} = require('../controllers/customer_controller')

// setting router
router.get('/', gTempHomepage)
router.get('/login', gLogin)
router.get('/register', gRegister)
router.post('/register', pRegister)
router.post('/login', pLogin)
router.use(usingMiddleware)
router.post('/add-to-cart', pAddToCart)
router.get('/cart', gCart)
router.post('/delete-item-cart', pDeleteItemCart)
router.get('/products', gProduct)
router.get('/our-team', gOurTeam)
router.post('/cart', pCart)
router.get('/faq', gFaq)
router.get('/terms-and-conditions', gTermsnConditions)
router.get('/privacy-policy', gPrivacyPolicy)
router.get('/about_us', gAboutUs)
router.get('/home', gHome)
router.get('/confirmation/:tokenId', pConfirmation)
router.post('/contact-us', pContactUsForm)
router.get('/products/search-item', gSearchItem)
router.get('/profile', gProfile)
router.post('/logout', pLogout)
router.post('/payment', pPayment)

// router.get("/verify", gVerify)

// router.get("/profile", (req, res) => {
//   req.user
//     .populate("cart.items.productId")
//     .then((user) => {
//       res.render("profile", {
//         cart: user.cart,
//         pageTitle: "Profile",
//       });
//     })
//     .catch((err) => console.log(err));
// });

// router.post("/delete-list", (req, res) => {
//   try {
//     Product.deleteOne({ _id: req.body.id }).then((result) => {
//       res.redirect("/home");
//     });
//   } catch (error) {
//     res.send(error);
//   }
// });
module.exports = router
