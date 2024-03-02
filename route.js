const express = require("express");
const router = express.Router();
const path = require('path');
const User = require('./models/user');
const passport = require('passport');
const Appointment = require('./models/appointment');
const shortid = require('shortid');

// console.log(require('fs').readdirSync(path.join(__dirname, '../middleware')));
const isAuthenticated = require('./middleware/isAuthenticated'); // Adjust the path accordingly

const getPatientAppointments = async (userId) => {
  try {
    const appointments = await Appointment.find({ userId });
    return appointments;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};


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
    patientId: shortid.generate(),
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
    const { patientName, doctor, dateTime, reason } = req.body;

    // Assuming you have patientId generated during signup or elsewhere
    const { patientId } = req.user;

    const newAppointment = new Appointment({
      patientName,
      doctor,
      dateTime,
      reason,
      userId: req.user._id,
      patientId, // Include patientId here
      appointmentId: shortid.generate(), // Include an appointmentId using shortid
    });

    await newAppointment.save();

    res.redirect('/patientDashboard?success=Appointment booked successfully');
  } catch (error) {
    console.error('Error during appointment booking:', error);
    res.redirect('/patientDashboard?error=Error booking appointment');
  }
});


router.get('/appointmentHistory', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    console.log('User Object for Appointment History:', user);

    const appointments = await Appointment.find({ userId: req.user._id });
    console.log('Appointments for Appointment History:', appointments);

    res.render('appointmentHistory', { user, appointments });
  } catch (error) {
    console.error('Error fetching appointment history:', error);
    res.redirect('/patientDashboard?error=Error fetching appointment history');
  }
});

router.get('/patientDashboard', isAuthenticated, async (req, res) => {
  try {
    const { success, error } = req.query;

    // Fetch user with the necessary fields
    const user = await User.findById(req.user._id).select('username patientId email fullName phone dob gender');

    if (!user) {
      return res.render('patientDashboard', { user: { appointments: [] }, success, error });
    }

    console.log('User Object:', user); // Log the user object

    const appointments = await getPatientAppointments(req.user._id);

    res.render('patientDashboard', { user, appointments, success, error });
  } catch (error) {
    console.error('Error fetching user for patientDashboard:', error);
    res.redirect('/patientLogin?error=Error fetching user');
  }
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