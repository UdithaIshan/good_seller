const express = require('express');
const userRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const { check, validationResult } = require('express-validator');

const router = express.Router();

router.get('/signup', (req, res) => {
    res.send(signupTemplate({req}));
});

router.post('/signup', [
    check('email').trim().normalizeEmail().isEmail(),
    check('pwd').trim().isLength({min: 4, max: 8}),
    check('pwdConfirm').trim().isLength({min: 4, max: 8})
], async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    
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
    res.send(signinTemplate());
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