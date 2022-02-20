const UserSchema = require("../models/UserSchema");
const OtpSchema = require("../models/OtpSchema");
const NodeMailer = require("../config/NodeMailer");
const bcrypt = require("bcrypt");
const _ = require("lodash");

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(203).json({ message: "Fill all Fields" });

  let User = await UserSchema.findOne({ email: email });

  if (User?.active) {
    return res.status(203).json({ message: "User Already Exist" });
  } else {
    User = new UserSchema(_.pick(req.body, ["name", "email", "password"]));
    const Token = await User.generateJWT();

    User.password = await bcrypt.hash(password, 10);

    await User.save();

    function randomIntFromInterval(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
    const generateOTP = randomIntFromInterval(1000, 9999);
    let OTP = new OtpSchema({
      email: User.email,
      code: generateOTP,
      expireIn: new Date().getTime() + 300 * 1000,
    });

    await OTP.save();
    NodeMailer(OTP.email, OTP.code);

    return res.status(201).json({
      message: "Check Your Email",
      Token: Token,
      User: _.pick(User, ["name", "email"]),
    });
  }
};

const signin = async (req, res) => {
  const AuthUser = await UserSchema.findOne({
    email: req.body.email,
    active: true
  });
  if (!AuthUser) return res.status(203).json({ message: "User Not Exist" });

  const PassComp = await bcrypt.compare(req.body.password, AuthUser.password);
  if (!PassComp)
    return res.status(203).json({ message: "Email OR Password Wrong.." });
  const Token = await AuthUser.generateJWT();
  res.status(200).send({
    message: "Login Successfully",
    Token: Token,
    User: _.pick(AuthUser, ["_id", "name", "email", "role"]),
  });
};

const activeAccaount = async (req, res) => {
  const { email} = req.body;
  if (!email) {
    return res.status(203).json({ message: "Please Put Your Email" });
  }


 
      let user = await UserSchema.findOneAndUpdate(
        { email: req.body.email },
        { active: true }
      );
      return res.status(200).json({
        message: "Email Is Varified",
      });
    
 
};



const passChange = async (req, res) => {
  const {password,email} = req.body
  const hashPass =  await bcrypt.hash(password, 10);
  try {
const passUpdate = await UserSchema.findOneAndUpdate(
  { email: email },
  { password: hashPass },
  {
    new: true,
  }
);
    return res.status(201).json({
      message : "Password Change Successfully"
    })
  } catch (err) {
    return res.status(500).json({
      message : err.message
    })
  }
  
  
 
}




module.exports = { signin, signup, activeAccaount, passChange };
