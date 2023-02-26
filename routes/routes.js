const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const { json } = require("express");
const saltRound = 10;

router.post("/addpost", async (req, res) => {
  const date = new Date();
  const d =
    date.toLocaleDateString() +
    "  " +
    date.getHours() +
    ":" +
    date.getMinutes();
  const { token, post } = req.body;
  const decoded = jwt.verify(token, "amansingh");
  const email = decoded.email;
  const user = await User.findOne({ email: email });
  const p = {
    post: post,
    date: d,
  };
  user.posts.push(p);
  user.save();
  console.log(user);
  res.json({ status: "ok", posts: req.body, date: d });
});
router.get("/post", async (req, res) => {
  const data = await User.aggregate([{ $sample: { size: 10 } }]);
  console.log(data);
  res.json({ status: "ok", users: data });
});

router.post("/deletepost", async (req, res) => {
  const { token, index } = req.body;
  const decoded = jwt.verify(token, "amansingh");
  const email = decoded.email;
  const user = await User.findOne({ email: email });
  user.posts.splice(index, index);
  user.save();
  console.log(user);
  res.json({ status: "ok", user: user });
});

router.get("/userdetails", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, "amansingh");
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    if (user) {
      console.log(user);
      return res.json({ status: "ok", user: user });
    } else {
      return res.json({ status: 404 });
    }
  } catch (err) {
    res.json({ status: "error", error: "invalid Token" });
  }
});

router.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Enter all  the details" });
    }

    let foundUser = await User.findOne({ email: email });
    if (foundUser) {
      const isMatch = bcrypt.compare(password, foundUser.password);
      if (!isMatch) {
        return res.status(999).json({ message: "Invalid Cridentials" });
      } else {
        let token = jwt.sign(
          { email: foundUser.email, name: foundUser.name },
          "amansingh"
        );
        console.log("log in succesfully");
        return res.json({ status: "ok", user: token });
      }
    } else {
      return res.status(999).json({ message: "Invalid Cridentials" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/signup", (req, res) => {
  console.log(req.body);
  let { name, email, password } = req.body;
  User.findOne({ email: email }).then((u) => {
    if (u) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      bcrypt.hash(password, saltRound, (e, hash) => {
        const user = new User({
          name: name,
          email: email,
          password: hash,
        });
        user
          .save()
          .then(console.log("Saved a user"))
          .catch((err) => console.log(err));
      });
    }
  });
});

module.exports = router;
