const {
  signin,
  signup,
  activeAccaount,
  passChange
} = require("../controller/UserController");

const Express = require("express")


const Router = Express.Router()

Router.post("/signup", signup)
Router.post("/signin", signin);
Router.post("/active", activeAccaount);
Router.put("/forgeitPass", passChange);


module.exports = Router