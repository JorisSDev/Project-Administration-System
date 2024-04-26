const fs = require("fs");

const USERS_DATA_FILE_PATH = "data/users.json";
const GROUPS_DATA_FILE_PATH = "data/groups.json";
const PROJECTS_DATA_FILE_PATH = "data/projects.json";

module.exports.findUserByEmail = (email, cb) => {
  fs.readFile(USERS_DATA_FILE_PATH, "utf8", (err, data) => {
    if (err) {
      return cb(err);
    }
    const users = JSON.parse(data);
    cb(
      null,
      users.find((user) => user.email === email)
    );
  });
};

module.exports.findUserByToken = (token, cb) => {
  fs.readFile(USERS_DATA_FILE_PATH, "utf8", (error, data) => {
    if (error) {
      return cb(error);
    }
    const users = JSON.parse(data);
    cb(
      null,
      users.find((user) => user.token === token)
    );
  });
};

module.exports.saveUser = (userDetails, cb) => {
  fs.readFile(USERS_DATA_FILE_PATH, "utf8", (err, data) => {
    if (err) {
      return cb(err);
    }
    const users = JSON.parse(data);
    users.push(userDetails);
    fs.writeFile(USERS_DATA_FILE_PATH, JSON.stringify(users), "utf8", cb);
  });
};

module.exports.updateUser = (userDetails, cb) => {
  fs.readFile(USERS_DATA_FILE_PATH, "utf8", (err, data) => {
    if (err) {
      return cb(err);
    }
    const users = JSON.parse(data);
    const user = userDetails.email
      ? users.find((user) => user.email === userDetails.email)
      : users.find((user) => user.nickname === userDetails.nickname);
    user.token = userDetails.token;
    fs.writeFile(USERS_DATA_FILE_PATH, JSON.stringify(users), "utf8", cb);
  });
};

module.exports.findUsersEmailList = (cb) => {
  fs.readFile(USERS_DATA_FILE_PATH, "utf8", (err, data) => {
    if (err) {
      return cb(err);
    }
    const users = JSON.parse(data);
    cb(null, users.map((user) => user.email));
  });
}

module.exports.findProjectsList = (cb) => {
  fs.readFile(PROJECTS_DATA_FILE_PATH, "utf8", (err, data) => {
    if (err) {
      return cb(err);
    }
    cb(null, JSON.parse(data));
  });
};
module.exports.saveProject = (projectDetails, cb) => {
  fs.readFile(PROJECTS_DATA_FILE_PATH, "utf8", (err, data) => {
    if (err) {
      return cb(err);
    }
    const projects = JSON.parse(data);
    const newProject = {
      projectId: projects.length + 1,
      projectName: projectDetails.projectName,
      projectDescription: projectDetails.projectDescription,
      projectManager: projectDetails.projectManager,
    };

    projects.push(newProject);
    fs.writeFile(PROJECTS_DATA_FILE_PATH, JSON.stringify(projects), "utf8", cb);
  });
};

module.exports.saveProjectsList = (projects, cb) => {
  fs.writeFile(PROJECTS_DATA_FILE_PATH, JSON.stringify(projects), "utf8", cb);
};

