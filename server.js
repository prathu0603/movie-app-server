const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

// Database Import & Call
const Connection = require("./db.js");
Connection();

// Middlewares
app.use(express.json());
app.use(cors());

// Custom Routes
app.use("/", require("./Routes/User.js"));

// Default Route
app.get("/", (request, response) => {
  response.json({ message: "Welcome To Movie Api" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
