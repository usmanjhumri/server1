import { User } from "./model/users.js";
import { connect } from "mongoose";
import express, { json, urlencoded } from "express";
const app = express();
import cors from "cors";
import { join, resolve } from "path";

app.use(cors());
app.use(json({ limit: "200mb" }));
// app.use(express.static("./build"));

app.use(express.static(join(resolve(), "server/dist")));
// app.use(express.static("./dist"));
app.use(urlencoded({ limit: "200md", extended: true }));

// Model Import for chat and blogs post etc

//--------------.ENV CONFIG------------------//
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://usmanlatif762:myproject@cluster0.sqmj7dr.mongodb.net/?retryWrites=true&w=majority";

//------------DB CONNECTION---------------//

connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("DB connected");
  })
  .catch((error) => {
    console.log("DB not connected", error);
  });

// useNewUrlParser option enables the use of the new URL parser, //
// useUnifiedTopology enables the use of the new Server Discovery and Monitoring engine, //

//--------- NOW MAKING API ROUTES-----------------------//

//-----------Routes-----------------//

//--------------------SIGN UP ROUTE--------------------//
app.post("/singup", async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    phonenumber,
    address,
    password,
    confirmpassword,
  } = req.body;
  try {
    const user = await User.findOne({ email });
    console.log(user, " user");
    if (user) {
      res.send({ success: false, message: "This email is already exist" });
    } else {
      const newUser = new User({
        firstname,
        lastname,
        email,
        phonenumber,
        address,
        password,
        confirmpassword,
      });
      await newUser.save();
      res.send({ success: true, message: "User Registered" });
    }
  } catch (error) {
    console.log(error);
    res.send({ success: false, message: error.message });
  }
});

//----------LOGIN ROUTE----------//
app.post("/login", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    console.log(user);
    if (user && user.password === req.body.password) {
      res.send({ success: true, message: `Welcome ${user.firstname}`, user });
    } else {
      res.send({ success: false, message: "User not found", user });
    }
  } catch (error) {
    console.log(error);
    res.send({ success: false, message: error.message });
  }
});

//-----------------RESET ROUTE--------------//
app.post("/reset", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password, " email and password");
  try {
    const user = await User.find({ email: email });
    if (user) {
      await updateOne(
        { email: email },
        { password: password },
        { confirmpassword: confirmpassword }
      );
      console.log(password, confirmpassword);
      res.send({ success: true, message: "password successfully reset" });
    } else {
      res.send({ success: false, message: "email is not registered" });
    }
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});
const PORT = process.env.PORT || 8000;

// app.get("/*", function (req, res) {
//   res.sendFile(path.join(__dirname, "./dist/index.html"), function (err) {
//     if (err) {
//       console.log(err);
//       res.status(500).send(err);
//     }
//   });
// });

app.get("/", (req, res) => {
  res.status(200).sendFile(join(resolve(), "server/dist/index.html"));
});
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
