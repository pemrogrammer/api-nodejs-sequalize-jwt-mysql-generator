const { authJwt } = require("@middleware");
const controller = require("@controllers/core/user_role.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // update bulk role
  app.put("/api/user/role/:id",
    [authJwt.verifyToken, authJwt.isSuperAdmin],
    controller.user_update_role
  );
};
