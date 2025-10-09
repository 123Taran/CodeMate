const mongoose = require("mongoose");

const connectionDb = async ()=>{
    try{
await mongoose.connect("mongodb+srv://projectPassword123:projectPassword123@cluster0.csakc.mongodb.net/");

        console.log("DB Connected");
    }
    catch(err){
        console.log(err);
    }
}

module.exports = connectionDb;