const express = require("express");
const router = express.Router();

/*controllers*/

//homeContoller
const homeController = require("app/http/controllers/homeController");
const productController = require("app/http/controllers/productController");

//main page
router.get("/", homeController.index);

//call us page
router.get("/call-us", homeController.callus);

//product page
router.get("/products", productController.products);

//product single page
router.get("/products/:product", productController.single);


//logout page
router.get("/logout", (req, res) => {
  req.logout();
  res.clearCookie("remember_token");
  res.redirect("/");
});

module.exports = router;
