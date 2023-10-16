require("dotenv").config();
const fetch = require("node-fetch");

const createCometGroup = async (group, admin) => {
  const url = process.env.COMETCHAT_URL + "groups";

  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      apikey: process.env.API_KEY,
    },
    body: JSON.stringify({
      guid: group.id,
      name: group.groupName,
      type: "public",
      tags: ["tag1"],
      owner: admin,
      members: {
        admins: [admin],
      },
    }),
  };

  await fetch(url, options)
    .then((res) => res.json())
    .then((json) => console.log("group commet : ", json))
    .catch((err) => console.error("error commet:" + err));
};

const commetGroupupdate = async (id, data) => {
  const url = process.env.COMETCHAT_URL + "groups/" + id;

  const options = {
    method: "PUT",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      apikey: process.env.API_KEY,
    },
    body: JSON.stringify({
      ...data,
    }),
  };
  fetch(url, options)
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((err) => console.error("error:" + err));
};

const commetGetGroup = async (id) => {
  const url = process.env.COMETCHAT_URL + "groups/" + id;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      apikey: process.env.API_KEY,
    },
  };
  var group = await fetch(url, options)
    .then(async (res) => await res.json())
    .then(async (json) => {
      // console.log("commet group: ", json);
      return json;
    })
    .catch((err) => console.error("error:" + err));

  return group?.data;
};

const deleteCommetGroup = (id) => {
  const url = process.env.COMETCHAT_URL + "groups/" + id;
  let status;
  const options = {
    method: "DELETE",
    headers: {
      accept: "application/json",
      apikey: process.env.API_KEY,
    },
  };
  fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      status = json;
    })
    .catch((err) => console.error("error:" + err));
  return status;
};

module.exports = {
  createCometGroup,
  commetGroupupdate,
  commetGetGroup,
  deleteCommetGroup,
};
