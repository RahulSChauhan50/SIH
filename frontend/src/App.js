import logo from "./logo.svg";
import "./App.css";
import { useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  Box,
  AppBar,
  Toolbar,
  Paper,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import AutoFixNormalIcon from "@mui/icons-material/AutoFixNormal";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
const socket = io("192.168.43.100:8000/");

function App() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [dr, setdr] = useState(false);
  const [show, setShow] = useState(false);
  const [stroke, setStroke] = useState(false);
  const [strokeSize, setStrokeSize] = useState(5);
  const [color, setColor] = useState("black");

  // const sendCoordinates = ({ x, y }) => {
  //   socket.emit("coordinates", {
  //     x: x,
  //     y: y,
  //   });
  // };

  // useEffect(() => {
  //   socket.on("connect", (s) => {
  //     console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  //   });

  //   socket.on("disconnect", () => {
  //     console.log(socket.id); // undefined
  //   });
  // }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    const context = canvasRef.current.getContext("2d");
    context.lineCap = "round";

    context.lineWidth = strokeSize;
    contextRef.current = context;
  }, []);

  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    context.strokeStyle = color;
  }, [color]);

  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    context.lineWidth = strokeSize;
  }, [strokeSize]);

  const handlePencil = () => {
    setShow(!show);
  };

  const handleColor = (color) => {
    setColor(color);
  };

  const handleStroke = () => {
    setStroke(!stroke);
  };

  const handleStrokeSize = (size) => {
    setStrokeSize(size);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const context = canvasRef.current.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
  };
  return (
    <>
      <Box className="canvaBar">
        <Paper>
          <Toolbar>
            <Box className="canave-eraser">
              <IconButton>
                <AutoFixNormalIcon
                  className="eraserIcon"
                  onClick={() => handleColor("white")}
                />
                <ArrowDropDownIcon
                  className="dropIcon"
                  onClick={handleStroke}
                />
              </IconButton>
            </Box>
            <Box className="canva-pencil">
              <IconButton>
                <ModeEditOutlineIcon className="pencilIcon" />
                <ArrowDropDownIcon
                  className="dropIcon"
                  onClick={handlePencil}
                />
              </IconButton>
            </Box>
          </Toolbar>
          {stroke ? (
          <Paper className="eraserContainer" style = {{display : "grid", placeItems : "center"}}>
            <Button onClick={handleClear} style = {{textAlign : "center"}}> clear all</Button>
          </Paper>
        ) : (
          ""
        )}
          {show ? (
            <Paper className="colorContainer">
              <Box className="color_set set">
                <Box className="red " onClick={() => handleColor("red")}></Box>
                <Box className="blue" onClick={() => handleColor("blue")}></Box>
                <Box
                  className="green"
                  onClick={() => handleColor("green")}
                ></Box>
                <Box
                  className="black"
                  onClick={() => handleColor("black")}
                ></Box>
              </Box>
              <hr
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "gray",
                  border : "none",

                }}
              />
              <Box className="stroke_set set">
                <Box
                  className=" color color-1"
                  onClick={() => handleStrokeSize(2)}
                ></Box>
                <Box
                  className=" color color-2"
                  onClick={() => handleStrokeSize(4)}
                ></Box>
                <Box
                  className=" color color-3"
                  onClick={() => handleStrokeSize(6)}
                ></Box>
                <Box
                  className=" color color-4"
                  onClick={() => handleStrokeSize(8)}
                ></Box>
                <Box
                  className=" color color-4"
                  onClick={() => handleStrokeSize(10)}
                ></Box>
              </Box>
            </Paper>
          ) : (
            ""
          )}
        </Paper>
       
      </Box>

      <canvas
        ref={canvasRef}
        onMouseDown={(event) => {
          console.log(event);
          setdr(true);
          contextRef.current.beginPath();
          contextRef.current.moveTo(
            event.nativeEvent.offsetX,
            event.nativeEvent.offsetY
          );
        }}
        onMouseUp={(event) => {
          console.log(event);
          setdr(false);
          contextRef.current.closePath();
        }}
        onMouseMove={(event) => {
          if (!dr) {
            return;
          }
          console.log(event);
          contextRef.current.lineTo(
            event.nativeEvent.offsetX,
            event.nativeEvent.offsetY
          );
          contextRef.current.stroke();
          // sendCoordinates({
          //   x: event.nativeEvent.offsetX,
          //   y: event.nativeEvent.offsetY,
          // });
        }}
        onTouchStart={(event) => {
          console.log(event);
          setdr(true);
          contextRef.current.beginPath();
          contextRef.current.moveTo(
            event.changedTouches[0].clientX,
            event.changedTouches[0].clientY
          );
        }}
        onTouchMove={(event) => {
          if (!dr) {
            return;
          }
          console.log(event);
          contextRef.current.lineTo(
            event.changedTouches[0].clientX,
            event.changedTouches[0].clientY
          );
          contextRef.current.stroke();
          // sendCoordinates({
          //   x: event.changedTouches[0].clientX,
          //   y: event.changedTouches[0].clientY,
          // });
        }}
        onTouchEnd={() => {
          setdr(false);
          contextRef.current.closePath();
        }}
      />
    </>
  );
}

export default App;
