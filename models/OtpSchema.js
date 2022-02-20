const mongoose = require("mongoose");

const OtpSchema = mongoose.Schema({
    email: String,
    code: String,
    expireIn : Number
}, {
    timestamps : true
}
)

module.exports = mongoose.model("Otp",OtpSchema)