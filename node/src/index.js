import express from "express";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import http from "http";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const PORT = 4000;
const io = new SocketServer(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
app.use(cors());
app.use(morgan("dev"));

io.on("connection", (socket) => {
  console.log("socket.id", socket.id);

  socket.on('messageFront', (message)=>{
    console.log(message)
    socket.broadcast.emit('responseBack', {
      body:message,
      author: socket.id
    })
  })
});

server.listen(PORT);
console.log("PORT", PORT);
