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

const { height, width } = robot.getScreenSize();

let event = "move";
let shouldClick = true;
let dragToggle = false;

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("event", (d) => {
    // console.log(d.key, d.coordinates.x, d.coordinates.y);
    event = d.key;
    switch (event) {
      case "move": {
        if (dragToggle) {
          robot.mouseToggle("up");
          dragToggle = false;
        }
        robot.moveMouse(d.coordinates.x, d.coordinates.y);
        shouldClick = true;

        break;
      }
      case "drag": {
        if (!dragToggle) {
          dragToggle = true;
          robot.mouseToggle("down");
        }
        robot.moveMouse(d.coordinates.x, d.coordinates.y);
        shouldClick = true;
        break;
      }
      case "click": {
        if (dragToggle) {
          robot.mouseToggle("up");
          dragToggle = false;
        }
        if (shouldClick) {
          robot.mouseClick();
          shouldClick = false;
        }
        break;
      }
      default: {
        robot.moveMouse(d.coordinates.x, d.coordinates.y);
        shouldClick = true;
        break;
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(8000, () => {
  console.log("listening on port:8000");
});
