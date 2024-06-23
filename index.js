require("dotenv").config();
const express = require("express");
const connectDB = require('./config/database'); 
const Middlewares = require("./middlewares/middlewares");
const isLoggedOut = require("./middlewares/isLoggedOut");
const home = require("./routes/homeRoute")
const { userRoute,noteRoute,ssoRoute,route404 } = require("./routes/exports.AllRoutes");
const PORT = process.env.PORT || 8080;


const app = express();



// ***************  DataBase Connection ***************

connectDB();

// *************** Normal Middlewares  *********************

Middlewares(app);

// ********************* ALL GET , POST  Routes *******************

app.use("/", home);

app.get("/login", isLoggedOut, (req, res) => {
    const error = req.query.error || null;
    res.render("login", { error });
  });

app.get("/register", isLoggedOut, (req, res) => {
    const error = req.query.error || null;
    res.render("register", { error });
});

app.use('/auth', ssoRoute);

app.use("/user", userRoute);

app.use("/note", noteRoute);


// ***************** 404 Route **********************
app.use("*", route404);



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});