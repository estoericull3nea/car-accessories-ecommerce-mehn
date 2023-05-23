const mongoose = require("mongoose");

const empSchema = new mongoose.Schema({
  email: {
    type: String,
    requried: true,
  },
  password: {
    type: String,
    requried: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
});

const Register = new mongoose.model("Register", empSchema);
module.exports = Register;
