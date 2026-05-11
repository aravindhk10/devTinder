const express = require("express");
const app = express();
const { adminAuth, userAuth } = require("./middlewares/auth");
const { connectDb } = require("./config/database");
const { User } = require("./models/user");
app.use(express.json());
// app.get("/user", (req, res) => {
//   res.send({
//     name: "Unnikuttan",
//     age: 24,
//     Place: "Kollam",
//   });
// });

// app.post("/user", (req, res) => {
//   res.send("data given successfully!");
// });

// app.delete("/user", (req, res) => {
//   res.send("data deleted successfully!");
// });

// app.patch("/user", (req, res) => {
//   res.send("data edited successfully!");
// });

// app.put("/user", (req, res) => {
//   res.send("data edited!");
// });

// app.get("/user/:userId/:name/:age", (req, res) => {
//   console.log(req.params);
//   res.send("get queried and data retrieved");
// });

// app.use(
//   "/user",
//   (req, res, next) => {
//     res.send("user found! 1st");
//     next();
//     console.log("first route handler");
//   },
//   (req, res, next) => {
//     res.send("2nd handler error");
//     console.log("2nd");
//     next();
//   },
//   (req, res, next) => {
//     console.log("third");
//   },
// );

// app.use("/", (req, res, next) => {
//   res.send("handled using use");
// });
// app.get(
//   "/user",
//   (req, res, next) => {
//     console.log("first console logged");
//     next();
//   },
//   (req, res, next) => {
//     res.send("second");
//     next();
//   },
// );

// middleware
// app.use("/admin", adminAuth, (req, res, next) => {
//   res.send("admin normal route!");
// });

// app.get("/admin/getUserData", adminAuth, (req, res, next) => {
//   res.send("User data successfully send!");
// });

// app.get("/admin/deleteUserData", adminAuth, (req, res, next) => {
//   res.send("user data deleted!");
// });

// app.get('/user', userAuth,(req, res, next)=>{
//   res.send("user route called");
// });

// app.get("/user/data", userAuth,(req, res, next)=>{
//   res.send("user data send!");
// });

// app.get("/user/login",(req, res)=>{
//   res.send("login successful!")
// })

// app.get("/errorHandling", (req, res) => {
//   // try {

//   // }
//   throw new Error("newError");
//   res.send("error handling called!");
//   //  catch (error) {
//   // //   // console.log(error);

//   //   res.status(500).send("something happpened!");
//   // }
// });
// app.use("/", (err, req, res, next) => {
//   if (err) {
//     res.status(501).send("Something went wrong");
//   }
// });

app.post("/signup", async (req, res) => {
  console.log(req.body);

  const user_data = new User(req.body);

  try {
    await user_data.save();
    res.send("user data successsfullly saved to DB");
  } catch (error) {
    console.log(error);
    res.status(400).send("User data not saved successfully to DB");
  }
});

app.get("/feed", async (req, res) => {
  // console.log(req.body);
  const userEmail = req.body.emailId;
  try {
    const results = await User.find({ emailId: userEmail });
    if (results.length == 0) {
      res.status(404).send("Something went wrong!");
    } else {
      console.log(results);
      res.status(200).send("Users found");
    }
  } catch (error) {
    res.status(404).send("Something went wrong!");
  }
});

app.get("/feedall", async (req, res) => {
  // // console.log(req.body);
  // const userEmail = req.body.emailId;
  try {
    const results = await User.find();
    if (results.length == 0) {
      res.status(404).send("No users found!");
    } else {
      console.log(results);
      res.status(200).send("Users found");
    }
  } catch (error) {
    res.status(404).send("Something went wrong!");
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const result = await User.findOne({ emailId: userEmail });
    if (result.length == 0) {
      res.send("no user found!").status(404);
    } else {
      console.log(result);
      res.send("A user found!").status(200);
    }
  } catch (error) {
    console.log("Something went wrong!");
  }
});

app.get("/userbyid", async (req, res) => {
  const userId = req.body._id;
  try {
    const result = await User.findById(userId);
    if (result.length == 0) {
      res.status(404).send("no user found!");
    } else {
      console.log(result);
      res.status(200).send("User found through ID!");
    }
  } catch (error) {
    res.status(400).send("something is wrong!");
  }
});

app.delete("/deleteUser", async (req, res) => {
  const id = req.body.userId;
  try {
    const data = await User.findByIdAndDelete(id);
    if (data === null) {
      console.log(data);
      res.send("No user exists!").status(404);
    } else {
      console.log(data);
      res.status(200).send("User deleted!");
    }
  } catch (error) {
    console.log(error);
  }
});

app.patch("/updateusingemail", async (req, res) => {
  const email = req.body.emailId;
  const body = req.body;
  try {
    const data = await User.findOneAndUpdate({ emailId: email }, body);
    if (data != null) {
      res.send("data updated!");
    }
  } catch (error) {
    res.send("something went wrong!");
  }
});

app.patch("/updateusingid", async (req, res) => {
  const userid = req.body._id;
  const body = req.body;
  try {
    const data = await User.findByIdAndUpdate({ _id: userid }, body, {
      new: false,
    });
    if (data != null) {
      console.log(data);
      res.send("data updated!");
    } else {
      res.status(400).send("no data was updated!");
    }
  } catch (error) {
    console.log(error);

    res.send("something went wrong!");
  }
});

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
