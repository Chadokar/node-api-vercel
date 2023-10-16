"use strict";
const db = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const {
  createCometuser,
  commetupdate,
  deleteCommetUser,
} = require("./cometUser");

const createTokens = (user) => {
  const accessToken = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
    expiresIn: "39d",
  });

  return accessToken;
};

async function createUser(req, res) {
  if (!req.body.name) throw Error("name is required");
  if (!req.body.email) throw Error("email is required");
  if (!req.body.password) throw Error("password is required");

  try {
    const userdata = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      groups: [{}],
    };
    await db("users").insert(userdata);
    const user = await db("users")
      .select()
      .where({ email: req.body.email })
      .first();
    console.log("user : ", user);
    const token = createTokens(user);
    createCometuser(user);
    // console.log("data: ", comdata);
    res.status(201).json({ token });
  } catch (err) {
    res.status(402).json({ error: err });
  }
}

async function getUser(req, res) {
  // if (!req.user) return res.json({ error: "please login" });
  res.status(200).json(req.user);
}

async function getUsers(req, res) {
  const user = await db("users").select();
  res.status(201).json(user);
}

async function updateUser(req, res) {
  if (!req.user) return res.json({ error: "please login" });
  if (req.body.email) return res.json({ error: "cannot change email" });

  const data = {
    name: req.body.name,
    password: req.body.password,
  };
  const user = await db("users").where({ id: res.user.id }).update(data);
  commetupdate(req.user.id, req.body.name);

  return res.json(user);
}

async function deleteUser(req, res) {
  deleteCommetUser(req.params.id);
  await db("users").where({ id: req.params.id }).del();
}

module.exports = {
  createUser,
  getUser,
  getUsers,
  updateUser,
  createTokens,
  deleteUser,
};
