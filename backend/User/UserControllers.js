const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../User/UserSchema");
const secretKey = "My_SECRET_KEY";

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
      id
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
  
  const id = decodeToken(token)
  if (!id) {
    res.status(422).json({
      status: false,
      message: "Invalid Token",
    });
    return;
  }
  const {i} = id;

  const user = await User.findOne( i );
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
}

module.exports = {
  signupUser,
  loginUser,
  authenticateUser,
  getUser
};
