const layout = require("../layout");

module.exports = ({ req }) => {
  return layout({
    content: `<p>Your session id: ${req.session.ID} </p>
            <form method="POST">
                <input placeholder="Email" name="email">
                <input placeholder="Password" name="pwd">
                <input placeholder="Password Confirmation" name="pwdConfirm">
                <button>Sign Up</button>
            </form>`,
  });
};
