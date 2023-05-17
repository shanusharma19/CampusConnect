const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  seller: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  image: {
    url: {
      type: String,
      require: true,
    },
    public_id: {
      type: String,
      require: true,
    },
  },
  description: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  buyer: {
    type: mongoose.Types.ObjectId,
    required: false,
    default: null,
    ref: "User",
  },
  sold: {
    type: Boolean,
    require: false,
    default: false,
  },
  sellerConfirm: {
    type: Boolean,
    require: false,
    default: false,
  },
});

const Item = mongoose.model("Item", schema);

module.exports = Item;
