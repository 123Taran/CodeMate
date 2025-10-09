const express = require("express");
const connectionDb = require("./config/db");
const userRoutes = require("./Routes/userRoute");
const sessionRoute = require("./Routes/SessionRoute");
const cookieParser = require("cookie-parser");
require("./Scheduler/Schedule");
const cors = require("cors");
const path = require("path");
const http = require("http");             
const { Server: SocketIO } = require("socket.io");
const socketHandler = require("./Scheduler/SocketHandler");


const app = express();
const server = http.createServer(app);    
const io = new SocketIO(server, {         
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.resolve("./public")));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/user", userRoutes);
app.use("/api/Session", sessionRoute);

app.get("/", function (req, res) {
  res.send("Hello world!");
});

io.on('connection', socket => {
    console.log(`user connected: ${socket.id}`);


    socket.on('disconnect', () => {
        console.log(`user disconnected: ${socket.id}`);
    });
});

socketHandler(io);


connectionDb().then(() => {
  server.listen(5000, () => {             
    console.log("Server running on port: 5000");
  });
});