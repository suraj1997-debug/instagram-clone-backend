const multer = require("multer");
const path = require("path");
const sharp = require("sharp")
const fs = require("fs");

const postStorage = multer.memoryStorage();

const checkIsImg = (file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only images are allowed...!"));
  }
};

exports.PostPics = multer({
  storage: postStorage,
  fileFilter: (req, file, cb) => {
    checkIsImg(file, cb);
  },
});

exports.PostPicsResizeImages = async (req, res, next) => {
  if (!req.file) return next();

  req.body.picture = "";
if(req.file){
  const newFilename =  req.file.fieldname + "-" + Date.now() + path.extname(req.file.originalname)
  const pathTo = `./uploads/posts/${newFilename}`
      // if(fs.existsSync(pathTo)){
      await sharp(req.file.buffer)
        // .resize(200, 200)
        .toFormat("jpeg" || "png" || "jpg")
        .jpeg({quality:75})
        .toFile(pathTo);
        req.body.picture = newFilename;
      // }
    }
  next();
};
