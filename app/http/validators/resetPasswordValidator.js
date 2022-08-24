//require validator for autobind
const validator = require("./validator");

//require check from express validator
const { check } = require("express-validator/check");

class resetPasswordValidator extends validator {
  //check userdata
  handle() {
    return [
      check("token").not().isEmpty().withMessage("فیلد توکن الزامی است"),
      check("email").isEmail().withMessage("فیلد ایمیل معتبر نمی باشد"),

      check("password")
        .isLength({ min: 8 })
        .withMessage("فیلد پسورد نمی تواند کمتر از 8 کاراکتر باشد"),
    ];
  }
}

module.exports = new resetPasswordValidator();
