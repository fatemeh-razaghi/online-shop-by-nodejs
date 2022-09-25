//call controllers
const controller = require("app/http/controllers/controller");

//call category model from MD
const Category = require("app/models/category");

//require Product model from MD
const Product = require("app/models/product");

//require request-promise package
const request = require("request-promise");

//require payment model from MD
const Payment = require("app/models/payment");

class productController extends controller {
  async products(req, res) {
    let query = {};
    let { search, category } = req.query;

    if (search) query.title = new RegExp(search, "gi");

    if (category && category != "all") {
      category = await Category.findOne({ slug: category });
      if (category) query.categories = { $in: [category.id] };
    }

    let products = Product.find({ ...query });

    products = await products.exec();

    let categories = await Category.find({});

    res.render("home/products", { products, categories });
  }

  //get options for url
  getUrlOption(url, params) {
    return {
      method: "POST",
      uri: url,
      header: {
        "cache-control": "no-cache",
        "content-type": "application/json",
      },
      body: params,
      json: true,
    };
  }
  //payment configuration
  async payment(req, res, next) {
    try {
      //check is there that product by getting product id
      this.validateMongoId(req.body.product);

      let product = await Product.findById(req.body.product);
      if (!product) {
        return this.alertAndBack(req, res, {
          title: "دقت کنید",
          text: "محصول مورد نظر شما یافت نشد!",
          icon: "error",
        });
      }

      //is Authenticateed?
      if (!req.isAuthenticated()) {
        return this.alertAndBack(req, res, {
          title: "عدم احراز هویت",
          text: "برای خرید محصول ابتدا  وارد سایت شوید",
          icon: "error",
          button: "بسیار خب",
        });
      }

      /***buy proccess*/

      //define parameters of payment
      let params = {
        MerchantID: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        Amount: product.price,
        CallBackUrl: "http://localhost:3000/products/payment/checker",
        Description: product.title,
        Email: req.user.email,
      };

      //get options
      let options = this.getUrlOption(
        "https://sandbox.zarinpal.com/pg/v4/payment/request.json",
        params
      );

      request(options)
        .then(async (data) => {
          //add information of payment in mongodb
          let payment = new Payment({
            user: req.user.id,
            product: product.id,
            resnumber: data.Authority,
            price: product.price,
          });

          await payment.save();
          res.redirect(
            `https://sandbox.zarinpal.com/pg/StartPay/${data.Authority}`
          );
        })
        .catch((err) => res.json(err.message));
    } catch (err) {
      next(err);
    }
  }

  //check request of payment
  async checker(req, res, next) {
    try {
      // if (req.query.Status && req.query.Status !== "OK") {

      //   return this.alertAndBack(req , res , {
      //     title:"دقت کنید",
      //     message:"پرداخت شما ناموفق بود !",
      //   })
      // }

      let payment = await Payment.findOne({ resnumber: req.query.Authority })
        .populate("product")
        .exec();
      if (!payment.product) {
        return this.alertAndBack(req, res, {
          title: "دقت کنید",
          message: "محصولی که پرداخت کرده اید وجود ندارد!",
          type: "error",
        });
      }

      let params = {
        MerchantID: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        Amount: payment.product.price,
        Authority: req.query.Authority,
      };
      let options = this.getUrlOption(
        "https://sandbox.zarinpal.com/pg/v4/payment/verify.json",
        params
      );

      request(options).then(async (data) => {
        if (data.Status == 100) {
          payment.set({ payment: true });
          req.user.buying.push(payment.product.id);

          await payment.save();
          await req.user.save();

          this.alert(req, {
            title: "با تشکر",
            message: "عملیات مورد نظر با موفقیت انجام شد",
            type: "success",
            button: "بسیار خوب",
          });

          res.redirect(payment.product.path());
        } else {
          this.alertAndBack(req, res, {
            title: "دقت کنید",
            message: "پرداخت شما با موفقیت انجام نشد",
          });
        }
      });
    } catch (err) {
      next(err);
    }
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
