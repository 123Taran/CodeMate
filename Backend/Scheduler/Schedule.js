const cron = require("node-cron");
const userSessionModel = require("../Models/userSessioModel");

const task = async () => {
  const sessions = await userSessionModel.find();
  const CurrentTime = new Date();

  if (sessions.length > 0) {
    for(const e of sessions){
      if (e.endTime < CurrentTime) {
        await userSessionModel.findOneAndUpdate(
          { SessionId: e.SessionId },
          { status: "Expired" }
        );
      }
      else if (e.startTime <= CurrentTime && e.endTime > CurrentTime) {
        await userSessionModel.findOneAndUpdate(
          { SessionId: e.SessionId },
          { status: "Active" }
        );
      }

      if (e.status === "Expired") {
        await userSessionModel.findOneAndDelete({ SessionId: e.SessionId });
      }
    };

    console.log("job executed at :", new Date());
  }
};

cron.schedule("*/30 * * * *", task);
