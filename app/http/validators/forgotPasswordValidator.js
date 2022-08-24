//require validator for autobind
const validator = require("./validator");

//require check from express validator
const { check } = require("express-validator/check");

class forgotPasswordValidator extends validator {
  //check userdata
  handle() {
    return [check("email").isEmail().withMessage("فیلد ایمیل معتبر نمی باشد")];
  }
}

module.exports = new forgotPasswordValidator();
