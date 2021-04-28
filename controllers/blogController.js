const Blog = require("../models/Blog");

module.exports = {
  viewBlog: async (req, res) => {
    try {
      const b = await Blog.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("blog/index", { title: "Blog", alert, b });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/blog");
    }
  },

  createBlog: async (req, res) => {
    const { title, author, text } = req.body;
    try {
      console.log(req.file);
      if (!req.file) {
        req.flash("alertMessage", "Image cannot be empty");
        req.flash("alertStatus", "warning");
        res.redirect("/blog");
        return;
      }

      const blog = new Blog({
        title: title,
        author: author,
        text: text,
        image: `images/${req.file.filename}`,
      });

      await blog.save();
      req.flash("alertMessage", "Success add blog");
      req.flash("alertStatus", "success");
      res.redirect("/blog");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/blog");
    }
  },
};
