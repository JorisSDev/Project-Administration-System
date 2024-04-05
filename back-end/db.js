const fs = require("fs");

const USERS_DATA_FILE_PATH = "data/users.json";
const GROUPS_DATA_FILE_PATH = "data/groups.json";

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

module.exports.findUserByNickname = (nickname, cb) => {
  fs.readFile(USERS_DATA_FILE_PATH, "utf8", (err, data) => {
    if (err) {
      return cb(err);
    }
    const users = JSON.parse(data);
    cb(
      null,
      users.find((user) => user.nickname === nickname)
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

module.exports.findGroupByToken = (token, cb) => {
  fs.readFile(GROUPS_DATA_FILE_PATH, "utf8", (err, data) => {
    if (err) {
      return cb(err);
    }
    const groups = JSON.parse(data);
    cb(
      null,
      groups.find((group) => group.token === token)
    );
  });
};

module.exports.saveGroup = (groupDetails, cb) => {
  fs.readFile(GROUPS_DATA_FILE_PATH, "utf8", (err, data) => {
    if (err) {
      return cb(err);
    }
    const groups = JSON.parse(data);
    groups.push(groupDetails);
    fs.writeFile(GROUPS_DATA_FILE_PATH, JSON.stringify(groups), "utf8", cb);
  });
};

module.exports.updateGroup = (groupDetails, cb) => {
  fs.readFile(GROUPS_DATA_FILE_PATH, "utf8", (err, data) => {
    if (err) {
      return cb(err);
    }
    const groups = JSON.parse(data);
    const group = groups.find((group) => group.token === groupDetails.token);
    group.members = groupDetails.members;
    fs.writeFile(GROUPS_DATA_FILE_PATH, JSON.stringify(groups), "utf8", cb);
  });
};
