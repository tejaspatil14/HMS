// models/doctor.js

const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  department: { type: String, required: true },
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
