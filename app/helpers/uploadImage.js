const multer = require("multer");
const mkdirp = require("mkdirp");
const fs = require("fs");

//create a direction for images which uploaded
getDirImage = () => {
  let year = new Date().getFullYear();
  let month = new Date().getMonth() + 1;
  let day = new Date().getDate();

  return `./public/uploads/images/${year}/${month}/${day}`;
};
//storage of images configuration
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir = getDirImage();

    //get direction by mkdirp
    mkdirp.sync(dir);
    cb(null , dir);
  },
  filename: (req, file, cb) => {
    let filePath = getDirImage() + "/" + file.originalname;
    if (!fs.existsSync(filePath)) cb(null, file.originalname);
    else cb(null, Date.now() + "-" + file.originalname);
  },
});

//upload image configuration
const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 1024 * 1024 * 10 },
});

module.exports = uploadImage;
