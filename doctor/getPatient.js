const express = require("express");
const router = express.Router();
const path = require('path');
const User = require('./models/user');
const Doctor = require('./models/doctor');
const Appointment = require('./models/appointment');
const verifyToken = require('./verifyToken');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Report = require('./models/report');

const isAuthenticated = require('./middleware/isAuthenticated'); // Adjust the path accordingly

const getPatients = async (req, res) => {
    try {
        // Fetch all patients from the database
        const users = await User.find({ userType: 'patient' });

        // Render the doctorDashboard.ejs template with the users data
        res.render('doctorDashboard', { users });
    } catch (error) {
        // Handle errors appropriately
        console.error('Error fetching patients:', error);
        res.status(500).send('Internal Server Error');
    }
};
// Export the route handler
module.exports = { getPatients };