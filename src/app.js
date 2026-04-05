const express = require("express");
const app = express();

// app.use('/',(req, res) => {
//   res.send("Hi welcome from this new server");
// });

app.use("/hello", (req, res) => {
  res.send("/ response send");
});

app.use("/secret", (req, res) => {
  res.send("no secret found here, good luck!");
});

app.listen(8999, () => {
  console.log("Server successfuly started");
});
