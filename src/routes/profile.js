const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const {
  validateEditFields,
  validatePasswordChange,
} = require("../utils/validate");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    console.log("Error: " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    if (!validateEditFields(req.body)) {
      throw new Error("Edit fields not valid");
    } else {
      const newFields = req.body;
      const newEmail = newFields.emailId;
      const emailDetails = await User.findOne({
        emailId: newEmail,
        _id: { $ne: loggedInUser._id },
      });
      if (emailDetails) {
        throw new Error("Email address already exists!");
      } else {
        Object.keys(req.body).forEach(
          (field) => (loggedInUser[field] = newFields[field]),
        );
        await loggedInUser.save();
        res.json({
          message:
            loggedInUser.firstName + ", your fields are successfully edited!",
          data: loggedInUser,
        });
      }
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

profileRouter.patch("/profile/changePassword", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const newPassword = req.body.password;
    const isPasswordValid = validatePasswordChange(req.body, loggedInUser);
    if (!isPasswordValid) {
      throw new Error("Enter valid password!");
    } else {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      loggedInUser.password = hashedPassword;
      await loggedInUser.save();
      res.json({
        message:
          loggedInUser.firstName + " your password is successfully changed",
        data: loggedInUser,
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = { profileRouter };
