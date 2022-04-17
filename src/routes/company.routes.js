
const { authJwt } = require("@middleware");
const controller = require("@controllers/company.controller");


module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  // codehere
  // findAll
  app.get("/api/company",
    [authJwt.verifyToken],
    controller.company_show
  );

  // findOne
  app.get("/api/company/:id",
    [authJwt.verifyToken],
    controller.company_show
  );

  // create
  app.post("/api/company",
    [authJwt.verifyToken],
    controller.company_create
  );

  // update
  app.put("/api/company/:id",
    [authJwt.verifyToken],
    controller.company_update
  );

  // delete
  app.delete("/api/company/:id/:flag",
    [authJwt.verifyToken],
    controller.company_delete
  );
  // // submit
  // app.get("/api/company/submit/excel",
  //   [authJwt.verifyToken],
  //   controller.company_submit_show
  // );
};

            
