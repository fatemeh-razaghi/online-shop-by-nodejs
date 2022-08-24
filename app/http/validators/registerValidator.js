//require validator for autobind
const validator = require("./validator");

//require check from express validator
const { check } = require("express-validator/check");

class registerValidator extends validator {
  //check userdata
  handle() {
    return [
      check("name")
        .not()
        .isEmpty()
        .withMessage("فیلد نام نمی تواند خالی باشد")
        .isLength({ min: 3 })
        .withMessage("فیلد نام نمی تواند کمتر از 5 کاراکتر داشته باشد"),

      check("email")
        .not()
        .isEmpty()
        .withMessage("فیلد ایمیل نمی تواند خالی باشد")
        .isEmail()
        .withMessage("فیلد ایمیل معتبر نمی باشد"),

      check("password")
        .not()
        .isEmpty()
        .withMessage("فیلد پسورد نمی تواند خالی باشد")
        .isLength({ min: 8 })
        .withMessage("فیلد پسورد نمی تواند کمتر از 8 کاراکتر باشد"),
    ];
  }
}

module.exports = new registerValidator();
