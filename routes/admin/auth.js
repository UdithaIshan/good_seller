const express = require('express');
const userRepo = require('../../repositories/users');

const router = express.Router();

router.get('/signup', (req, res) => {
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

router.post('/signup', async (req, res) => {
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

router.get('/signout', (req, res) => {
    req.session = null;
    res.send('You are signned out');
});

router.get('/signin', (req, res) => {
    res.send(`
        <form method="POST">
            <input placeholder="Email" name="email">
            <input placeholder="Password" name="pwd">
            <button>Sign In</button>
        </form>
    `);
});

router.post('/signin', async (req, res) => {
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

module.exports = router;