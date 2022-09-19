//call controllers
const controller = require("app/http/controllers/controller");

//call category model
const Category = require("app/models/category");

class categoryController extends controller {
  //show category page
  async index(req, res) {
    try {
      //return page query or if it doesnt exist return page 1
      let page = req.query.page || 1;
      let categories = await Category.paginate(
        {},
        { page, sort: { createdAt: 1 }, limit: 10, populate: "parent" }
      );

      res.render("admin/categories/index", {
        title: "دسته بندی ها ",
        categories,
      });
    } catch (err) {
      next(err);
    }
  }

  //show create category page
  async create(req, res) {
    //create categories by father category that is "null"
    let categories = await Category.find({ parent: null });
    res.render("admin/categories/create", {
      title: "ایجاد دسته جدید",
      categories,
    });
  }

  //create new category here
  async store(req, res) {
    try {
      //get validation data at first
      let status = await this.validationData(req);
      if (!status) return this.back(req, res);

      //get category information from body
      let { name, parent } = req.body;

      //create new category and save it in MD
      let newCategory = new Category({
        name,
        slug: this.slug(name),
        parent: parent !== "none" ? parent : null,
      });

      await newCategory.save();

      return res.redirect("/admin/categories");
    } catch (err) {
      next(err);
    }
  }

  //edit categories
  async edit(req, res, next) {
    try {
      this.validateMongoId(req.params.id);

      //access category in MD
      let category = await Category.findById(req.params.id);

      //create categories by father category that is "null"
      let categories = await Category.find({ parent: null });

      if (!category) {
        this.error("چنین دسته ای یافت نشد", 404);
      }

      return res.render("admin/categories/edit", {
        category,
        categories,
        title: "ویرایش دسته",
      });
    } catch (err) {
      next(err);
    }
  }

  //update configuration for categories
  async update(req, res, next) {
    try {
      //get validation data at first
      let status = await this.validationData(req);
      if (!status) return this.back(req, res);

      //update information and set in MD
      let { name, parent } = req.body;
      await Category.findByIdAndUpdate(req.params.id, {
        $set: {
          name,
          slug: this.slug(name),
          parent: parent !== "none" ? parent : null,
        },
      });

      return res.redirect("/admin/categories");
    } catch (err) {
      next(err);
    }
  }

  //destroy categories
  async destroy(req, res) {
    try {
      this.validateMongoId(req.params.id);

      //get categories and their childs by id
      let category = await Category.findById(req.params.id)
        .populate("childs")
        .exec();

      //check is there any category or not?
      if (!category) {
        this.error("چنین دسته ای وجود ندارد", 404);
      }

      //delete childs of category
      category.childs.forEach((category) => {
        category.remove();
      });

      //delete category
      category.remove();

      return res.redirect("/admin/categories");
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new categoryController();
