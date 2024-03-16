const express = require("express");
const router = express.Router();
const path = require('path');
const User = require('./models/user');
const Doctor = require('./models/doctor');
const Appointment = require('./models/appointment');
const verifyToken = require('./verifyToken');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const isAuthenticated = require('./middleware/isAuthenticated'); // Adjust the path accordingly

router.get('/', (req, res) => {
  res.render('index');
});
router.get('/error', (req, res) => {
  res.render('error');
});

router.get('/doctorLogin', (req, res) => {
  res.render('doctorLogin');
});

router.get('/doctorRegister', (req, res) => {
  res.render('doctorRegister');
});

router.post('/doctorRegister', async (req, res) => {
  try {
    const newDoctor = new Doctor({
      department: req.body.department,
      fullName: req.body.fullName,
      username: req.body.username,
      password: req.body.password,
      gender: req.body.gender,
      phone: req.body.phone,
      email: req.body.email,
    });

    await newDoctor.save();
    console.log(req.body);
    res.send("Doctor registered successfully!");
  } catch (err) {
    console.error(err);

    if (err.code === 11000) {
      return res.status(400).send("Username or email already exists.");
    }

    res.status(500).send("Error saving doctor to the database");
  }
});

router.get('/doctorDashboard', isAuthenticated, async (req, res) => {
  try {
    const doctorUsername = req.user.username;
    const doctor = await Doctor.findOne({ username: doctorUsername }).exec();

    if (!doctor) {
      return res.status(404).send('Doctor not found');
    }

    const appointments = await Appointment.find({ doctor: doctorUsername }).exec();
    // console.log('Appointments:', appointments);

    res.render('doctorDashboard', { user: doctor, appointments });
  } catch (err) {
    console.error('Error fetching doctor appointments:', err);
    res.status(500).render('error');
  }
});

router.post('/appointments/:id/report', async (req, res) => {
  try {
      // Extract appointment ID from request parameters
      const appointmentId = req.params.id;

      // Find the appointment in the database
      const appointment = await Appointment.findById(appointmentId);

      if (!appointment) {
          return res.status(404).send('Appointment not found');
      }

      // Update the appointment with report information
      appointment.diagnosis = req.body.diagnosis;
      appointment.treatment = req.body.treatment;
      appointment.prescriptions = req.body.prescriptions;
      appointment.notes = req.body.notes;

      // Save the updated appointment to the database
      await appointment.save();

      // Respond with a success message
      res.status(200).send('Report saved successfully');
      
  } catch (err) {
      console.error('Error saving report:', err);
      res.status(500).send('Error saving report');
  }
});

// Import necessary modules and models

// ... (other imports)

// Route to handle updating appointment status
router.post('/updateAppointmentStatus', isAuthenticated, async (req, res) => {
  try {
    const appointmentId = req.body.appointmentId;
    const newStatus = req.body.newStatus;

    // Ensure the appointmentId and newStatus are provided
    if (!appointmentId || !newStatus) {
      return res.status(400).send('Invalid request');
    }

    // Find the appointment by ID
    const appointment = await Appointment.findById(appointmentId).exec();

    // Check if the appointment exists
    if (!appointment) {
      return res.status(404).send('Appointment not found');
    }

    // Update the appointment status
    appointment.status = newStatus;

    // Save the updated appointment
    await appointment.save();

    // Redirect back to the doctor dashboard
    res.redirect('/doctorDashboard');
  } catch (err) {
    console.error('Error updating appointment status:', err);
    res.status(500).render('error');
  }
});

// Other route handlers can be added here



router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error during logout:', err);
      return res.redirect('/');
    }
    res.clearCookie('token');
    res.redirect('/');
  });
});

module.exports = router;
