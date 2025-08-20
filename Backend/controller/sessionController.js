const mongoose = require("mongoose");
const userSessionModel = require("../Models/userSessioModel");

const createSession = async (req, res) => {
  const sessionKey = Math.floor(100000 + Math.random() * 900000);

  const data = await userSessionModel.find({ host: req.user.name });

  const sessionId = data.length === 0 ? 1 : data.length + 1;

  const createdSession = await userSessionModel.create({
    SessionId: sessionId,
    host: req.user.name,
    duration: req.body.duration,
    key: sessionKey,
    participants: req.body.participants,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
  });

  res.send(createdSession);
};

module.exports = createSession;