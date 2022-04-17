
const { authJwt } = require("@middleware");
const controller = require("@controllers/book.controller");


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
  app.get("/api/book",
    [authJwt.verifyToken],
    controller.book_show
  );

  // findOne
  app.get("/api/book/:id",
    [authJwt.verifyToken],
    controller.book_show
  );

  // create
  app.post("/api/book",
    [authJwt.verifyToken],
    controller.book_create
  );

  // update
  app.put("/api/book/:id",
    [authJwt.verifyToken],
    controller.book_update
  );

  // delete
  app.delete("/api/book/:id/:flag",
    [authJwt.verifyToken],
    controller.book_delete
  );
  // // submit
  // app.get("/api/book/submit/excel",
  //   [authJwt.verifyToken],
  //   controller.book_submit_show
  // );
};

            
