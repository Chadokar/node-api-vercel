"use strict";
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");
const db = require("./db");
const { sendMessage } = require("./handlers/cometMessages");

// Common middleware
// app.use(/* ... */)
app.use(express.json());
app.use(cors());

// view engine
app.set("view engine", "ejs");

const port = process.env.PORT || 8000;

require("./routes")(app);

const server = app.listen(port, () => console.log("connected to port " + port));

const io = require("socket.io")(server, {
  allowEIO3: true,
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use(async (socket, next) => {
  try {
    var today = new Date();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let token = socket?.handshake?.query?.token.split(" ")[1];
    token = token.substring(1, token.length - 1);
    const payload = jwt.verify(token, process.env.JWT_KEY);
    socket.userId = payload.id;
    next();
  } catch (err) {
    console.log("error: ", err);
  }
});

io.on("connection", (socket) => {
  console.log("Connected: " + socket.userId);

  socket.on("disconnect", () => {
    console.log("Disconnected: " + socket.userId);
  });

  socket.on("joinRoom", ({ groupId }) => {
    socket.join(groupId);
    console.log("A user joined chatroom: " + groupId);
  });

  socket.on("leaveRoom", ({ groupId }) => {
    socket.leave(groupId);
    console.log("A user left chatroom: " + groupId);
  });

  socket.on("chatroomMessage", async ({ groupId, message }) => {
    if (message.trim().length > 0) {
      const user = await db("users")
        .select()
        .where({ id: socket.userId })
        .first();

      const msg = await sendMessage(user, { message, groupId });
      io.to(groupId).emit("newMessage", msg);
    }
  });
});
