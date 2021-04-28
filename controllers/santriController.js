const Santri = require("../models/Santri");
const { check, validationResult } = require("express-validator");
const xlsx = require("xlsx");

module.exports = {
  // viewSantri: (req, res) => {
  //   let keyword = {};
  //   if (req.query.keyword) {
  //     keyword = {
  //       name: { $regex: req.query.keyword, $options: "i" },
  //     };
  //   }

  //   Santri.find(keyword, (err, santri) => {
  //     if (err) throw err;
  //     const alertMessage = req.flash("alertMessage");
  //     const alertStatus = req.flash("alertStatus");
  //     const alert = { message: alertMessage, status: alertStatus };
  //     res.render("santri/index", { title: "Santri", alert, santri });
  //   });
  // },

  viewSantri: async (req, res) => {
    try {
      let jumlahDataPerhalaman = 2;
      let jumlahData = await Santri.find();
      let jumlahHalaman = Math.ceil(jumlahData.length / jumlahDataPerhalaman);
      let halamanAktif = req.query.halaman ? req.query.halaman : 1;
      let awalData = jumlahDataPerhalaman * halamanAktif - jumlahDataPerhalaman;

      const santri = await Santri.find()
        .sort({ createdAt: -1 })
        .skip(awalData)
        .limit(jumlahDataPerhalaman);
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("santri/index", {
        title: "Santri",
        santri,
        alert,
        jumlahHalaman,
        halamanAktif,
      });
    } catch (error) {
      console.log(error.message);
    }
  },

  createSantri: async (req, res) => {
    const { nama, usia } = req.body;
    try {
      await check("nama")
        .isLength({ min: 3 })
        .withMessage("Too short")
        .run(req);
      await check("usia").isNumeric().withMessage("Must be a number").run(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const alert = errors.array();
        alert.map((error) => {
          req.flash("alertMessage", `${error.msg}`);
        });
        req.flash("alertStatus", "warning");
        res.redirect("/santri");
        return;
      }

      const santri = new Santri({
        name: nama.trim(),
        age: usia.trim(),
      });

      await santri.save();
      req.flash("alertMessage", "Success add data");
      req.flash("alertStatus", "success");
      res.redirect("/santri");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/santri");
    }
  },

  downloadTemplate: (req, res) => {
    const file = "public/template/siswa-template.xlsx";
    res.download(file);
  },

  createSantriXlsx: (req, res) => {
    try {
      let workbook = xlsx.readFile(req.file.path);
      let nameList = workbook.SheetNames;
      var i = 0;
      nameList.forEach((el) => {
        let xlsxData = xlsx.utils.sheet_to_json(workbook.Sheets[nameList[i]]);
        Santri.insertMany(xlsxData, (err, data) => {
          if (err) throw err;
        });
        i++;
      });
      req.flash("alertMessage", "Success add data");
      req.flash("alertStatus", "success");
      res.redirect("/santri");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/santri");
    }
  },

  exportExcel: async (req, res) => {
    let wb = xlsx.utils.book_new();
    // Santri.find((err, data) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     let temp = JSON.stringify(data);
    //     temp = JSON.parse(temp);

    //     let ws = xlsx.utils.json_to_sheet(temp);
    //     console.log(ws);
    //     let down = "public/data.xlsx";

    //     xlsx.utils.book_append_sheet(wb, ws, "sheet1");
    //     xlsx.writeFile(wb, down);

    //     res.download(down);
    //   }
    // });

    const data = await Santri.find().select("name age");

    let temp = JSON.stringify(data);
    temp = JSON.parse(temp);

    let ws = xlsx.utils.json_to_sheet(temp);
    let down = "public/downloads/data-santri.xlsx";

    xlsx.utils.book_append_sheet(wb, ws, "sheet1");
    xlsx.writeFile(wb, down);

    res.download(down);
  },

  deleteSantri: async (req, res) => {
    try {
      const { id } = req.params;
      const santri = await Santri.findOne({ _id: id });
      santri.remove();
      req.flash("alertMessage", "Success delete data");
      req.flash("alertStatus", "success");
      res.redirect("/santri");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/santri");
    }
  },
};
