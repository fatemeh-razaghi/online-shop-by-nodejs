const express = require("express");
const router = express.Router();

//controllers
const adminController = require("app/http/controllers/admin/adminController");
const productController = require("app/http/controllers/admin/productController");

//helpers
const upload = require("app/helpers/uploadImage");

//middlewares
const convertFileToField = require("app/http/middleware/convertFileToField");

//validators
const productValidator = require("app/http/validators/productValidator");

//define admin/master
router.use((req, res, next) => {
  res.locals.layout = "admin/master";
  next();
});

//admin routes
router.get("/", adminController.index);
router.get("/products", productController.index);
router.get("/products/create", productController.create);
router.post(
  "/products/create",
  upload.single("images"),
  convertFileToField.handle,
  productValidator.handle(),
  productController.store
);

router.get("/products/:id/edit", productController.edit);
router.put(
  "/products/:id",
  upload.single("images"),
  convertFileToField.handle,
  productValidator.handle(),
  productController.update
);
router.delete("/products/:id", productController.destroy);

module.exports = router;
