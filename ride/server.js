const http = require("http");
const app = require("./app");
require("dotenv").config();

const server = http.createServer(app);
const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`Ride service is running on port ${PORT}`);
});
