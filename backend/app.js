var express = require("express");
var robot = require("robotjs");
var app = express();
app.use(express.json());
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("coordinates", (data) => {
    robot.moveMouse(data.x, data.y);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(8000, () => {
  console.log("listening on port:8000");
});
