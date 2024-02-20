const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require("passport");
const connectDB = require("./config/db");
require("./config/passport")
const userRoutes = require("./routes");

require("dotenv").config();

const app = express();

const sessionStore = new MongoStore({
    mongooseConnection: mongoose.connection,
    collection: 'sessions'
});

const sessionOptions = {
    secret: 'some_secret',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', userRoutes);

app.listen(3000, () => {
    connectDB();

    console.log("Server is running on port 3000");
});
