// controllers/authController.js
const { getUser } = require("../utils/auth");



exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = getUser(username);
  res.json({user: { username, role: user.role } });
};
