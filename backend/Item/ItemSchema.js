const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  state: {
    type: String,
    require: true,
  },
  seller: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  buyer: {
    type: mongoose.Types.ObjectId,
    required: false,
    ref: "User",
  },
});

const Item = mongoose.model("Item", schema);

module.exports = Item;
