const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://nicknickycr7_db_user:mongodb@namstenode.sujy550.mongodb.net/DevTinder",
  );
};

module.exports = { connectDb };
