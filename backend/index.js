const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const getUser = require("./User/UserControllers");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", getUser);

mongoose
  .connect("mongodb://localhost:27017/CampusConnect")
  .then(() => console.log("Established a connection with the database"))
  .catch((err) => console.log("Error connecting to database", err));

app.listen(5000, () => {
  console.log("Backend is up at port 5000");
});
