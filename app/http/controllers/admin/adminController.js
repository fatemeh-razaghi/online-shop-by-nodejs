//call controllers
const controller = require("app/http/controllers/controller");

class adminController extends controller {
  index(req, res) {
    res.render("admin/index");
  }
}

module.exports = new adminController();
