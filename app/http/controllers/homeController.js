//call controllers
const controller = require("app/http/controllers/controller");

//require product model
const Product=require("app/models/product");

class homeController extends controller {
  async index(req, res) {

    //access product model in MD for show them in views
    let products= await Product.find({}).sort({createdAt:1}).limit(8).exec();
    res.render("home/index" , {products});
  }

  //call us
  callus(req , res){
    res.render("home/callus");
  }
}

module.exports = new homeController();
