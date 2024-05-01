const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { nanoid } = require("nanoid");
const Jimp = require("jimp");
const { User } = require("../models/User");

const tmpDir = path.join(__dirname, "../tmp");

const storage = multer.diskStorage({
  destination: tmpDir,
  filename: (req, file, cb) => {
    const [, extension] = file.originalname.split(".");
    cb(null, `${nanoid()}.${extension}`);
  },
});

const uploadMiddleware = multer({ storage });

const changeAvatar = async (req, res) => {
  try {
    const userId = req.user._id;
    const avatarFile = req.file;
    if (!avatarFile) {
      return res.status(400).json({ message: "Avatar file is required" });
    }
    const publicFile = path.join(__dirname, "../public/avatars");
    const jimpImage = await Jimp.read(avatarFile.path);
    await jimpImage
      .resize(250, 250)
      .quality(80)
      .writeAsync(path.join(publicFile, avatarFile.filename));
    const newFilename = `${userId}-${Date.now()}${path.extname(
      avatarFile.originalname
    )}`;
    fs.renameSync(
      path.join(publicFile, avatarFile.filename),
      path.join(publicFile, newFilename)
    );

    const avatarURL = `/avatars/${newFilename}`;

    await User.findByIdAndUpdate(userId, {
      avatarURL,
    });

    res.status(200).json({ avatarURL });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { uploadMiddleware, changeAvatar };