require("dotenv").config();
const User = require("../models/userModel");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const DiscordStrategy = require('passport-discord').Strategy;
const jwt = require('jsonwebtoken');
const axios = require('axios');

const hostDomain = process.env.DOMAIN;

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${hostDomain}/auth/google/callback`
},
async function(accessToken, refreshToken, profile, done) {
    try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
            user = new User({
                email: profile.emails[0].value,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName
            });
        } 

        user.isVerified = true;
        user.userFrom = "sso";
        await user.save();
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));


// GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${hostDomain}/auth/github/callback`,
    scope: ['user:email']
},
async function(accessToken, refreshToken, profile, done) {
    try {
         // Fetch the user's emails
         const emails = await axios.get('https://api.github.com/user/emails', {
            headers: {
                'Authorization': `token ${accessToken}`
            }
        });

        const email = emails.data.find(email => email.primary && email.verified)?.email || emails.data[0]?.email;
        if (!email) {
            return done(new Error("Email not available"));
        }

        let user = await User.findOne({ email: { $eq: email } });

        if (!user) {
            user = new User({
                email: profile.emails[0].value,
                firstName: profile.displayName || profile.username,
                lastName: "",
                userFrom: "sso"
            });
        }

        user.isVerified = true;
        await user.save();
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));


// Microsoft Strategy
passport.use(new MicrosoftStrategy({
    clientID: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    callbackURL: `${hostDomain}/auth/microsoft/callback`,
    scope: ['user.read']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile._json.mail || profile._json.userPrincipalName;
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                email,
                firstName: profile._json.givenName,
                lastName: profile._json.surname,
            });
        }

        user.userFrom = 'sso';
        user.isVerified = true;
        await user.save();

        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));


// Discord Strategy
passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: `${hostDomain}/auth/discord/callback`,
    scope: ['identify', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.email;
        if (!email) {
            throw new Error('Email not available');
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                email,
                firstName: profile.username,
                lastName: ''
            });
        }

        user.userFrom = 'sso';
        user.isVerified = true;
        await user.save();
        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));



const signInWithSSO = async (req, res) => {
    passport.authenticate(req.params.provider, { failureRedirect: '/login' }, async (err, user) => {
        if (err) {
            console.error('Error in authentication callback:', err);
            return res.redirect('/login');
        }

        try {
            const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);
            res.cookie("authen", token, {
                httpOnly: true,
                secure: true,
                expires: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000),
                sameSite: "strict",
            });

            return res.status(201).render("emailVerify", {
                redirectMessage: "You are successFully signed In  Redirecting to Home...",
                redirectUrl: "/",
                error: null,
                message:null
              });

        }catch (err) {
            console.error('Error in authentication callback:', err);
            res.redirect('/login');
        }
    })(req, res);
}

module.exports = signInWithSSO;