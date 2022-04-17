var response = require("@utils/res");
const { user , role } = require("@db/models");

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  console.log(`call on checkDuplicateUsernameOrEmail()`);
  // Username
  // User.findOne({
  //   where: {
  //     username: req.body.username,
  //   },
  // }).then((user) => {
  //   if (user) {
  //     response.err(res, "Failed! Username is already in use!", 400);
  //     return;
  //   }

    // Email
    try {
      await user.findOne({
        where: {
          email: req.body.email,
        },
      }).then((user) => {
        if (user) {
          response.err(res, "Failed! Email is already in use!", 409);
          return;
        }

        next();
      });
    } catch (error) {
      console.log('an error : ', error);
    }
  // });
};

checkRolesExisted = async (req, res, next) => {
  const roles = req.body.roles;
  try {
    for (let i = 0; i < roles.length; i++) {
      await role.findOne({
        where: {
          id: roles[i].role_id,
        },
      }).then((role) => {

        if (!role) {
          var msg = "Failed! Role does not exist = ";
          response.err(res, msg, 400);
          return;
        }

        next();
      });

    }
  } catch (err) {
    response.err(res, `error (checkRolesExisted) ${err}`, 404);
  }
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted,
};

module.exports = verifySignUp;
