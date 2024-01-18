"use strict";
const db = require("../db");
const { createTokens } = require("./user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function authenticate(req, res, next) {
  // console.log("header: ", req.headers);
  let token = req?.headers?.authorization?.split(" ")[1];

  console.log("auth: ", req?.headers?.authorization);

  // console.log("token: ", token);
  if (!token) return res.status(401).json({ error: "Invalid token" });
  console.log("token: ", token);
  token = token.substring(1, token.length - 1);
  console.log("token2: ", token);
  var today = new Date();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  console.log("time: ", time);

  if (!token) {
    console.log("No token found");
    res.json({ error: "No token found" });
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      console.log("decoded: ", decoded);
      req.user = await db("users").select().where({ id: decoded.id }).first();
      // console.log("user data: ", req.user);
      next();
    } catch (err) {
      console.log(err);
      res.status(401).json({
        message: err,
      });
    }
  }
}

async function login(req, res) {
  if (!req.body.email) res.status(400).json("email not provided");
  if (!req.body.password) res.status(400).json("password not provided");

  try {
    const user = await db("users")
      .select()
      .where({ email: req.body.email })
      .first();
    if (!user) {
      console.log("User not found");
      return res.status(400).json("User not found");
    }
    console.log("user: ", user);
    if (user.password !== req.body.password) {
      throw Error("Incorrect password");
    }
    const token = createTokens(user);
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}

async function logout(req, res) {
  jwt.sign({ id: user.id }, "chadokar", {
    expiresIn: "1s",
  });
}

module.exports = {
  login,
  authenticate,
  logout,
};
