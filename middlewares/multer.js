const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "public/images",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 200000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("excel");

function checkFileType(file, cb) {
  const fileTypes = /jpeg|jpg|png|gif|xlsx/;
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);
  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Error", "image only!");
  }
}

module.exports = { upload };
