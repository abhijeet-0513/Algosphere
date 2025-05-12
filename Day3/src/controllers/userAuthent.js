const redisClient = require("../config/redis");
const User = require("../models/user");
const validate = require("../utils/validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// User registration feature

const register = async (req, res) => {
  try {
    // validate the data
    validate(req.body);

    const { firstName, emailId, password } = req.body;

    req.body.password = await bcrypt.hash(password, 10);

    req.body.role = "user";

    const user = await User.create(req.body);
    const token = jwt.sign(
      { _id: user._id, emailId, role: "user" },
      process.env.JWT_KEY,
      {
        expiresIn: 60 * 60,
      }
    );
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(201).send("User Registered Successfully");
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
};

// User login feature

const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId) throw new Error("Invalid Credentials");
    if (!password) throw new Error("Invalid Credentials");

    const user = await User.findOne({ emailId });

    const match = bcrypt.compare(password, user.password);

    if (!match) throw new Error("Invalid Credentials");
    const token = jwt.sign(
      { _id: user._id, emailId, role: user.role },
      process.env.JWT_KEY,
      {
        expiresIn: 60 * 60,
      }
    );
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(200).send("Logged In Successfully");
  } catch (err) {
    res.status(401).send("Error: " + rrr);
  }
};

// User logout feature

const logout = async (req, res) => {
  try {
    const { token } = req.cookies;

    const payload = jwt.decode(token);

    await redisClient.set(`token:${token}`, "Blocked");
    await redisClient.expireAt(`token:${token}`, payload.exp);
    // then add the token to Redis blocklist till the token expires
    // then clear the cookies.....

    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("Logged Out Successfully");
  } catch (err) {
    res.status(503).send("Error: " + err);
  }
};

// admin registration
const adminRegister = async (req, res) => {
  try {
    // validate the data

    // if (req.result.role != "admin") throw new Error("Invalid Credentials"); check for admin

    validate(req.body);

    const { firstName, emailId, password } = req.body;

    req.body.password = await bcrypt.hash(password, 10);

    // req.body.role = "admin";

    const user = await User.create(req.body);
    const token = jwt.sign(
      { _id: user._id, emailId, role: user.role },
      process.env.JWT_KEY,
      {
        expiresIn: 60 * 60,
      }
    );
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(201).send("User Registered Successfully");
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
};

module.exports = {
  register,
  login,
  logout,
  adminRegister,
};
