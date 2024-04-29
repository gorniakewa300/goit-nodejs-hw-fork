const express = require("express");
const router = express.Router();
const { authCheck } = require("../../middleware/auth.js");
const { User } = require("../../models/User");
const {
  registration,
  login,
  logout,
  current,
} = require("../../models/users.js");
const { authSchema } = require("../../middleware/validation.js");

router.post("/signup", async (req, res, next) => {
  try {
    const { error } = authSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });
    const existingMail = await User.findOne({ email: req.body.email });
    if (existingMail) {
      return res.status(409).json({ message: "Email in use" });
    }
    const user = await registration(req.body);
    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { error } = authSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });
    const result = await login(req.body);
    if (!result)
      return res.status(401).json({ message: "Email or password is wrong" });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/logout", authCheck, async (req, res, next) => {
  try {
    const result = await logout(req.id);
    if (!result) return res.status(401).json({ message: "Not authorized" });

    res.status(204).json({ message: "No Content" });
  } catch (error) {
    next(error);
  }
});

router.get("/current", authCheck, async (req, res, next) => {
  try {
    const result = await current(req.id);
    if (!result) return res.status(401).json({ message: "Not authorized" });

    res.status(200).json({ user: result });
  } catch (error) {
    next(error);
  }
});
module.exports = router;