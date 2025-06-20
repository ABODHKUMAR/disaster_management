// controllers/authController.js
const { getUser } = require("../utils/auth");
const { supabase } = require("../supabase/supabaseClient");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();


// exports.login = async (req, res) => {
//   const { username, password } = req.body;
//   const user = getUser(username);
//   res.json({user: { username, role: user.role } });
// };

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if both fields are provided
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    // Fetch user from Supabase
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .limit(1);

    if (error) throw error;

    const user = users?.[0];
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    console.log("User authenticated:", user);
    // Generate token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "6h" }
    );

    // Respond with token and user info
    res.status(200).json({
      token,
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (err) {
    console.error("Login failed:", err);
    res.status(500).json({ error: err.message });
  }
};




exports.registerUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ error: "username, password, and role are required" });
    }

    const { data: existingUsers, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("username", username);

    if (findError) throw findError;
    if (existingUsers.length > 0) {
      return res.status(409).json({ error: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const payload = {
      username,
      password: hashedPassword,
      role,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from("users")
      .insert(payload)
      .select();

    if (error) throw error;

    const user = data[0];

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "6h" }
    );

    res.status(201).json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    console.error("Register failed:", err);
    res.status(500).json({ error: err.message });
  }
};
