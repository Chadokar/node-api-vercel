require("dotenv").config();
const fetch = require("node-fetch");

const filterMessages = (data) => {
  if (!Array.isArray(data)) return [];
  const messages = data?.map((message) => ({
    messageId: message.id,
    conversationId: message.conversationId,
    senderId: message.sender,
    senderName: message.data.entities.sender.entity.name,
    receiverId: message.receiver,
    type: message.type,
    message: message?.data?.text,
  }));
  return [...messages];
};

const getMessages = async (req, res) => {
  const url =
    process.env.COMETCHAT_URL + "groups/" + req.params.groupId + "/messages";

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      apikey: process.env.API_KEY,
    },
  };
  let error = null;

  const unfilteredMessage = await fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      if (Array.isArray(json.data)) {
        console.log("messages: ", json);
        return json.data;
      } else {
        console.log("No messages: ", json);
      }
    })
    .catch((err) => {
      console.error("error:" + err);
      error = err;
    });
  const messages = [...filterMessages(unfilteredMessage)];
  if (error) {
    res.status(400).json({ error });
  } else res.status(200).json({ messages });
};

const sendMessage = async (user, data) => {
  const url = process.env.COMETCHAT_URL + "messages";
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      onBehalfOf: user.id,
      "content-type": "application/json",
      apikey: process.env.API_KEY,
    },
    body: JSON.stringify({
      category: "message",
      type: data?.type || "text",
      data: { text: data.message },
      receiver: data.groupId,
      receiverType: "group",
    }),
  };

  let error = null;
  const response = await fetch(url, options)
    .then(async (res) => await res.json())
    .then((json) => {
      console.log(json);
      return json.data;
    })
    .catch((err) => {
      console.error("error:" + err);
    });
  return {
    messageId: response.id,
    conversationId: response.conversationId,
    senderId: user.id,
    senderName: user.name,
    receiverId: response.receiver,
    type: response.type,
    message: response?.data?.text,
  };
};

module.exports = { sendMessage, getMessages };
