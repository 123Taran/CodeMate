const express = require("express");
const connectionDb = require("./config/db");
const userRoutes = require("./Routes/userRoute");
const sessionRoute = require("./Routes/SessionRoute");
const cookieParser = require("cookie-parser");


const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/user",userRoutes);
app.use("/api/session",sessionRoute);

app.get("/",function(req,res){
    res.send("Hello world!");
})

connectionDb().then(() => {
  app.listen(3000, () => {
    console.log("Server running on port: 3000 ");
  });
});