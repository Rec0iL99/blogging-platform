import User from "../models/User.js";
import argon2 from "argon2";

export const register = async (req, res) => {
  const hashedPassword = await argon2.hash(req.body.password);

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    registrationDate: new Date(),
  });

  let result;

  try {
    result = await newUser.save();
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return res.status(406).json({
        message: "User already exists",
      });
    }
  }

  return res.status(201).json(result);
};

export const login = async (req, res) => {
  const { password, email } = req.body;
  const user = await User.find({ email }).exec();

  if (user.length == 0) {
    return res.status(406).json({
      message: `User with email ${email} not found. Please register`,
    });
  }

  const valid = await argon2.verify(user[0].password, password);
  if (!valid) {
    return res.status(406).json({
      message: "Incorrect password",
    });
  }

  return res.status(201).json({
    message: "Login successful",
    user: user[0],
  });
};
