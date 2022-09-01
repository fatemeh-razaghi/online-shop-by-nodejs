const express = require("express");
const router = express.Router();

//controllers
const adminController = require("app/http/controllers/admin/adminController");
const productController = require("app/http/controllers/admin/productController");
const categoryController=require("app/http/controllers/admin/categoryController");

//helpers
const upload = require("app/helpers/uploadImage");

//middlewares
const convertFileToField = require("app/http/middleware/convertFileToField");

//validators
const productValidator = require("app/http/validators/productValidator");
const categoryValidator=require("app/http/validators/categoryValidator");


//define admin/master
router.use((req, res, next) => {
  res.locals.layout = "admin/master";
  next();
});

/*admin routes**/

//product routes
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


//category routes
router.get("/categories" , categoryController.index);
router.get("/categories/create" , categoryController.create);
router.post("/categories/create" , categoryValidator.handle() , categoryController.store);
router.get("/categories/:id/edit" , categoryController.edit);
router.put("/categories/:id" , categoryValidator.handle() , categoryController.update)
router.delete("/categories/:id" , categoryController.destroy);


module.exports = router;