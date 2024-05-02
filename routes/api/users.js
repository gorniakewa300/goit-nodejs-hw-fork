const express = require("express");
const router = express.Router();
const { authCheck } = require("../../middleware/auth.js");
const { User } = require("../../models/User");
const {
  registration,
  login,
  logout,
  current,
  verifySchema,
} = require("../../models/users.js");
const { authSchema } = require("../../middleware/validation.js");
const { uploadMiddleware, changeAvatar } = require("../../models/changeAvatar");
const { sendVerificationEmail } = require("../../services/emailService");

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

router.patch(
  "/avatars",
  [authCheck, uploadMiddleware.single("avatar")], 
  changeAvatar
);

router.get("/verify/:verificationToken", async (req, res) => {
  try {
    const { verificationToken } = req.params;

    const user = await User.findOne({ verificationToken });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.status(200).json({ message: "Email verification successful" });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/verify", async (req, res) => {
  const { error, value } = verifySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Missing required field email" });
  }
  try {
    const user = await User.findOne({ email: value.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.verify) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }
    await sendVerificationEmail(user.email, user.verificationToken);
    return res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    console.error("Email verification error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;