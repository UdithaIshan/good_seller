const { check } = require("express-validator");
const userRepo = require("../repositories/users");

module.exports = {
  emailValidator: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Must be valid email")
    .custom(async (email) => {
      const existingUser = await userRepo.getOneBy({ email: email });
      if (existingUser) {
        throw new Error("Email is already in use!");
      }
      return true;
    }),
  passwordValidator: check("pwd")
    .trim()
    .isLength({ min: 4, max: 8 })
    .withMessage("Must be between 4 and 8 characters"),
  pwdConfiramationValidator: check("pwdConfirm")
    .trim()
    .custom((pwdConfirm, { req }) => {
      if (req.body.pwd !== pwdConfirm) {
        throw new Error("Passwords must match");
      }
      return true;
    }),
  loginEmailValidator: check("email").custom(async (email) => {
    const user = await userRepo.getOneBy({ email });

    if (!user) {
      throw new Error("Email is not found on the server");
    }
    return true;
  }),
  loginPasswordValidator: check("pwd").custom(async (pwd, { req }) => {
    const user = await userRepo.getOneBy({ email: req.body.email });

    if (!user) {
      throw new Error("Password is incorrect");
    }

    const validPassword = await userRepo.compare(user.password, pwd);

    if (!validPassword) {
      throw new Error("Password is incorrect");
    }
    return true;
  }),
  titleValidator: check("title").trim().isLength({ min: 5, max: 40 }).withMessage('Title must be between 5 and 40 characters'),
  priceValidator: check("price").trim().toFloat().isLength({ min: 1 }).withMessage('Price must be included'),
};
