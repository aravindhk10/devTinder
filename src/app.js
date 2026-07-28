const express = require("express");
const app = express();
const { connectDb } = require("./config/database");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());

const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { requestRouter } = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDb()
  .then((data) => {
    // console.log(data);
    app.listen(3000, () => {
      console.log("Server successfuly started");
    });
    console.log("DB connect successfully!");
  })
  .catch((err) => {
    console.log(err);
  });
