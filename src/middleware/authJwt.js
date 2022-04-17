var response = require("@utils/res");
const jwt = require("jsonwebtoken");
const config = require("@config/auth.config.js");
const db = require("@db/models");
const { user } = require("@db/models");


const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return response.err(res, "Unauthorized! Access Token was expired!", 401);
  }
  return response.err(res, "Unauthorized!", 401);
}

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return response.err(res, "No token provided!", 403);
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }
    req.user_id = decoded.id;
    next();
  });
};

isSuperAdmin = (req, res, next) => {
  user.findByPk(req.user_id).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "superadmin") {
          next();
          return;
        }
      }
      response.err(res, "Require Super Admin Role!", 403);
      return;
    });
  });
};
isAdmin = (req, res, next) => {
  user.findByPk(req.user_id).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }
      response.err(res, "Require Admin Role!", 403);
      return;
    });
  });
};

isOperator = (req, res, next) => {
  user.findByPk(req.user_id).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "operator") {
          next();
          return;
        }
      }
      response.err(res, "Require Operator Role!", 403);
    });
  });
};

isModerator = (req, res, next) => {
  user.findByPk(req.user_id).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }
      }
      response.err(res, "Require Moderator Role!", 403);
    });
  });
};

isModeratorOrAdmin = (req, res, next) => {
  user.findByPk(req.user_id).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }
      response.err(res, "Require Moderator or Admin Role!", 403);
    });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isSuperAdmin: isSuperAdmin,
  isAdmin: isAdmin,
  isOperator: isOperator,
  isModerator: isModerator,
  isModeratorOrAdmin: isModeratorOrAdmin,
};
module.exports = authJwt;
