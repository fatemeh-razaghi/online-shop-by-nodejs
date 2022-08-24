//require autobind for use mor methods
const middleWare = require("./middleware");

class redirectIfNotAdmin extends middleWare {
  //handle method for when user authenticated , dont see register and login buttons
  handle(req, res, next) {
    if (req.isAuthenticated() && req.user.admin) 
    return next();
    return res.redirect("/");
  }
}

module.exports = new redirectIfNotAdmin();
