import express from "express";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import http from "http";
import cors from "cors";

const app = express();

const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
app.use(cors());

io.on("connection", (socket) => {
  console.log("socket.id", socket.id);

  console.log("user connected");
});

app.use(morgan("dev"));
const PORT = 4000;
server.listen(PORT);
console.log("PORT", PORT);
