const express = require("express");
const path = require("path");
const cookieParser = require('cookie-parser');
const RateLimit = require("express-rate-limit");
const session = require('express-session');
const lusca = require('lusca');

// Define middleware functions
const urlencodedParser = express.urlencoded({ extended: true });
const jsonParser = express.json();
const staticFiles = express.static(path.join(__dirname, "../public"));

// Set up rate limiter: maximum of 100 requests per 15 minutes
const limiter = RateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});


module.exports = function Middlewares(app) {
  app.use(cookieParser());
  app.use(urlencodedParser);
  app.use(jsonParser);
  app.use(staticFiles);
  app.set("view engine", "ejs");

  // Set trust proxy to only trust requests from localhost
  app.set("trust proxy", "loopback");

  // Use rate limiter
  app.use(limiter);

  // Set up session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
    }
  }));

  // Use CSRF protection
  app.use(lusca.csrf());

  // Middleware to make the CSRF token available in all views where we use form !
  app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
  });
};
