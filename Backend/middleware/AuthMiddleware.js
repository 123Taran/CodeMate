const jwt = require("jsonwebtoken");
const userModel = require("../Models/userModel")
require("dotenv").config();


const checkForLogin = async function(req,res,next){

    const token = req.cookies.token;

    if(!token){
        return res.status(401).send("yep we errored in");
    }

    try{
    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);

    const user = await userModel.findOne({email : decoded.email});

    if(!user){
        return res.status(401).send("Some error occured");
    }

    req.user  =user;
    req.isTA = user.role === "Teaching Assistant";
    next();
    
}
catch(err){
    res.status(401).send("Some error Occured");
}
    

}

module.exports = checkForLogin;