
const multer = require("multer");
const fs = require("fs").promises;
const path = require("path");
const { nanoid } = require("nanoid");
const Jimp = require("jimp");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve("./tmp"));
    },
    filename: (req, file, cb) => {
        const [, extension] = file.originalname.split(".");
        cb(null, `${nanoid()}.${extension}`);
    },
});

const uploadMiddleware = multer({ storage });

const changeAvatar = async (file) => {
    try {
        const { filename } = file;
        const tmpFile = path.join(__dirname, "../tmp", filename);
        const publicFile = path.join(__dirname, "../public/avatars", filename);
        const publicPath = `http://`;
        const result = await Jimp.read(tmpFile)
            .then((img) => img.resize(250, Jimp.AUTO).quality(80).write(publicFile))
            .then(() => fs.rm(tmpFile));

        return publicPath;
    } catch (error) {
        console.log("error", error);
    }
};


module.exports = { uploadMiddleware, changeAvatar };