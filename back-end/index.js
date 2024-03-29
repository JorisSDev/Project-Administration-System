const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const yup = require("yup");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cookieParser());

const users = [];
const groups = [];

const registrationValidationSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup
    .string()
    .required()
    .min(8)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]*$/,
      "Password must contain at least one upper case letter, one lower case letter, and one digit"
    ),
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;

  registrationValidationSchema
    .validate(req.body)
    .then(() => {
      const existingUser = users.find((user) => user.email === email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const token = uuidv4();

      users.push({
        email,
        password,
        token,
      });

      res
        .status(201)
        .cookie("token", token, {
          httpOnly: true,
          SameSite: "None",
          secure: true,
        })
        .json({ message: "User registered successfully" });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).json({ message: error.message });
    });
});

app.get("/me", (req, res) => {
  const existingUser = users.find((user) => user.token === req.cookies.token);
  if (!existingUser) {
    res.status(401).send();
    return;
  }
  res
    .status(200)
    .json({ email: existingUser.email, nickname: existingUser.nickname });
});

app.post("/create-group", (req, res) => {
  const existingUser = users.find((user) => user.token === req.cookies.token);
  if (!existingUser.email) {
    res.status(401).send();
    return;
  }
  if (!existingUser) {
    res.status(401).send();
    return;
  }
  const email = existingUser.email;
  const token = uuidv4();
  groups.push({ email, token, members: [] });
  res.status(200).json({ email, token });
});

app.get("/group", (req, res) => {
  const existingGroup = groups.find(
    (group) => group.token === req.get("Token")
  );
  if (!existingGroup) {
    res.status(401).send();
    return;
  }
  res
    .status(200)
    .json({ email: existingGroup.email, members: existingGroup.members });
});

const joinValidationSchema = yup.object().shape({
  nickname: yup.string().min(3).max(50).required(),
  password: yup
    .string()
    .required()
    .min(8)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]*$/,
      "Password must contain at least one upper case letter, one lower case letter, and one digit"
    ),
});

app.post("/join", (req, res) => {
  const existingGroup = groups.find(
    (group) => group.token === req.get("Token")
  );
  if (!existingGroup) {
    res.status(401).send();
    return;
  }

  const { nickname, password } = req.body;

  joinValidationSchema
    .validate(req.body)
    .then(() => {
      const existingUser = users.find((user) => user.nickname === nickname);
      if (existingUser) {
        return res.status(400).json({ message: "Nickname already exists" });
      }

      const token = uuidv4();

      users.push({
        nickname,
        password,
        token,
      });

      existingGroup.members.push(nickname);

      res
        .status(201)
        .cookie("token", token, {
          httpOnly: true,
          SameSite: "None",
          secure: true,
        })
        .json({ message: "User registered successfully" });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).json({ message: error.message });
    });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
