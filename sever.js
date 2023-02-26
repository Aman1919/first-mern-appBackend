const dotenv = require("dotenv");
const express = require("express");
const routes = require("./routes/routes");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
app.use(routes);
dotenv.config({ path: "./config.env" });

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.get("/");

app.listen(process.env.PORT, () => {
  console.log("listening at post 3000");
});
