//call controllers
const controller = require("app/http/controllers/controller");

//call product model
const Product = require("app/models/product");

//call category model
const Category = require("app/models/category");

//require file system
const fs = require("fs");

//require path
const path = require("path");

//require sharp for resize images
const sharp = require("sharp");

class productController extends controller {
  //show products page
  async index(req, res) {
    try {
      //return page query or if it doesnt exist return page 1
      let page = req.query.page || 1;
      let products = await Product.paginate(
        {},
        { page, sort: { createdAt: 1 }, limit: 10 }
      );
      res.render("admin/products/index", { title: "بخش محصولات", products });
    } catch (err) {
      next(err);
    }
  }

  //show create product page
  async create(req, res) {
    //get categories
    let categories = await Category.find({});
    res.render("admin/products/create", {
      title: "ایجاد محصول",
      categories,
    });
  }

  //create new product here
  async store(req, res) {
    try {
      //get validation data at first
      let status = await this.validationData(req);
      if (!status) {
        //if there was any error message for file uploading then delete file
        if (req.file) fs.unlinkSync(req.file.path);

        return this.back(req, res);
      }

      //get images
      let images = this.imageResize(req.file);

      //get object from req.body
      let { title, body, type, tags, price } = req.body;

      let newProduct = new Product({
        user: req.user._id,
        slug: this.slug(title),
        title,
        body,
        type,
        tags,
        price,
        images,
        thumb: images[480],
      });
      await newProduct.save();
      return res.redirect("/admin/products");
    } catch (err) {
      next(err);
    }
  }

  //edit products
  async edit(req, res, next) {
    try {
      this.validateMongoId(req.params.id);
      //access product in DB
      let product = await Product.findById(req.params.id);

      if (!product) this.error("چنین محصولی یافت نشد", 404);

      let categories = await Category.find({});

      return res.render("admin/products/edit", {
        product,
        categories,
        title: "ویرایش محصول",
      });
    } catch (err) {
      next(err);
    }
  }

  //update configuration for products
  async update(req, res, next) {
    try {
      this.validateMongoId(req.params.id);
      //get validation data at first
      let status = await this.validationData(req);
      if (!status) {
        //if there was any error message for file uploading then delete file
        if (req.file) fs.unlinkSync(req.file.path);

        return this.back(req, res);
      }

      //delete images from body
      delete req.body.images;

      //create an object for edit and save it in DB
      let objForUpdate = {};

      //add images thumb in DB
      objForUpdate.thumb = req.body.imagesThumb;

      //check is there any image or not
      if (req.file) {
        objForUpdate.images = this.imageResize(req.file);
        objForUpdate.thumb = objForUpdate.images[480];
      }

      //change the slug
      objForUpdate.slug = this.slug(req.body.title);

      //save changes in DB
      await Product.findByIdAndUpdate(req.params.id, {
        $set: { ...req.body, ...objForUpdate },
      });

      //redirect to products page
      return res.redirect("/admin/products");
    } catch (err) {
      next(err);
    }
  }

  //destroy products
  async destroy(req, res) {
    try {
      this.validateMongoId(req.params.id);
      //get products by id
      let product = await Product.findById(req.params.id);

      //check is there any product or not?
      if (!product) {
        this.error("محصولی در این صفحه وجود ندارد", 404);
      }

      //delete images
      Object.values(product.images).forEach((image) =>
        fs.unlinkSync(`./public${image}`)
      );

      //delete product
      product.remove();

      return res.redirect("/admin/products");
    } catch (err) {
      next(err);
    }
  }

  //resize images which uploaded
  imageResize(image) {
    //get image info
    const imageInfo = path.parse(image.path);

    //get url image
    let imageAddress = {};
    imageAddress["original"] = this.getImageUrl(
      `${image.destination}/${image.filename}`
    );

    const resize = (size) => {
      //define ImageName
      let imageName = `${imageInfo.name}-${size}${imageInfo.ext}`;

      //set address for images with different sizes
      imageAddress[size] = this.getImageUrl(
        `${image.destination}/${imageName}`
      );

      //resize config by sharp
      sharp(image.path)
        .resize(size, null)
        .toFile(`${image.destination}/${imageName}`);
    };

    [1080, 720, 480].map(resize);
    return imageAddress;
  }

  //get image url without static view
  getImageUrl(dir) {
    return dir.substring(8);
  }
}

module.exports = new productController();
