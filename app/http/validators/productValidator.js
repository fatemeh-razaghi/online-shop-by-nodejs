//require validator for autobind
const validator = require("./validator");

//require path
const path=require("path");

//call Product model
const Product = require("app/models/product");
//require check from express validator
const { check } = require("express-validator/check");

class productValidator extends validator {
  //check userdata
  handle() {
    return [
      check("title")
        .isLength({ min:5 ,max:30 })
        .withMessage("فیلد عنوان محصول نمی تواند کمتر از 5 کاراکتر و بیشتر از 30 کاراکتر باشد")
        .custom(async (value ,{req}) => {
          if(req.query._method==="put"){
            let product= await Product.findById(req.params.id)
            if(product.title===value) return;
          }
          let product = await Product.findOne({ slug: this.slug(value) });
          if (product)
            throw new Error(
              "چنین محصولی با این عنوان قبلا در سایت قرار داده شده است"
            );
        }),

      check("body")
        .isLength({ min: 20 })
        .withMessage("فیلد توضیحات نمی تواند کمتر از 20 کاراکتر باشد"),

      check("images").custom(async (value ,{req}) => {
        if(req.query._method==="put" && value===undefined) return;
        if (!value) throw new Error("وارد کردن تصویر الزامی است");
        let fileExt=[".png" , ".jpg" , ".svg" , ".jpeg"];
        if(! fileExt.includes(path.extname(value)))
        throw new Error("فایل وارد شده فرمت یک تصویر نمی باشد");

      }),

      check("price")
        .not()
        .isEmpty()
        .withMessage("فیلد قیمت محصول نمی تواند خالی باشد"),

      check("tags").not().isEmpty().withMessage("فیلد تگ ها نباید خالی باشد"),
    ];
  }
  //slug method for URL title
  slug(title) {
    return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g, "-");
  }
}

module.exports = new productValidator();
