const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

const authCheck = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "Please provide a token" });
  }

  const [, token] = authorization.split(" ");
  const tokenCheck = jwt.decode(token, process.env.JWT_SECRET);
  if (!tokenCheck) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const user = await User.findById(tokenCheck._id);

  req.token = token;
  req.user = user;
  req.id = user._id;
  next();
};

module.exports = {
  authCheck,
};