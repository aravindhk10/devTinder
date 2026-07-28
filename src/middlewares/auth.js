const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

// const adminAuth = (req, res, next) => {
//   const tokken = "xyz";
//   const authTokken = tokken === "xyz";
//   if (!authTokken) {
//     res.status(401).send("admin authentication failed!");
//   } else {
//     console.log("admin authentication successful!");
//     next();
//   }
// };

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token not found!");
    }
    const decodedTokenMessage = await jwt.verify(token, "dev@tinder");
    const { _id } = decodedTokenMessage;
    const findUser = await User.findById(_id);
    req.user = findUser;
    if (!findUser) {
      throw new Error("Invalid user!");
    }
  } catch (error) {
    res.send("Error : " + error.message);
  }
  next();
};

module.exports = { userAuth };
