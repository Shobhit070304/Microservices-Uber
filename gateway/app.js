const express = require("express");
const expressProxy = require("express-http-proxy");
const app = express();
require("dotenv").config();

app.use("/user", expressProxy("http://localhost:3001"));

app.listen(3000, (req, res) => {
  console.log("Gateway server running on port 3000");
});
