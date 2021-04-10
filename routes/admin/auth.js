const express = require("express");

const { hanldeErrors } = require('./middleware');
const userRepo = require("../../repositories/users");
const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");
const { emailValidator, passwordValidator, pwdConfiramationValidator, loginPasswordValidator, loginEmailValidator } = require('./validations');

const router = express.Router();

router.get("/signup", (req, res) => {
  res.send(signupTemplate({ req }));
});

router.post("/signup", [emailValidator, passwordValidator, pwdConfiramationValidator], hanldeErrors(signupTemplate),
  async (req, res) => {

    const { email, pwd, pwdConfirm } = req.body;

    // creates user
    const user = await userRepo.create({ email, password: pwd });

    // create session id for user
    req.session.ID = user.id;

    res.redirect('/admin/products');
  }
);

router.get("/signout", (req, res) => {
  req.session = null;
  res.send("You are signned out");
});

router.get("/signin", (req, res) => {
  res.send(signinTemplate({}));
});

router.post("/signin", [ loginEmailValidator, loginPasswordValidator ], hanldeErrors(signinTemplate), async (req, res) => {
  
  const { email } = req.body;
  const user = await userRepo.getOneBy({ email });
  req.session.ID = user.id;
  res.redirect('/admin/products');
});

module.exports = router;
