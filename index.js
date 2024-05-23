require("dotenv").config();
const express = require("express");
const connectDB = require('./config/database'); 
const Middlewares = require("./middlewares/middlewares");
const {userRoute,noteRoute,} = require("./routes/exports.AllRoutes");
const PORT = process.env.PORT || 8080;


const app = express();

// ***************  DataBase Connection ***************

connectDB();

// *************** Middlewares  *********************

Middlewares(app);


// ********************* ALL GET , POST  Routes *******************
app.get("/", (req,res) => {
    res.render("home")
});

app.use("/user", userRoute);

app.use("/note", noteRoute);



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});