const express = require("express");
const generateToken = require("../config/generateToken");
const bcrypt = require("bcryptjs");

var users = [];

const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({
        message: "email and Password are required!"
      })
    }

    const userExists = users.some(user => user.email === email);
    if (userExists) {
      return res.status(500).json({
        message: "User already exists!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { email: email, password: hashedPassword };
    users.push(newUser);
    const token = generateToken(email);
    res.status(201).json({
      message: "User registered successfully",
      token,
    });
    console.log(users);
  } catch (err) {
    console.log(err);
  }
};

const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(email);

    res.status(200).json({ message: 'Signin successful', token });
  } catch (err) {
    console.log(err);
  }
};


module.exports = { registerUser, authUser };
