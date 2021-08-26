const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  profPict: { type: String, required: true },
  events: { type: Array, required: false },
  taskSections: { type: Array, required: false },
  noteSections: { type: Array, required: false },
});

const User = mongoose.model("User", userSchema, "User");
module.exports = User;
