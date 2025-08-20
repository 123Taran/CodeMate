const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../Models/userModel");

require("dotenv").config();

const registerUser = async function (req, res) {
  const data = req.body;

  if (await userModel.findOne({ email: data.email })) {
    return res.status(400).send("Some Error Occurred");
  } else {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(data.password,salt, async function (err, hash) {
        await userModel.create({
          name: data.name,
          email: data.email,
          password: hash,
          role : data.role
        });

        return res.status(201).send("User Created Successfully");
      });
    });
  }
};

const loginUser = async function (req, res) {
  const data = req.body;

  const foundUser = await userModel.findOne({
    email: data.email
  });

  if (foundUser !== null) {
    if(await bcrypt.compare(data.password,foundUser.password)){
        const token = jwt.sign({email : data.email},process.env.JWT_SECRET_KEY);

        res.cookie("token",token);

        

        return res.status(201).send("Succesfully logged in");
    }
    else{
        return res.status(400).send("Error");
    }
  } else {
    return res.status(400).send("Error");
  }
};

const logoutUser = async (req,res) =>{

  const curr = jwt.verify(req.cookies.token,process.env.JWT_SECRET_KEY);

  const user = await userModel.findOne({email : curr.email});

  user.SessionStatus.curr_Session = "free";
  user.SessionStatus.S_id = 0;
  await user.save();

    res.cookie("token","");
    return res.status(201).send("Succesfull logged Out")
}

module.exports = {loginUser,registerUser};