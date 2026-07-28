const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      validate(value) {
        if (value.length > 50) {
          throw new Error("character exceeded!");
        }
      },
    },
    lastName: {
      type: String,
      validate(data) {
        if (data.length > 50) {
          throw new Error("character exceeded!");
        }
      },
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(email) {
        if (validator.isEmail(email) === false) {
          throw new Error("Email is invalid : " + email);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(data) {
        if (data.length > 50 && data.length < 10) {
          throw new Error("character exceeded!");
        }
      },
    },
    age: {
      type: Number,
      validate(data) {
        if (data < 18) {
          throw new Error("Underage restriction!");
        }
      },
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Wrong gender passed!");
        }
      },
    },
    about: {
      type: String,
      default: "This by default about of a a user",
      validate(data) {
        if (data.length > 100) {
          throw new Error(
            "Out of character, keep it under the character Limit!",
          );
        }
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJwt = async function () {
  const token = await jwt.sign({ _id: this._id }, "dev@tinder", {
    expiresIn: "1w",
  });
  return token;
};

userSchema.methods.passwordCheck = async function (reqPassword) {
  const isPasswordMatches = await bcrypt.compare(reqPassword, this.password);
  return isPasswordMatches;
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
