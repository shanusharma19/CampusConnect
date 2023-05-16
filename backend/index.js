const express = require("express");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const cors = require("cors");
const mongoose = require("mongoose");
const {
  signupUser,
  loginUser,
  authenticateUser,
  getUser,
} = require("./User/UserControllers");
const {
  createItem,
  getItems,
  purchaseItem,
} = require("./Item/ItemControllers");

const app = express();
app.use(cors());
app.use(express.json());       
app.use(express.urlencoded({extended: true})); 
app.use(fileUpload({
  useTempFiles: true,
  limits: {fileSize: 50*2024*1024}
}));

cloudinary.config({ 
  cloud_name: 'dcj6jrcqs', 
  api_key: '635174967738494', 
  api_secret: 'dWjioWX6OiNd6c_bH8SH5VMwlKE' 
});

app.post("/signup", signupUser);
app.post("/login", loginUser);
app.get("/user", authenticateUser, getUser);

app.post("/createItem", createItem);
app.post("/purchaseItem", purchaseItem);
app.get("/getItems", getItems);

mongoose
  .connect("mongodb://localhost:27017/CampusConnect")
  .then(() => console.log("Established a connection with the database"))
  .catch((err) => console.log("Error connecting to database", err));

app.listen(5000, () => {
  console.log("Backend is up at port 5000");
});
