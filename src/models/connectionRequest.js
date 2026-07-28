const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["interested", "ignored", "rejected", "accepted"],
        message: "{VALUE} is incorrect status type",
      },
    },
  },
  { timestamps: true },
);

connectionRequestSchema.pre("save", function (next) {
  if (this.toUserId.equals(this.fromUserId)) {
    throw new Error("Cannot send connect request to yourself!");
  }
  next();
});

const connectionRequestModel = mongoose.model(
  "connection Request",
  connectionRequestSchema,
);

module.exports = { connectionRequestModel };
