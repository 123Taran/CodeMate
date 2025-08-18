const userModel = require("../Models/userModel");

const loginUser = async function(req,res){
    const data = req.body;


    const createdUser = await  userModel.create({
    "name" : data.name,
    "email" : data.email,
    "password" : data.password
});

res.send(createdUser);

}

module.exports = loginUser;