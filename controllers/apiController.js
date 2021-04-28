const User = require("../models/User");
const Blog = require("../models/Blog");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

module.exports = {
  getUser: async (req, res) => {
    let jumlahDataPerhalaman = 3;
    let jumlahData = await User.find();
    let jumlahHalaman = Math.ceil(jumlahData.length / jumlahDataPerhalaman);
    let halamanAktif = req.query.halaman ? req.query.halaman : 1;
    let awalData = jumlahDataPerhalaman * halamanAktif - jumlahDataPerhalaman;
    const user = await User.find()
      .sort({ createdAt: -1 })
      .select("_id username")
      .skip(awalData)
      .limit(jumlahDataPerhalaman);
    if (!user) {
      return res.status(400).json({
        message: "Sorry, user not found",
      });
    }

    res.json({
      message: "Success get data",
      data: user,
    });
  },

  getUserById: async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Success get data by Id",
      data: user,
    });
  },

  createUser: async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({
        message: "Something wrong",
        data: error.array(),
      });
    }

    const user = await User.findOne({ username: req.body.username });
    if (user) {
      return res.status(400).json({
        message: "User has been exist",
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = {
      username: req.body.username,
      password: hashedPassword,
    };

    await User.create(newUser)
      .then((result) => {
        res.json({
          message: "Success create data",
          data: result.id,
        });
      })
      .catch((error) => console.error(error));
  },

  getBlog: async (req, res) => {
    try {
      const blog = await Blog.find().sort({ createdAt: -1 }).limit(5);
      res.status(200).json(blog);
    } catch (error) {}
  },
};
