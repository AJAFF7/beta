const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Pauth_Model1 = mongoose.model("p1-auths", UserSchema);

module.exports = Pauth_Model1; // ✅ CommonJS export only