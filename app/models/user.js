//require mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//require bcrypt package
const bcrypt = require("bcrypt");

//require unique-string for remember token
const uniqueString = require("unique-string");

//define a schema of user in DB
const userSchema = Schema(
  {
    name: { type: String, required: true },
    admin: { type: Boolean, default: 0 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rememberToken: { type: String, default: null },
    buying:[{type:Schema.Types.ObjectId , ref:"Product"}],
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

//relationship between user and products
userSchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "user",
});
//hash password after save user information in MD
userSchema.pre("save", function (next) {
  let salt = bcrypt.genSaltSync(15);
  let hash = bcrypt.hashSync(this.password, salt);
  this.password = hash;
  next();
});

//hash password after update user information in MD
userSchema.pre("findOneAndUpdate", function (next) {
  let salt = bcrypt.genSaltSync(15);
  let hash = bcrypt.hashSync(this.getUpdate().$set.password, salt);
  this.getUpdate().$set.password = hash;
  next();
});

//check password change
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

//remember token
userSchema.methods.setRememberToken = function (res) {
  const token = uniqueString();
  res.cookie("remember_token", token, {
    maxAge: 1000 * 60 * 60 * 24 * 90,
    httpOnly: true,
    signed: true,
  });
  this.update({ rememberToken: token }, (err) => {
    if (err) console.log(err);
  });
};

//export userschema in DB
module.exports = mongoose.model("User", userSchema);
