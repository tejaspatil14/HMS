const express = require("express");
const flash = require("express-flash");
const session = require("express-session");
const app = express();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const jwtSecretKey = "123abc";
const isAuthenticated = require("./middleware/isAuthenticated");
const ejs = require("ejs");
const path = require("path");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const route = require("./route"); // Import the route module
const connectDB = require("./connection");

app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

connectDB();
// Passport Configuration
passport.use(
  new LocalStrategy(function (username, password, done) {
    console.log("Attempting authentication for user:", username);
    User.findOne({ username: username })
      .exec()
      .then((user) => {
        console.log("User found:", user);
        if (!user) {
          console.log("User not found:", username);
          return done(null, false, { message: "User not found" });
        }

        if (user.password !== password) {
          console.log("Authentication failed for user:", username);
          return done(null, false, { message: "Invalid credentials" });
        }

        console.log("Authentication successful for user:", username);
        return done(null, user);
      })
      .catch((err) => {
        console.error("Error during authentication:", err);
        return done(err);
      });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser((_id, done) => {
  User.findById(_id)
    .exec()
    .then((user) => {
      const userObject = {
        _id: user._id,
        username: user.username,
        patientId: user.patientId,
        // Add other user details as needed
      };
      done(null, userObject);
    })
    .catch((err) => {
      done(err);
    });
});

app.use(
  session({
    secret: "a5b2f7049e55cfe6bf7b6e46b49d94d67de9e65b7ee46fc1900e9bf9ea75c0a3",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

app.use("/", route); // Use the router from route.js

app.get("/patientLogin", (req, res) => {
  res.render("login", { message: req.flash("error")[0] });
});

app.post(
  "/patientLogin",
  passport.authenticate("local", {
    successRedirect: "/patientDashboard",
    failureRedirect: "/error",
    failureFlash: true,
  })
);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// Middleware for verifying a JWT token
app.use(
  "/patientDashboard",
  (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
      return res.redirect("/patientLogin");
    }

    jwt.verify(token, jwtSecretKey, (err, decoded) => {
      if (err) {
        return res.redirect("/patientLogin");
      }
      req.userId = decoded.userId;
      next();
    });
  },
  isAuthenticated
);

app.get("/patientDashboard", (req, res) => {
  console.log("Redirecting to Dashboard");
  res.render("dashboard", { user: req.user });
});

app.get("/patientDashboard", isAuthenticated, (req, res) => {
  console.log("User Object:", req.user);

  const user = req.user;

  if (user && user.appointments) {
    res.render("patientDashboard", { user });
  } else {
    res.render("patientDashboard", { user: { appointments: [] } });
  }
});
app.use(express.static(path.join(__dirname, "public")));

const port = 3000;

app.listen(port, function () {
  console.log("Server is running on Port: " + port);
  console.log("Patient Module started on Port " + port);
});
