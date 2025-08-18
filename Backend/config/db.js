const mongoose = require("mongoose");

const connectionDb = async ()=>{
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/code");

        console.log("DB Connected");
    }
    catch(err){
        console.log(err);
    }
}

module.exports = connectionDb;