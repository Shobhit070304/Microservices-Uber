require("dotenv").config();
const express = require("express");
const app = express();
const connect = require("./db/db");
connect();
const cors = require("cors");
const captainRoutes = require("./routes/captain-routes");
const cookieParser = require("cookie-parser");
const rabbitMq = require("./service/rabbit");

rabbitMq.connect();
// Middlewares
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", captainRoutes);

module.exports = app;
