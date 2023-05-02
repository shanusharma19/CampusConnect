const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const {signupUser, loginUser, authenticateUser, getUser} = require("./User/UserControllers");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/signup", signupUser);
app.post("/login", loginUser);
app.get('/user',authenticateUser,getUser);

mongoose
  .connect("mongodb://localhost:27017/CampusConnect")
  .then(() => console.log("Established a connection with the database"))
  .catch((err) => console.log("Error connecting to database", err));

app.listen(5000, () => {
  console.log("Backend is up at port 5000");
});
