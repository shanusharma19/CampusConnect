const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../User/UserSchema");
const cloudinary = require("cloudinary").v2;
const secretKey = "My_SECRET_KEY";

const uploadImage = async (file) => {
  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    public_id: `${Date.now()}`,
    resource_type: "auto",
    folder: "profiles",
  });
  return result;
};

const deleteImage = async (image) => {
  await cloudinary.uploader.destroy(image.public_id);
};

const decodeToken = (token) => {
  let id;
  try {
    id = jwt.verify(token, secretKey);
  } catch (_e) {
    console.log("Error verifying token");
  }
  return id;
};

const generateToken = (id) => {
  const token = jwt.sign(
    {
      id,
    },
    secretKey
  );
  return token;
};

const verifyEmail = (email) => {
  const pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

  return pattern.test(email);
};

const signupUser = async (req, res) => {
  const { name, email, password } = req.body;
  const file = req.files.img;
  const { public_id, url } = await uploadImage(file);

  if (!name || !email || !password) {
    res.status(400).json({
      status: false,
      message: `All fields are required`,
    });
    return;
  }
  if (!verifyEmail(email)) {
    res.status(400).json({
      status: false,
      message: `Email is not valid`,
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    image: {
      public_id,
      url,
    },
    requests: [],
    partners: [],
  });

  newUser
    .save()
    .then((user) => {
      res.status(201).json({
        status: true,
        message: "User successfully created",
        data: user,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: false,
        message: "Error creating user",
        error: err,
      });
    });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      status: false,
      message: `All fields are required`,
    });
    return;
  }
  if (!verifyEmail(email)) {
    res.status(400).json({
      status: false,
      message: `Email is not valid`,
    });
    return;
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(422).json({
      status: false,
      message: `Email is not present in our database`,
    });
    return;
  }

  const dbPassword = user.password;
  const matched = await bcrypt.compare(password, dbPassword);

  if (!matched) {
    res.status(422).json({
      status: false,
      message: `Credentials does not match`,
    });
    return;
  }

  const token = generateToken(user._id);
  res.status(200).json({
    status: true,
    message: "Login successful",
    data: user,
    token,
  });
};

const authenticateUser = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    res.status(400).json({
      status: false,
      message: "Token not found",
    });
    return;
  }
  token = token.slice(1, -1);

  const id = decodeToken(token);
  if (!id) {
    res.status(422).json({
      status: false,
      message: "Invalid Token",
    });
    return;
  }
  const { i } = id;

  const user = await User.findOne(i);
  if (!user) {
    res.status(422).json({
      status: false,
      message: "Invalid Token",
    });
    return;
  }
  req.user = user;
  next();
};

const getUser = async (req, res) => {
  const user = req.user;
  res.status(200).json({
    status: true,
    data: user,
  });
};

const changeProfile = async (req, res) => {
  try {
    const { id } = req.body;
    const file = req.files.img;

    const { public_id, url } = await uploadImage(file);
    let i = {
      public_id,
      url,
    };
    const user = await User.findOneAndUpdate(
      { _id: id },
      {
        image: i,
      },
      { new: false }
    );
    await deleteImage(user.image);
    const newUser = await User.findOne({
      _id: id,
    });
    if (newUser) {
      res.status(201).json({
        status: true,
        message: "Profile image changed successfully",
        data: newUser,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error changing profile image",
      error: err,
    });
  }
};

const sendRequest = async (req, res) => {
  try {
    const userId = req.body.userId;
    const id = req.params.id;
    if (userId == id) {
      res.status(500).json({
        status: false,
        message: "UserId and Id are same",
      });
      return;
    }

  const temp1 = await User.findOne({_id: id});

  if (!temp1) {
    res.status(422).json({
      status: false,
      message: "Invalid id",
    });
    return;
  }

    await User.findOneAndUpdate(
      { _id: id },
      { $addToSet: { requests: userId } },
      { new: true }
    );

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { sentTo: id } },
      { new: true }
    );

    if (updatedUser) {
      res.status(201).json({
        status: true,
        message: "Request sent successfully",
        data: updatedUser,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error in sending request",
      error: err,
    });
  }
};

const rejectRequest = async (req, res) => {
  try {
    const userId = req.body.userId;
    const id = req.params.id;
    if (userId == id) {
      res.status(500).json({
        status: false,
        message: "UserId and Id are same",
      });
      return;
    }

  const temp1 = await User.findOne({_id: id});

  if (!temp1) {
    res.status(422).json({
      status: false,
      message: "Invalid id",
    });
    return;
  }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { requests: id } },
      { new: true }
    );

    await User.findOneAndUpdate(
      { _id: id },
      { $pull: { sentTo: userId } },
      { new: true }
    );

    if (updatedUser) {
      res.status(201).json({
        status: true,
        message: "Request rejected successfully",
        data: updatedUser,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error in rejecting request",
      error: err,
    });
  }
};

const acceptRequest = async (req, res) => {
  try {
    const userId = req.body.userId;
    const id = req.params.id;
    if (userId == id) {
      res.status(500).json({
        status: false,
        message: "UserId and Id are same",
      });
      return;
    }

  const temp1 = await User.findOne({_id: userId, requests: [id]});

  if (!temp1) {
    res.status(422).json({
      status: false,
      message: "Invalid id",
    });
    return;
  }
    
  await User.findOneAndUpdate(
    { _id: id },
    { $pull: { sentTo: userId }, $addToSet: { partners: userId } }
  );

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { requests: id }, $addToSet: { partners: id } },
      { new: true }
    );

    if (updatedUser) {
      res.status(201).json({
        status: true,
        message: "Request rejected successfully",
        data: updatedUser,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error in rejecting request",
      error: err,
    });
  }
};



module.exports = {
  signupUser,
  loginUser,
  authenticateUser,
  getUser,
  changeProfile,
  sendRequest,
  rejectRequest,
  acceptRequest
};
