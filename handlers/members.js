const db = require("../db");
const {
  addMembersCommet,
  getMembersCommet,
  updateScopeCommet,
  deleteMemberCommet,
} = require("./cometMembers");

async function addMembers(req, res) {
  const groupId = req.params.groupId;
  const data = {
    moderators: req.body?.moderators || [],
    participants: req.body?.participants || [],
    groupName: req.body.groupName,
  };
  const response = await addMembersCommet(+groupId, data);
  console.log("members: ", data);
  const ids = data.moderators.length ? data.moderators : data.participants;
  console.log("ids: ", ids);
  for (let id of ids) {
    const member = await db("users").select().where({ id }).first();
    const ispresent = member.groups.some((grp) => grp.groupId === +groupId);
    let groups = [{ groupId: +groupId, groupName: data.groupName }];
    if (ispresent) {
      groups = [];
    }
    await db("users")
      .where({ id })
      .update({
        groups: [...member.groups, ...groups],
      });
  }
  res.status(200).json({ response });
}

async function getMembers(req, res) {
  const groupId = req.params.groupId;

  const data = getMembersCommet(groupId);
  return res.json({ data });
}

async function updateScope(req, res) {
  const groupId = req.params.groupId;
  const data = {
    memberId: req.body.memberId,
    scope: req.body.scope, //
  };

  const response = updateScopeCommet(groupId, data);
  return res.json({ response });
}

async function deleteMember(req, res) {
  const groupId = req.params.groupId;
  const memberId = req.params.memberId;
  console.log("groupId : ", groupId + 1);

  if (typeof groupId == "string") console.log("it is a string");
  else console.log("it is not a string");

  const member = await db("users").select().where({ id: memberId }).first();
  const groups = member?.groups.filter((group) => group.groupId !== +groupId);
  if (Array.isArray(groups))
    await db("users").where({ id: memberId }).update({ groups });

  const response = deleteMemberCommet(groupId, memberId);
  return res.json({ response });
}

module.exports = { addMembers, getMembers, updateScope, deleteMember };
