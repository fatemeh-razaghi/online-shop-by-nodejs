const mongoose = require("mongoose");

//shema for password reset in MD
const passwordReset = mongoose.Schema(
  {
    email: { type: String, required: true },
    token: { type: String, required: true },
    use: { type: Boolean, default: false },
  },
  { timestamps: { updatedAt: false } }
);

module.exports = mongoose.model("PasswordReset", passwordReset);
