//require autobind for use mor methods
const middleWare = require("./middleware");

class redirectIfAuthenticated extends middleWare {
  //handle method for when user authenticated , dont see register and login buttons
  handle(req, res, next) {
    if (req.isAuthenticated()) return res.redirect("/");
    next();
  }
}

module.exports = new redirectIfAuthenticated();
