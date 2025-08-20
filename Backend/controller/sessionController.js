const mongoose = require("mongoose");
const userSessionModel = require("../Models/userSessionModel");

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

const joinSession = async (req, res) => {
  if (req.user.SessionStatus.curr_Session === "inSession") {
    return res.status(401).send("A user can only join one session");
  }
  const foundedSession = await userSessionModel.findOne({
    key: req.body.key,
  });

  if (!foundedSession) {
    return res
      .status(401)
      .send("Wrong SessionId provied please check the details correctly");
  } else {
    const currentTime = new Date();

    if (foundedSession.status === "Expired") {
      return res.status(401).send("Session Expired");
    } else if (foundedSession.status === "Scheduled") {
      if (
        currentTime >= foundedSession.startTime &&
        currentTime <= foundedSession.endTime
      ) {
        foundedSession.status = "Active";
        foundedSession.participants.push({
          name: req.user.name,
          joinedAt: currentTime,
        });

        req.user.SessionStatus.curr_Session = "inSession";
        req.user.SessionStatus.S_id = req.body.key;
        await req.user.save();

        await foundedSession.save();

        return res.status(200).send("Succesfully joined");
      } else if (currentTime > foundedSession.endTime) {
        foundedSession.status = "Expired";
        await foundedSession.save();
        return res.status(401).send("Session Expired");
      } else if (currentTime < foundedSession.startTime) {
        return res.status(401).send("Wait for the Session to start");
      }
    } else if (foundedSession.status === "Active") {
      if (currentTime > foundedSession.endTime) {
        foundedSession.status = "Expired";
        await foundedSession.save();
        return res.status(401).send("Session Expired");
      } else {
        foundedSession.participants.push({
          name: req.user.name,
          joinedAt: currentTime,
        });

        req.user.SessionStatus.curr_Session = "inSession";
        req.user.SessionStatus.S_id = req.body.key;

        await req.user.save();
        await foundedSession.save();
        return res.status(200).send("Succesfully joined");
      }
    }
  }
};

const leaveSession = async (req, res) => {

  const foundedSession = await userSessionModel.findOne({
    key: req.user.SessionStatus.S_id,
  });

  req.user.SessionStatus.curr_Session = "free";
  req.user.SessionStatus.S_id = 0;
  await req.user.save();

  

  const user_In_Session = foundedSession.participants.find(
    (p) => p.name === req.user.name
  );


  user_In_Session.leftAt = new Date();

  await foundedSession.save();

  return res.status(200).send("Succesfully left the meeting");
};

module.exports = { createSession, joinSession, leaveSession };