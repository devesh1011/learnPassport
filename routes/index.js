const router = require("express").Router();
const passport = require("passport");
const { genPassword } = require("../lib/passwordUtils");
const User = require("../models/User");
const { isAuth } = require("../middleware/isAuth.js")

router
    .post('/login', passport.authenticate('local', {
        failureRedirect: '/login-failure',
        successRedirect: '/login-success'
    }))
    .post('/register', async (req, res, next) => {
        try {
            const { username, password } = req.body;

            const hashedPassword = await genPassword(password);

            const newUser = new User({
                username,
                hash: hashedPassword
            });

            const savedUser = await newUser.save();
            res.redirect("/protected-route")
            return res.json({ "success": true, savedUser });
        } catch (error) {
            res.redirect("/");
            return res.json({ "success": false });
        }
    })
    .get('/', (req, res, next) => {
        res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
    })
    .get('/login', (req, res, next) => {

        const form = '<h1>Login Page</h1><form method="POST" action="/login">\
        Enter Username:<br><input type="text" name="username">\
        <br>Enter Password:<br><input type="password" name="password">\
        <br><br><input type="submit" value="Submit"></form>';

        res.send(form);

    })
    .get('/register', (req, res, next) => {

        const form = '<h1>Register Page</h1><form method="post" action="register">\
                        Enter Username:<br><input type="text" name="username">\
                        <br>Enter Password:<br><input type="password" name="password">\
                        <br><br><input type="submit" value="Submit"></form>';

        res.send(form);

    })
    .get('/login-success', (req, res, next) => {
        const html = "<p>You have successfully logged in. <a href='/protected-route'>Go to protected Route</a></p>"

        res.send(html);
    })
    .get('/protected-route', isAuth,(req, res, next) => {
        res.send('<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>');
    })
    .get('/logout', isAuth, (req, res, next) => {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            res.redirect('/login');
        });
    })
    .get('/login-failure', (req, res, next) => {
        res.send('You entered the wrong password.');
    })

module.exports = router;

