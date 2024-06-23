const express = require("express");
const passport = require('passport');
const signInWithSSO = require("../controllers/ssoController");

const Router = express.Router();

Router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  )
      .get('/github',
    passport.authenticate('github', { scope: ['user:email'] })
  )
      .get('/microsoft',
        passport.authenticate('microsoft')
  )
      .get('/discord',
        passport.authenticate('discord')
  );


      // callback URL'S
  
Router.get('/google/callback', (req, res, next) => {
         req.params.provider = 'google';
         next();
  }, signInWithSSO)
  
      .get('/github/callback', (req, res, next) => {
         req.params.provider = 'github';
         next();
  }, signInWithSSO)

      .get('/microsoft/callback', (req, res, next) => {
         req.params.provider = 'microsoft';
        next();
  }, signInWithSSO)

      .get('/discord/callback', (req, res, next) => {
         req.params.provider = 'discord';
        next();
  }, signInWithSSO)


module.exports = Router;