const { users } = require("../../utils/fakeDB");

const register = async (req, res) => {
  const { username, email, phone, line, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const exists = users.find((u) => u.email === email);
  if (exists) {
    return res.status(409).json({ error: "Email already registered" });
  }

  users.push({ username, email, phone, line, password });
  res.status(201).json({ message: "User registered successfully" });
};

module.exports = register;
