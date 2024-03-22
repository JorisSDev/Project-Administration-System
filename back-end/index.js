const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());

const users = [];

app.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).json({ error: "Email already exists" });
  }

  const newUser = {
    email,
    password,
  };

  users.push(newUser);

  res.status(201).json({ message: "User registered successfully" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
