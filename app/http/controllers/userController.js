//call controllers
const controller = require("app/http/controllers/controller");

//require product model
const Payment = require("app/models/payment");

class userController extends controller {
  async index(req, res, next) {
    try {
      res.render("home/panel/index", { title: "پنل کاربری" });
    } catch (err) {
      next(err);
    }
  }

  async history(req, res, next) {
    try {
      //define pagination
      let page = req.query.page || 1;
      let payments = await Payment.paginate(
        { user: req.user.id },
        { page, sort: { createdAt: -1 }, limit: 5, populate: "product" })
      res.render("home/panel/history", { title: "سابقه خرید کاربر", payments });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new userController();
