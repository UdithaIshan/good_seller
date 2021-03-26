const layout = require("../layout");

module.exports = () => {
    return layout({
        content: `
          <form method="POST">
                  <input placeholder="Email" name="email">
                  <input placeholder="Password" name="pwd">
                  <button>Sign In</button>
              </form>
          `,
      });
};
