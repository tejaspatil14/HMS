
// models/report.js

const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  diagnosis: { type: String },
  treatment: { type: String },
  prescriptions: { type: String },
  notes: { type: String }
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;