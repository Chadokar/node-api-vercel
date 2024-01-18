const fetch = require("node-fetch");
const axios = require("axios");
require("dotenv").config();
const createCometuser = async (user) => {
  const url = process.env.COMETCHAT_URL + "users";
  // console.log("user commet : ", user);
  console.log(url);
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      apikey: process.env.API_KEY,
    },
    body: JSON.stringify({
      metadata: {
        "@private": { email: user.email, contactNumber: "0123456789" },
      },
      uid: user.id,
      name: user.name,
    }),
  };

  fetch(url, options)
    .then(async (res) => await res.json())
    .then(async (json) => console.log("commet user : ", json))
    .catch((err) => console.error("error:" + err));
  //   return null;
};

const commetupdate = async (id, name) => {
  const url = process.env.COMETCHAT_URL + "users/" + id;

  const options = {
    method: "PUT",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      apikey: process.env.API_KEY,
    },
    body: JSON.stringify({
      name: name,
    }),
  };
  fetch(url, options)
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((err) => console.error("error:" + err));
};

const deleteCommetUser = (id) => {
  const url = process.env.COMETCHAT_URL + "users/" + id;
  const options = {
    method: "DELETE",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      apikey: process.env.API_KEY,
    },
    body: JSON.stringify({ permanent: "false" }),
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((err) => console.error("error:" + err));
};

module.exports = { createCometuser, commetupdate, deleteCommetUser };
