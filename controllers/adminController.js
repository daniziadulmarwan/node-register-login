const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

module.exports = {
  viewLogin: (req, res) => {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = { message: alertMessage, status: alertStatus };
    res.render("index", { alert });
  },
  viewRegister: (req, res) => {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = { message: alertMessage, status: alertStatus };
    res.render("register/index", { alert });
  },

  actionRegister: async (req, res, next) => {
    await check("username")
      .isLength({ min: 3 })
      .withMessage("Too short")
      .isEmail()
      .withMessage("Must an email")
      .trim()
      .run(req);
    await check("password")
      .isLength({ min: 3 })
      .withMessage("Password must have 3 character")
      .equals(req.body.password2)
      .withMessage("Pass not match")
      .trim()
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const alert = errors.array();
      alert.map((error) => {
        req.flash("alertMessage", `${error.msg}`);
      });
      req.flash("alertStatus", "warning");
      res.redirect("/register");
      return;
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      username: req.body.username,
      password: hashedPassword,
    });
    req.flash("alertMessage", "Success registration");
    req.flash("alertStatus", "success");
    res.redirect("/login");
  },
};
