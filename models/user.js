const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  fullName: String,
  dob: Date,
  gender: String,
  phone:String,
  patientId: {
    type: String,
    unique: true,
    required: true,
  },
  userType: String, 
});

const User = mongoose.model("User", userSchema);

module.exports = User;
