//require mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//require mongoose paginate
const mongoosePaginate = require("mongoose-paginate");

//define a schema of user in DB
const paymentSchema = Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    product: { type: Schema.Types.ObjectId, ref: "Product", default: null },
    resnumber: { type: String, required: true },
    price: { type: Number, required: true },
    payment: { type: Boolean, default: false },
  },
  { timestamps: true }
);

//use oaginate plugin for payments
paymentSchema.plugin(mongoosePaginate);

//export userschema in DB
module.exports = mongoose.model("Payment", paymentSchema);
