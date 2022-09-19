//call controllers
const controller = require("app/http/controllers/controller");

//call category model from MD
const Category = require("app/models/category");

//require Product model from MD
const Product = require("app/models/product");

class productController extends controller {
  async products(req, res) {
    let query = {};
    let { search , category } = req.query;

    if(search) 
        query.title = new RegExp(search , 'gi');

    if(category && category != 'all') {
        category = await Category.findOne({ slug : category});
        if(category) 
            query.categories = { $in : [ category.id ]}
    }

    let products = Product.find({ ...query});

    products = await products.exec();

    let categories = await Category.find({});

      
    res.render("home/products", { products, categories });
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
          path: "categories",
          select: "name",
        },
      ])
      .exec();

    res.render("home/single-product", { product });
  }
}

module.exports = new productController();
