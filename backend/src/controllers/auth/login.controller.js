const { users } = require("../../utils/fakeDB");

const login = async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.status(200).json({ message: "Login successful", userId: username });
};

module.exports = login;
