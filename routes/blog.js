const router = require("express").Router();
const blogController = require("../controllers/blogController");
const { upload } = require("../middlewares/multer");

router.get("/", blogController.viewBlog);
router.post("/create", upload, blogController.createBlog);

module.exports = router;
