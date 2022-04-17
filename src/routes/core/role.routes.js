const { authJwt } = require("@middleware");
const controller = require("@controllers/core/role.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  // findAll
  app.get("/api/role",
    [authJwt.verifyToken, authJwt.isSuperAdmin],
    controller.role_show
  );

  // findOne
  app.get("/api/role/:id",
    [authJwt.verifyToken, authJwt.isSuperAdmin],
    controller.role_show
  );

  // create
  app.post("/api/role",
    [authJwt.verifyToken, authJwt.isSuperAdmin],
    controller.role_create
  );

  // update
  app.put("/api/role/:id",
    [authJwt.verifyToken, authJwt.isSuperAdmin],
    controller.role_update
  );

  // delete
  app.delete("/api/role/:id/:flag",
    [authJwt.verifyToken, authJwt.isSuperAdmin],
    controller.role_delete
  );

};
