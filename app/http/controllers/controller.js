//auto bind package
const autoBind = require("auto-bind");
const { time } = require("console");

//express-recaptcha package
const Recaptcha = require("express-recaptcha").Recaptcha;

//require validation result from express validator
const { validationResult } = require("express-validator/check");

//require isMongoId from validator
const isMongoId = require("validator/lib/isMongoId");

module.exports = class controller {
  constructor() {
    autoBind(this);
    this.recaptchaConfig();
  }

  //recaptcha configuration
  recaptchaConfig() {
    this.recaptcha = new Recaptcha(
      config.service.recaptcha.site_key,
      config.service.recaptcha.secret_key,
      { ...config.service.recaptcha.options }
    );
  }

  //validate users data
  async validationData(req) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const errors = result.array();
      const messages = [];
      errors.forEach((err) => messages.push(err.msg));

      req.flash("errors", messages);
      return false;
    }
    return true;
  }

  //recaptcha validation
  recaptchaValidation(req, res) {
    //define a Promise for recaptcha validation and then user data validation in register controller
    return new Promise((resolve, reject) => {
      //verify recaptcha requests
      this.recaptcha.verify(req, (err, data) => {
        if (err) {
          //show error message and go back to previous url
          req.flash(
            "errors",
            "گزینه امنیتی مربوط به شناسایی روبات خاموش است ، لطفا از فعال بودن آن اطمینان حاصل نمایید و مجددا تلاش کنید "
          );
          return this.back(req, res);
        } else {
          resolve(true);
        }
      });
    });
  }

  //alert for show sweetmessages
  alert(req, data) {
    let title = data.title || "",
      text = data.text || "",
      icon = data.icon || "info",
      button = data.button || null,
      timer = data.timer || 2000;

    req.flash("sweetalert", { title, text, icon, button, timer });
  }

  //alert for show sweetmessages and back to same page
  alertAndBack(req, res, data) {
    this.alert(req, data);
    this.back(req, res);
  }

  // validate mongo id
  validateMongoId(paramId) {
    if (!isMongoId(paramId)) this.error("چنین آیدی ای ثبت نشده است", 404);
  }

  error(message, status = 500) {
    let err = new Error(message);
    err.status = status;
    throw err;
  }

  //back to same page that you have been
  back(req, res) {
    req.flash("formData", req.body);
    return res.redirect(req.get("referer") || "/");
  }
  //slug method for URL title
  slug(title) {
    return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g, "-");
  }
};
