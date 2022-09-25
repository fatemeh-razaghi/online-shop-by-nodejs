//require mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

//export userschema in DB
module.exports = mongoose.model("Payment", paymentSchema);
