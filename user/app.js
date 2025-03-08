const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRoute = require("./routes/user-routes");
const connect = require("./db/db");
connect();

// Middlewares
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", userRoute);

module.exports = app;
