const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    "name" : {type : String, required : true},
    "email" : {type : String, required : true, unique : true},
    "password" : {type : String, required : true},
    "role" : {type : String, required : true, enum : ["Teaching Assistant","Student"]},
    "SessionStatus" : {curr_Session : {type : String, enum : ["free","inSession"], default : "free"}, S_id : {type : Number, default : 0}}
})

module.exports = mongoose.model("user",userSchema);