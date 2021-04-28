const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/login", adminController.viewLogin);
router.get("/register", adminController.viewRegister);
// router.post("/register", adminController.actionRegister);

router.post("/register", adminController.actionRegister);

module.exports = router;
