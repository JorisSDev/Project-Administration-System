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

const loginValidationSchema = yup.object().shape({
  email: yup.string(),
  nickname: yup.string(),
  password: yup.string().required(),
});

app.post("/login", (req, res) => {
  loginValidationSchema
    .validate(req.body)
    .then(() => {
      const { email, nickname, password } = req.body;
      const cb = (_error, existingUser) => {
        if (!existingUser) {
          return res.status(401).json({ message: "Invalid credentials" });
        }
        if (existingUser.password !== password) {
          return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = uuidv4();
        existingUser.token = token;
        db.updateUser(existingUser, () => {
          res
            .status(201)
            .cookie("token", token, {
              httpOnly: true,
              SameSite: "None",
              secure: true,
            })
            .json({ message: "Login successful" });
        });
      };
      if (email) {
        db.findUserByEmail(email, cb);
      } else {
        db.findUserByNickname(nickname, cb);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(400).json({ message: error.message });
    });
});

app.post("/logout", (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      httpOnly: true,
      SameSite: "None",
      secure: true,
      expires: new Date(0),
    })
    .end();
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

app.get("/users", (req, res) => {
  db.findUsersEmailList((error, users) => {
    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(200).json(users);
  });
});


app.get("/projects", (req, res) => {
  db.findProjectsList((_error, projects) => {
    res.status(200).json(projects);
  });
});

app.get("/manager/projects/:email", (req, res) => {
  const email = req.params.email;
  db.findProjectsList((_error, projects) => {
    const myProjects = projects.filter((project) => project.projectManager === email);
    res.status(200).json(myProjects);
  });
});

app.post("/project", (req, res) => {
  const { projectName, projectDescription, projectManager } = req.body;
  db.saveProject({
      projectName,
      projectDescription,
      projectManager,
    },
    (error) => {
      if (!error) {
        res.status(200).json({ message: "Project created successfully" });
      } else {
        console.error(error);
        res.status(500).json({ message: error.message });
      }
    }
  );
});

app.delete("/project/:projectId", (req, res) => {
  const projectId = req.params.projectId;
  db.findProjectsList((_error, projects) => {
    const updatedProjects = projects.filter((project) => project.projectId !== Number(projectId));
    db.saveProjectsList(updatedProjects, (error) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
      }
      res.status(200).json({ message: "Project deleted successfully" });
    });
  });
});

app.get("/project/:projectId", (req, res) => {
  const projectId = req.params.projectId;
  db.findProjectsList((_error, projects) => {
    const project = projects.find((project) => project.projectId === Number(projectId));
    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }
    res.status(200).json(project);
  });
});

app.post("/project/:projectId/assign", (req, res) => {
  const projectId = req.params.projectId;
  const { userEmail } = req.body;

  db.findProjectsList((_error, projects) => {
    const project = projects.find((project) => project.projectId === Number(projectId));
    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }
    project.members = project.members || [];
    project.members.push(userEmail);
    db.saveProjectsList(projects, (error) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
      }
      res.status(200).json({ message: "User assigned successfully" });
    });
  })});

  app.delete("/project/:projectId/member/:email", (req, res) => {
    const projectId = req.params.projectId;
    const email = req.params.email;
  
    db.findProjectsList((_error, projects) => {
      const project = projects.find((project) => project.projectId === Number(projectId));
      if (!project) {
        res.status(404).json({ message: "Project not found" });
        return;
      }
      project.members = project.members.filter((member) => member !== email);
      db.saveProjectsList(projects, (error) => {
        if (error) {
          console.error(error);
          res.status(500).json({ message: error.message });
        }
        res.status(200).json({ message: "User removed successfully" });
      });
    });
  });


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});