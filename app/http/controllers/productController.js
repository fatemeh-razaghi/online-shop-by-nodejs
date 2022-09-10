//call controllers
const controller = require("app/http/controllers/controller");

//require Product model from MD
const Product = require("app/models/product");

class productController extends controller {
  async products(req, res) {
    //set pagination config
    let page = req.query.page || 1;
    let query = {};
    let products = await Product.paginate(
      { ...query, $or: [{ title: new RegExp(req.query.search, "gi") }] },
      { page, sort: { createdAt: 1 }, limit: 4 }
    );

    res.render("home/products", { products });
  }

  //product single page show
  async single(req, res) {
    //get slug and category from product model
    let product = await Product.findOne({ slug: req.params.product })
      .populate([
        {
          path: "user",
          select: "name",
        },
        {
          path:"categories",
          select:"name",
        }
      ]).exec();     

    // user permission for buy products
    let userPermission = await this.canUserBuy(req, product);
    res.render("home/single-product", { product, userPermission });
  }

  //user permission for buy products
  async canUserBuy(req, product) {
    let canUserBuy = false;
    if (req.isAuthenticated()) {
      if (product.type === "cash") {
        canUserBuy = req.user.check(product);
      }
    }     
    return canUserBuy;
  }
}

module.exports = new productController();
