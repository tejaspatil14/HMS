const express = require("express");
const router = express.Router();
const path = require('path');
const User = require('./models/user');
const passport = require('passport');
const Appointment = require('./models/appointment');

// console.log(require('fs').readdirSync(path.join(__dirname, '../middleware')));
const isAuthenticated = require('./middleware/isAuthenticated'); // Adjust the path accordingly

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/patientLogin', (req, res) => {
  res.render('patientLogin');
});


router.get('/signup', (req, res) => {
  res.render('signup');
});
router.get('/error', (req, res) => {
  res.render('error');
});


router.post('/signup', (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    phone:req.body.phone,
    fullName: req.body.fullName,
    dob: req.body.dob,
    gender: req.body.gender,
  });

  newUser.save()
    .then(() => {
      console.log(req.body);
      res.send("User signed up successfully!");
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) {
        // Duplicate key error (unique constraint violation)
        return res.status(400).send("Username or email already exists.");
      }
      res.status(500).send("Error saving user to the database");
   });
});



router.post('/bookAppointment', isAuthenticated, async (req, res) => {
  try {
    // Extract appointment details from the request body
    const { patientName, doctor, dateTime, reason } = req.body;

    // Create a new appointment instance
    const newAppointment = new Appointment({
      patientName,
      doctor,
      dateTime,
      reason,
      userId: req.user._id, // Assuming you store user information in the session
    });

    // Save the appointment to the database
    // req.user.appointments.push(newAppointment);
    await newAppointment.save();

    // Redirect the user to the dashboard with a success message
    res.redirect('/patientDashboard?success=Appointment booked successfully');
  } catch (error) {
    console.error('Error during appointment booking:', error);
    // Redirect the user to the dashboard with an error message
    res.redirect('/patientDashboard?error=Error booking appointment');
  }
});

router.get('/appointmentHistory', isAuthenticated, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id });
    res.render('appointmentHistory', { appointments });
  } catch (error) {
    console.error('Error fetching appointment history:', error);
    res.redirect('/patientDashboard?error=Error fetching appointment history');
  }
});

router.get('/patientDashboard', isAuthenticated, (req, res) => {
  const { success, error } = req.query;
  res.render('patientDashboard', { user: req.user, success, error });
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error during logout:', err);
      console.error("only this changed")
      return res.redirect('/');
    }
    res.clearCookie('token');
    res.redirect('/');
  });
});

module.exports = router;
// module.exports.isAuthenticated = isAuthenticated;