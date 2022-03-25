import logo from "./logo.svg";
import "./App.css";
import { useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";
const socket = io("192.168.43.100:8000/");

function App() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [dr, setdr] = useState(false);

  const sendCoordinates = ({ x, y }) => {
    socket.emit("coordinates", {
      x: x,
      y: y,
    });
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    });

    socket.on("disconnect", () => {
      console.log(socket.id); // undefined
    });
  }, []);
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    const context = canvasRef.current.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 5;
    contextRef.current = context;
  }, []);
  return (
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
        sendCoordinates({
          x: event.nativeEvent.offsetX,
          y: event.nativeEvent.offsetY,
        });
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
        sendCoordinates({
          x: event.changedTouches[0].clientX,
          y: event.changedTouches[0].clientY,
        });
      }}
      onTouchEnd={() => {
        setdr(false);
        contextRef.current.closePath();
      }}
    />
  );
}

export default App;
