const express = require('express');
const userRepo = require('./repositories/users');
const cookieSession = require('cookie-session');

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(cookieSession({keys: ['fuqqufq3']}));

app.get('/signup', (req, res) => {
    res.send(`
        <p>Your session id: ${req.session.ID} </p>
        <form method="POST">
            <input placeholder="Email" name="email">
            <input placeholder="Password" name="pwd">
            <input placeholder="Password Confirmation" name="pwdConfirm">
            <button>Sign Up</button>
        </form>
    `);
});

app.post('/signup', async (req, res) => {
    const {email, pwd, pwdConfirm} = req.body;
    const existingUser = await userRepo.getOneBy({email: email});

    if(existingUser) {
        return res.send("<p>Email is already in use!</p>");
    }

    if(pwd !== pwdConfirm) {
        return res.send("<p>Passwords must match</p>");
    }

    // creates user
    const user = await userRepo.create({email, password: pwd});

    // create session id for user
    req.session.ID = user.id;

    res.send("<p>Account created!</p>");
});

app.get('/signout', (req, res) => {
    req.session = null;
    res.send('You are signned out');
});

app.get('/signin', (req, res) => {
    res.send(`
        <form method="POST">
            <input placeholder="Email" name="email">
            <input placeholder="Password" name="pwd">
            <button>Sign In</button>
        </form>
    `);
});

app.post('/signin', async (req, res) => {
    const {email, pwd} = req.body;
    const user = await userRepo.getOneBy({email});

    if(!user) {
        return res.send("Email is not found on the server");
    }

    const validPassword = await userRepo.compare(user.password, pwd);

    if (!validPassword) {
        return res.send("Password is incorrect");
    }

    req.session.ID = user.id;
    res.send("Successfully signed in");
});

app.listen('3000', () => {
    console.log('Listening on port: 3000');
});