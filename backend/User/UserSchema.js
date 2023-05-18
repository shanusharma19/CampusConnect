const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
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
    requests:[
      {
        type: mongoose.Types.ObjectId,
        required: false,
        ref: "User",
      }
    ],
    partners:[
      {
        type: mongoose.Types.ObjectId,
        required: false,
        ref: "User",
      }
    ]
  },
);

const user = mongoose.model("User", schema);

module.exports = user;
