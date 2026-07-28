const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { connectionRequestModel } = require("../models/connectionRequest.js");
const { User } = require("../models/user.js");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const allowedStatuses = ["ignored", "interested"];
      const toUser = await User.findById(toUserId);
      // if (toUserId == fromUserId) {
      //   return res
      //     .status(400)
      //     .json({ message: "Cannot send request to the same user" });
      // }   //isntead of this we are using pre in schema

      if (!toUser) {
        return res.status(400).json({ message: "Profile doesn't exist" });
      }
      if (!allowedStatuses.includes(status)) {
        return res
          .status(400)
          .json({ message: status + " Status not present " });
      }
      const existingUserData = await connectionRequestModel.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId: toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingUserData) {
        return res
          .status(400)
          .json({ message: "connection request already exists!" });
      }
      const userData = new connectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });
      const data = await userData.save();
      return res
        .status(200)
        .json({ messsage: "Connection request sent!", data: data });
    } catch (error) {
      res.send(error.message);
    }
  },
);
module.exports = { requestRouter };
