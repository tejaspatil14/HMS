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
    console.log('Appointments:', appointments);

    res.render('doctorDashboard', { user: doctor, appointments });
  } catch (err) {
    console.error('Error fetching doctor appointments:', err);
    res.status(500).render('error');
  }
});

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
