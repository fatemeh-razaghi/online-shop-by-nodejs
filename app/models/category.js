//require mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//require mongoose paginate
const mongoosePaginate = require("mongoose-paginate");

//define a Schema for create product
const categorySchema = Schema(
  {
    products: [{type:  Schema.Types.ObjectId, ref: "Product" }],
    name: { type: String, required: true },
    slug: { type: String, required: true },
    parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

//use oaginate plugin for showing products
categorySchema.plugin(mongoosePaginate);

//virtual for childs of category
categorySchema.virtual("childs", {
  ref: "Category",
  localField: "_id",
  foreignField: "parent",
});

//define slug for friendly URL
categorySchema.methods.path = function () {
  return `/categories/${this.slug}`;
}; 

//export model in mongodb
module.exports = mongoose.model("Category", categorySchema);
