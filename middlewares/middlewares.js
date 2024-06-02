const express = require("express");
const RateLimit = require("express-rate-limit");
const path = require("path");
const cookieParser = require('cookie-parser');

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

};
