const express = require("express");
const connectionDb = require("./config/db");
const userRoutes = require("./Routes/userRoute");
const sessionRoute = require("./Routes/SessionRoute");
const cookieParser = require("cookie-parser");
require("./Scheduler/Schedule");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/user", userRoutes);
app.use("/api/session", sessionRoute);

app.get("/", function (req, res) {
  res.send("Hello world!");
});

connectionDb().then(() => {
  app.listen(5000, () => {
    console.log("Server running on port: 5000 ");
  });
});
