const fetch = require("node-fetch");

require("dotenv").config();

const addMembersCommet = async (groupId, data) => {
  const url = process.env.COMETCHAT_URL + "groups/" + groupId + "/members";
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      apikey: process.env.API_KEY,
    },
    body: JSON.stringify({
      participants: data.participants,
    }),
  };
  let response = await fetch(url, options)
    .then(async (res) => await res.json())
    .then((json) => {
      console.log("add member : ", json);
      return json;
    })
    .catch((err) => console.error("error:" + err));
  console.log("member added : ", response);
  return response;
};

const getMembersCommet = (groupId) => {
  const url = process.env.COMETCHAT_URL + "groups/" + groupId + "/members";

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      apikey: process.env.API_KEY,
    },
  };

  let data;

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      data = json;
      console.log(json);
    })
    .catch((err) => console.error("error:" + err));
  return data;
};

const updateScopeCommet = (groupId, data) => {
  const url =
    process.env.COMETCHAT_URL +
    "groups/" +
    groupId +
    "/members/" +
    data.memberId;
  const options = {
    method: "PUT",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      apikey: process.env.API_KEY,
    },
    body: JSON.stringify({ scope: data.scope }),
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((err) => console.error("error:" + err));
};

const deleteMemberCommet = (groupId, memberId) => {
  const url =
    process.env.COMETCHAT_URL + "groups/" + groupId + "/members/" + memberId;

  const options = {
    method: "DELETE",
    headers: {
      accept: "application/json",
      apikey: process.env.API_KEY,
    },
  };
  let response;
  fetch(url, options)
    .then(async (res) => await res.json())
    .then((json) => {
      console.log(json);
      response = json;
    })
    .catch((err) => console.error("error:" + err));
  return response;
};

module.exports = {
  addMembersCommet,
  getMembersCommet,
  updateScopeCommet,
  deleteMemberCommet,
};
