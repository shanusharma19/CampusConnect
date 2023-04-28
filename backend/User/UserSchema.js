const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: String, 
    id: Number,
  },
);

const user = mongoose.model("Userchema", schema);

module.exports = user;
