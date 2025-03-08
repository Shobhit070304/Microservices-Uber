const mongoose = require("mongoose");

function connect() {
  mongoose
    .connect("mongodb://localhost:27017/uber_microservices-user", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB");
    });
}

module.exports = connect;
