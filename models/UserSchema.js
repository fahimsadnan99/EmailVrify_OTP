const mongoose = require("mongoose");
const JWT = require("jsonwebtoken");
const validator = require("validator");

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [3, "Minimum 3 letter Requred"],
      maxlength: [50, "Maximum 50 Letter suported"],
    },
    email: {
      type: String,
      minlength: [8, "Minimum 8 letter Requred"],
      maxlength: [250, "Maximum 250 Letter suported"],
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email Address");
        }
      },
    },
    password: {
      type: String,
      minlength: 8,
      maxlength: 1024,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

UserSchema.methods.generateJWT = function () {
  const token = JWT.sign(
    { _id: this._id, name: this.name, email: this.email, role: this.role },
    process.env.KEY,
    { expiresIn: "27d" }
  );
  return token;
};

module.exports = mongoose.model("User", UserSchema);
