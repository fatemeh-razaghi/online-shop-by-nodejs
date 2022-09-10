//require mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//require mongoose paginate
const mongoosePaginate = require("mongoose-paginate");

//define a Schema for create product
const createProductSchema = Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    title: { type: String, required: true },
    type: { type: String, required: true },
    slug: { type: String, required: true },
    body: { type: String, required: true },
    images: { type: Object, required: true },
    thumb: { type: String, required: true },
    price: { type: String, required: true },
    tags: { type: String, required: true },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

createProductSchema.virtual("category", {
  ref: "Category",
  localField: "_id",
  foreignField: "products",
});

//use oaginate plugin for showing products
createProductSchema.plugin(mongoosePaginate);

//get amounts of product type by type to persian
createProductSchema.methods.typeToPersian = function () {
  switch (this.type) {
    case "off":
      return "با تخفیف";
      break;
    default:
      return "نقدی";
      break;
  }
};

//define slug for friendly URL
createProductSchema.methods.path = function () {
  return `/products/${this.slug}`;
};

//export model in mongodb
module.exports = mongoose.model("Product", createProductSchema);
