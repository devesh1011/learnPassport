const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const connectDB = require("./db");
const User = require("../models/User");
const { validPassword } = require("../lib/passwordUtils")

const verifyCallback = async (username, password, done) => {
    try {
        const user = await User.findOne({ username: username }).select("username hash").exec();

        if (!user) {
            return done(null, false);
        }

        const isValid = validPassword(password, user.hash);

        if (!isValid) {
            return done(null, false);
        }
        return done(null, user);
    } catch (error) {
        done(error.message)
    }
};

const strategy = new LocalStrategy({
    usernameField: 'username'
}, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
    try {
        const user = await User.findById(userId);

        if (user) {
            done(null, user);
        }
    } catch (error) {
        done(err);
    }
})