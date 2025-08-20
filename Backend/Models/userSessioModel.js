const mongoose = require("mongoose");

const SessionSchema = mongoose.Schema({
    "SessionId" : Number,
    "host" : String,
    "startTime" : {required : true, type : Date},
    "endTime" : {required : true, type : Date},
    "status" : {type : String, default : "Scheduled", enum : ["Scheduled","Active","Expired"]},
    "key" : Number,
    "participants" : {type : [{"name" : String,"joinedAt" : Date, "leftAt" : {type : Date, default : null}}], default : []}
})

module.exports = mongoose.model("session",SessionSchema);