const express = require("express");
const createSession = require("../controller/sessionController");
const checkForLogin = require("../middleware/AuthMiddleware");

const router = express.Router();

router.use(checkForLogin);

router.post("/createSession",(req, res) => {
  if (!req.isTA) {
    return res.status(401).send("Only Teaching assistan can create Sessions");
  }

  createSession(req,res);
});

module.exports = router;