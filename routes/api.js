const express = require("express");
const router = express.Router();

const apiController = require("../controllers/apiController");

const { check } = require("express-validator");

router.get("/users", apiController.getUser);
router.get("/user/:id", apiController.getUserById);
router.post(
  "/user",
  [check("username").isLength({ min: 3 }).withMessage("Username too short")],
  apiController.createUser
);

// Blog Router
router.get("/blog", apiController.getBlog);

module.exports = router;
