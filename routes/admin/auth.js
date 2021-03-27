const express = require("express");
const userRepo = require("../../repositories/users");
const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");
const { validationResult } = require("express-validator");
const { emailValidator, passwordValidator, pwdConfiramationValidator, loginPasswordValidator, loginEmailValidator } = require('../validations');

const router = express.Router();

router.get("/signup", (req, res) => {
  res.send(signupTemplate({ req }));
});

router.post("/signup", [emailValidator, passwordValidator, pwdConfiramationValidator],
  async (req, res) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.send(signupTemplate({ req, errors }));
    }

    const { email, pwd, pwdConfirm } = req.body;

    // creates user
    const user = await userRepo.create({ email, password: pwd });

    // create session id for user
    req.session.ID = user.id;

    res.send("<p>Account created!</p>");
  }
);

router.get("/signout", (req, res) => {
  req.session = null;
  res.send("You are signned out");
});

router.get("/signin", (req, res) => {
  res.send(signinTemplate({}));
});

router.post("/signin", [ loginEmailValidator, loginPasswordValidator ], async (req, res) => {
 const errors = validationResult(req);

 if(!errors.isEmpty()) {
     console.log(errors)
    return res.send(signinTemplate({ errors }));
 }
  
//   req.session.ID = user.id;
  res.send("Successfully signed in");
});

module.exports = router;
