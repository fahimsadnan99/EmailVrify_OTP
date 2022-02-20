const { SendingCodeOnEmail,otpVarify} = require("../controller/OtpController");

const Express = require("express");

const Router = Express.Router();

Router.post("/email-code", SendingCodeOnEmail);
Router.post("/otp-varify", otpVarify);

module.exports = Router;
