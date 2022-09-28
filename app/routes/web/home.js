const express = require("express");
const router = express.Router();

/*controllers*/

//homeContoller
const homeController = require("app/http/controllers/homeController");
const productController = require("app/http/controllers/productController");
const userController=require("app/http/controllers/userController")

//middlewares
const redirectIfNotAuthenticated = require("app/http/middleware/redirectIfNotAuthenticated");

//main page
router.get("/", homeController.index);

//call us page
router.get("/call-us", homeController.callus);

//product page
router.get("/products", productController.products);

//product single page
router.get("/products/:product", productController.single);

//product payment
router.post(
  "/products/payment",
  redirectIfNotAuthenticated.handle,
  productController.payment
);
router.get(
  "/products/payment/checker",
  redirectIfNotAuthenticated.handle,
  productController.checker
);

//user panel routes
router.get("/user/panel/" , userController.index);
router.get("/user/panel/history" , userController.history);

//logout page
router.get("/logout", (req, res) => {
  req.logout();
  res.clearCookie("remember_token");
  res.redirect("/");
});

module.exports = router;
