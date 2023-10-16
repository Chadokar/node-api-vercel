"use strict";
const {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUsers,
} = require("./handlers/user");

const { login, authenticate, logout } = require("./handlers/controlflow");
const {
  createGroup,
  getGroups,
  getGroup,
  updateGroup,
  deleteGroup,
} = require("./handlers/group");
const {
  addMembers,
  getMembers,
  updateScope,
  deleteMember,
} = require("./handlers/members");
const { getMessages, sendMessage } = require("./handlers/cometMessages");

module.exports = function (app) {
  app.post("/signup", createUser);
  app.post("/login", login);

  app.get("/users", authenticate, getUsers);

  app.get("/user", authenticate, getUser);
  app.put("/user", authenticate, updateUser);
  app.post("/logout", authenticate, logout);
  app.delete("/user/:id", authenticate, deleteUser);

  //groups
  app.get("/groups", authenticate, getGroups);
  app.post("/group", authenticate, createGroup);
  app.put("/group/:id", authenticate, updateGroup);
  app.get("/group/:id", authenticate, getGroup);
  app.delete("/group/:id", authenticate, deleteGroup);

  //members
  app.post("/member/:groupId", authenticate, addMembers);
  app.get("/member/:groupId", authenticate, getMembers);
  app.put("/member/:groupId", authenticate, updateScope);
  app.delete("/member/:groupId", authenticate, deleteMember);

  // messages
  app.get("/messages/:groupId", authenticate, getMessages);
  app.post("/messages", authenticate, sendMessage);
};
