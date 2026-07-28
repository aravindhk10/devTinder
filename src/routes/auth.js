const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const { validate } = require("../utils/validate");
const { userAuth } = require("../middlewares/auth");

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;
    validate(req.body);
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(hashedPassword);
    const user_data = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });
    await user_data.save();
    res.send("user data successsfullly saved to DB");
  } catch (error) {
    // console.log(error);
    res.status(400).send(error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  if (!emailId || !password) {
    return res.status(400).send("Email and password are required");
  }

  try {
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(400).send("Invalid credentials");
    }
    const passwordMatches = await user.passwordCheck(password);
    const token = await user.getJwt();
    if (passwordMatches) {
      //jwt token
      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
    } else {
      return res.status(400).send("Invalid credentials");
    }
    return res.status(200).send("Login successful!");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Successsful");
});

module.exports = { authRouter };
