// models/doctor.js

const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  department: String,
  fullName: String,
  username: String, 
  password: String,
  gender: String,
  phone: String, 
  email: String,
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
