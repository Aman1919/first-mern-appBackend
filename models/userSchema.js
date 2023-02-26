const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE;
mongoose.set("strictQuery", false);
mongoose
  .connect(DB)
  .then(console.log("connected With Mongodb"))
  .catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  posts: [
    {
      post: String,
      date: String,
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
