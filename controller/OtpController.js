const OtpSchema = require('../models/OtpSchema')
const UserSchema = require('../models/UserSchema')
const NodeMailer = require('../config/NodeMailer')
const bcrypt = require("bcrypt");


const SendingCodeOnEmail = async (req, res) => {
  let {email} = req.body
 
  if (!email) {
    return res.status(203).json({message : "Please Fill Email Field"})
  }
    const User = await UserSchema.findOne({ email: email })
    if (!User) {
      return  res.status(203).json({ "message": "Invalid Email Address" })
    } 

    if(User){
        //Genarate OTP
        function randomIntFromInterval(min, max) {
          return Math.floor(Math.random() * (max - min + 1) + min);
        }
        const generateOTP = randomIntFromInterval(1000, 9999);

        let OTP = new OtpSchema({
          email: email,
            code: generateOTP,
          expireIn : new Date().getTime() + 300*1000
        })

         await OTP.save()
          NodeMailer(email,OTP.code);
       return res.status(200).json({ "message": "Please Check Your Email Inbox"})
    }

    
}






const otpVarify = async (req, res) => {
  const { email, code } = req.body

  if (!email && !code) {
    return res.status(203).json({ message: "Please Fill all  Field" });
  }
  
  const data = await OtpSchema.findOne({ email: email, code : code })
  
  if (data) {
    const currentTime = new Date().getTime();
    const differance = data.expireIn - currentTime
    if (differance < 0) {
      return res.status(203).json({
        message: "Token Expire"
      })
    } else {
      
      return res.status(200).json({
        message : "Varifyed"
      })
    }
  }
  else {
    return res.status(203).json({
      message : "Invalid OTP"
    })
  }
}



module.exports = { SendingCodeOnEmail, otpVarify };