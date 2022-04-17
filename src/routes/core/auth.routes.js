const { verifySignUp } = require("@middleware");
const controller = require("@controllers/core/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted, // optional , delete if you need a optional roles , default is setRoles[4] = operator.
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/refreshtoken", controller.refresh_token);
  app.post("/api/auth/forgot", controller.forgot);
  app.post("/api/auth/reset", controller.reset_password);
};
