//call controllers
const controller = require("app/http/controllers/controller");
const passport = require("passport");

class loginController extends controller {
  showLoginForm(req, res) {
    const title = " ورود";
    res.render("home/auth/login", {
      recaptcha: this.recaptcha.render(),
      title,
    });
  }

  //proccess of login page
  async loginProccess(req, res, next) {
    //first read recaptcha validation method from controllers and then read validation data
    await this.recaptchaValidation(req, res);
    let result = await this.validationData(req);

    if (result) return this.login(req, res, next);

    return this.back(req, res);
  }

  //login authentication
  login(req, res, next) {
    passport.authenticate("local.login", (err, user) => {
      if (!user) return res.redirect("/auth/login");
      return req.login(user, (err) => {
        if (req.body.remember) {
          //set token
          user.setRememberToken(res);
        }
        return res.redirect("/");
      });
    })(req, res, next);
  }
}

module.exports = new loginController();
