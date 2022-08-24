//require path for view
const path = require("path");

//require autobind
const autoBind = require("auto-bind");

module.exports = class Helpers {
  constructor(req, res) {
    autoBind(this);
    this.req = req;
    this.res = res;
    this.formData = req.flash("formData")[0];
  }

  //get global objects
  getObjects() {
    return {
      auth: this.auth(),
      viewPath: this.viewPath,
      ...this.getGlobalVariables(),
      old: this.old,
    };
  }

  //get options for check authentication
  auth() {
    return {
      check: this.req.isAuthenticated(),
      user: this.req.user,
    };
  }

  //get errors directory in view
  viewPath(dir) {
    return path.resolve(config.layout.view_dir + "/" + dir);
  }

  //get global variables
  getGlobalVariables() {
    return {
      errors: this.req.flash("errors"),
    };
  }

  //get form information and show it
  old(field, defaultValue = "") {
    return this.formData && this.formData.hasOwnProperty(field)
      ? this.formData[field]
      : defaultValue;
  }
};
