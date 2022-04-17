const { authJwt } = require("@middleware");
const controller = require("@controllers/download.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // findAll
  // app.get("/api/excel/download",
  //   [authJwt.verifyToken, authJwt.isAdmin],
  //   controller.download_excel_all
  // );

  // findAll
  app.get("/api/excel/download/:date1/:date2",
    [authJwt.verifyToken],
    controller.download_excel
  );
};
