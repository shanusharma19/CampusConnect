const user = require("../User/UserSchema");
const getUser = async (req, res) => {
    const result = await user.find({id: 1},{ _id: 0});
    res.status(200).json({
      status: true,
      data: result,
    });
  };

  module.exports = getUser;