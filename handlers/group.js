"use strict";
const db = require("../db");
const {
  createCometGroup,
  commetGetGroup,
  deleteCommetGroup,
} = require("./cometgroup");

async function createGroup(req, res) {
  // console.log("data : ", req.body);
  // console.log("user: ", req.user);
  if (!req.body.groupName) throw Error("Group name is required");
  try {
    const groupdata = {
      groupName: req.body.groupName,
      adminEmail: req.user.email,
    };
    await db("groups").insert(groupdata);

    const group = await db("groups")
      .select()
      .where({ adminEmail: req.user.email });

    await createCometGroup(group.slice(-1)[0], req.user.id.toString());
    // console.log("groups: ", req.user.groups);
    await db("users")
      .where({ id: req.user.id })
      .update({
        groups: [
          ...req.user.groups,
          {
            groupId: group.slice(-1)[0].id,
            groupName: group.slice(-1)[0].groupName,
          },
        ],
      });
    // console.log("data: ", comdata);
    res.status(201).json({ group: group.slice(-1)[0] });
  } catch (err) {
    res.status(400).json({ error: err });
  }
}

async function updateGroup(req, res) {
  if (!req.params.id) throw Error("please send id");
  if (!req.body.groupName) throw Error("please send group name");

  try {
    const data = {
      groupName: req.body.groupName,
      description: req.body.description,
    };
    const group = await db("groups")
      .where({ id: res.params.id })
      .update({ groupName: req.body.groupName })
      .first();

    commetupdate(req.params.id, data);

    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: err });
  }
}

async function getGroups(req, res) {
  res.status(201).json({ groups: req.user.groups });
}

async function getGroup(req, res) {
  const group = await commetGetGroup(req.params.id);
  res.status(200).json(group);
}

async function deleteGroup(req, res) {
  const status = deleteCommetGroup(req.params.id);
  await db("groups").where({ id: req.params.id }).del();
  res.json({ status: status?.data || status?.error });
}

module.exports = {
  createGroup,
  getGroups,
  updateGroup,
  getGroup,
  deleteGroup,
};
