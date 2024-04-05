const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const yup = require("yup");
const { v4: uuidv4 } = require("uuid");
const db = require("./db");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cookieParser());

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
      db.findUserByEmail(email, (_error, existingUser) => {
        if (existingUser) {
          return res.status(400).json({ message: "Email already exists" });
        }

        const token = uuidv4();

        db.saveUser(
          {
            email,
            password,
            token,
          },
          () => {
            res
              .status(201)
              .cookie("token", token, {
                httpOnly: true,
                SameSite: "None",
                secure: true,
              })
              .json({ message: "User registered successfully" });
          }
        );
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).json({ message: error.message });
    });
});

app.get("/me", (req, res) => {
  db.findUserByToken(req.cookies.token, (_error, existingUser) => {
    if (!existingUser) {
      res.status(401).send();
      return;
    }
    res
      .status(200)
      .json({ email: existingUser.email, nickname: existingUser.nickname });
  });
});

app.post("/create-group", (req, res) => {
  db.findUserByToken(req.cookies.token, (_error, existingUser) => {
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
    db.saveGroup({ email, token, members: [] }, () => {
      res.status(200).json({ email, token });
    });
  });
});

app.get("/group", (req, res) => {
  db.findGroupByToken(req.get("Token"), (_error, existingGroup) => {
    if (!existingGroup) {
      res.status(401).send();
      return;
    }
    res
      .status(200)
      .json({ email: existingGroup.email, members: existingGroup.members });
  });
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
  db.findGroupByToken(req.get("Token"), (_error, existingGroup) => {
    if (!existingGroup) {
      res.status(401).send();
      return;
    }

    const { nickname, password } = req.body;

    joinValidationSchema
      .validate(req.body)
      .then(() => {
        db.findUserByNickname(nickname, (_error, existingUser) => {
          if (existingUser) {
            return res.status(400).json({ message: "Nickname already exists" });
          }

          const token = uuidv4();

          db.saveUser(
            {
              nickname,
              password,
              token,
            },
            () => {
              existingGroup.members.push(nickname);
              db.updateGroup(existingGroup, () => {
                res
                  .status(201)
                  .cookie("token", token, {
                    httpOnly: true,
                    SameSite: "None",
                    secure: true,
                  })
                  .json({ message: "User registered successfully" });
              });
            }
          );
        });
      })
      .catch((error) => {
        console.error(error);
        res.status(400).json({ message: error.message });
      });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
