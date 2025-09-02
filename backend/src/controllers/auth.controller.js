const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  const {
    fullName: { firstName, lastName },
    email,
    password,
  } = req.body;

  const userAlreadyExists = await userModel.findOne({ email });

  if (userAlreadyExists) {
    return res.status(400).json({
      message: "User Already Exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    fullName: { firstName, lastName },
    email,
    password: hashedPassword,
  });

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET_KEY
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "User Created Successfully",
    user: {
      fullName: user.fullName,
      email: user.email,
      id: user._id,
    },
  });
};

const loginController = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "Invalid Email",
    });
  }

  const passwordValid = await bcrypt.compare(password, user.password);

  if (!passwordValid) {
    return res.status(401).json({
      message: "Invalid Password",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET_KEY
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "Logged In Successfully",
    user: {
      fullName: user.fullName,
      email: user.email,
      id: user._id,
    },
  });
};



module.exports = {
  registerController,
  loginController,

};
