const dotenv = require("dotenv").config();
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const UserRouter = require("./routes/UserRoute")
const Otp = require("./routes/OtpRouter");



const app = express()

app.use(express.json())
app.use(morgan("dev"))
app.use(cors())
app.use("/api/user", UserRouter)
app.use("/api", Otp);

module.exports = app