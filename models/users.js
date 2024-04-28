
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User } = require("./User");

const registration = async (body) => {
  try {
    const { email, password } = body;
    const user = new User({
      email,
      password: await bcrypt.hash(password, 10),
    });

    await user.save();
    const newUser = { email: user.email, subscription: user.subscription };
    return newUser;
  } catch (error) {
    console.log("error", error.message);
  }
};

const login = async (body) => {
  try {
    const { email, password } = body;
    const findUser = await User.findOne({ email });

    if (!findUser) return "Wrong email";
    if (!(await bcrypt.compare(password, findUser.password)))
      return "Wrong password";

    const token = jwt.sign(
      {
        _id: findUser._id,
      },
      process.env.JWT_SECRET
    );
    await User.updateOne({ _id: findUser.id }, { token });
    const user = {
      token: token,
      user: { email: findUser.email, subscription: findUser.subscription },
    };
    return user;
  } catch (error) {
    console.log("error", error.message);
  }
};

const logout = async (userId) => {
  try {
    return (await User.updateOne({ _id: userId }, { token: null }));
  } catch (error) {
    console.log("error", error.message);
  }
};

const current = async (userId) => {
  try {
    const user = await User.findById({ _id: userId });
    const userData = { email: user.email, subscription: user.subscription };
    return userData;
  } catch (error) {
    console.log("error", error.message);
  }
};

module.exports = {
  registration,
  login,
  logout,
  current,
};