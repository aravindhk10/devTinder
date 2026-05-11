const adminAuth = (req, res, next) => {
  const tokken = "xyz";
  const authTokken = tokken === "xyz";
  if (!authTokken) {
    res.status(401).send("admin authentication failed!");
  } else {
    console.log("admin authentication successful!");
    next();
  }
};

const userAuth = (req, res, next) => {
  const tokken = "xyz";
  const authTokken = tokken === "xyz";
  if (!authTokken) {
    res.status(401).send("User authentication failed!");
  } else {
    console.log("user authentication successful!");
    next();
  }
};

module.exports = { adminAuth, userAuth };
