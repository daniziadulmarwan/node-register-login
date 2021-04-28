const express = require("express");
const router = express.Router();

const santriController = require("../controllers/santriController");
// const { upload } = require("../middlewares/multer");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "public/images",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

let upload = multer({ storage: storage });

router.get("/", santriController.viewSantri);
router.post("/create", santriController.createSantri);
router.get("/download", santriController.downloadTemplate);
router.post(
  "/create/x",
  upload.single("excel"),
  santriController.createSantriXlsx
);
router.get("/export", santriController.exportExcel);
router.get("/delete/:id", santriController.deleteSantri);

module.exports = router;
