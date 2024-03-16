// models/appointment.js

const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  doctor: { type: String, required: true },
  dateTime: { type: Date, required: true },
  reason: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['confirmed', 'cancelled', 'completed'], default: 'confirmed' },

  diagnosis: { type: String, required: true },
  treatment: { type: String, required: true },
  prescriptions: { type: String },
  notes: { type: String }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
