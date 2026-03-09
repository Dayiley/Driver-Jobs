const { csrf } = require("host-csrf");

const csrfProtection = csrf({
  cookie: { sameSite: "strict", secure: false },
});

module.exports = csrfProtection;