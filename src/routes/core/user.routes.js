const { verifySignUp, authJwt, uploadFile } = require("@middleware");
const controller = require("@controllers/core/user.controller");

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
  app.get("/api/user",
    [authJwt.verifyToken, authJwt.isSuperAdmin],
    controller.user_show
  );

  // findOne
  app.get("/api/user/:id",
    [authJwt.verifyToken, authJwt.isSuperAdmin],
    controller.user_show
  );

  app.get("/api/whoisme",
    [authJwt.verifyToken],
    controller.user_whoisme
  );

  // create
  app.post("/api/user",
    [
      authJwt.verifyToken, authJwt.isSuperAdmin,
      verifySignUp.checkDuplicateUsernameOrEmail,
    ],
    controller.user_create
  );

  // update
  app.put("/api/user/:id",
    [authJwt.verifyToken, authJwt.isSuperAdmin],
    controller.user_update
  );

  // delete
  app.delete("/api/user/:id/:flag",
    [authJwt.verifyToken, authJwt.isSuperAdmin],
    controller.user_delete
  );

  app.put(
    "/api/user/image/:id",
    [authJwt.verifyToken, uploadFile.isImage.single("file"), authJwt.isSuperAdmin],
    controller.user_upload_image_update
  );
};
