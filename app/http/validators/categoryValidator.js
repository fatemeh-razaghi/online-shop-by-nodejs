//call controllers
const controller = require("app/http/controllers/controller");

//require check from express validator
const { check } = require("express-validator/check");

//require Category model
const Category = require("app/models/category");

class categoryValidator extends controller {
  //check userdata
  handle() {
    return [
      check("name")
        .isLength({ min: 3 })
        .withMessage("فیلد نام دسته نمی تواند کمتر از 3 کاراکتر باشد")
        .custom(async (value, { req }) => {
          if (req.query._method === "put") {
            let category = await Category.findById(req.params.id);
            if (category.slug === value) return;
          }

          let category = await Category.findOne({ slug: this.slug(value) });
          if (category) {
            if (category)
              throw new Error(
                "چنین دسته ای با این نام قبلا در سایت ثبت شده است"
              );
          }
        }),

      check("parent")
        .not()
        .isEmpty()
        .withMessage(" فیلد پدر دسته نمی تواند خالی باشد"),
    ];
  }

}

module.exports = new categoryValidator();
