const bcrypt = require("bcryptjs");

const users = {
  netrunnerX: {
    username: "netrunnerX",
    passwordHash: bcrypt.hashSync("password123", 10),
    role: "admin",
  },
  reliefAdmin: {
    username: "reliefAdmin",
    passwordHash: bcrypt.hashSync("password123", 10),
    role: "contributor",
  },
};

exports.getUser = (username) => users[username];
