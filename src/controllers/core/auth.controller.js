var response = require("@utils/res");
const config = require("@config/auth.config");
const {
  user, role, token, Sequelize,
  ability, role_ability,
  refresh_token,
 } = require("@db/models");
const Op = Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sentMail = require('@utils/send_email');
// mailer
// const nodemailer = require("nodemailer");

// this function is not use
exports.signup = async (req, res) =>  {
  await user.create({
    // username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then( async (user) => {
      console.log(`create user`);
      if (req.body.roles) {
        console.log(`create user have roles`);
        role.findAll({
          where: {
            id: {
              [Op.or]: req.body.roles,
            },
          },
        }).then( async (roles) => {
          await user.setRoles(roles).then(() => {
            response.ok(res, "User was registered successfully!", 201);
          });
        });
      } else { // default role if request doesn't have set the data
      console.log(`create user have not roles`);
        // user.setRoles([1])
        console.log(`data user email : ${user.email}`);
        await user.setRoles([3]).then(() => {
          const resData = {
            user: user,
          };
          response.ok(res, "User was registered successfully!", resData);
        });
      }
    })
    .catch((err) => {
      response.err(res, err.message, 500);
    });
};

exports.signin = async (req, res) => {
  await user.findOne({
    where: {
      email: req.body.email,
    },
    include: [
      {
        model : role,
        through: {attributes: []},
        include: [
          {
            model: ability,
            through: {attributes: []},
          }
        ]
      },
      ],
  })
    .then( async (user) => {
      if (!user) {
        return response.err(res, "Pengguna tidak ditemukan.", 404);
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return response.err(res, "Password tidak benar.", 401);
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        // expiresIn: 86400000, // 24000 hours
        expiresIn: config.jwtExpiration
      });

      let refreshToken = await refresh_token.createToken(user);

      var authorities = [];
      // await user.getRoles().then( async (roles) => {
      //   for (let i = 0; i < roles.length; i++) {
      //     authorities.push("" + roles[i].name);
      //   }
        const resData = {
          user_data: user, // my vueJS ( instead of snack_case use camelCase #only_here #todo_vuejs )
          // roles: authorities,
          access_token: token,
          refresh_token: refreshToken
        };
        response.ok(res, "Login berhasil.", resData);
      // });
    })
    .catch((err) => {
      return response.err(res, err.message, 500);
    });
};

exports.forgot = async (req, res) => {
  await user.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then( async (user) => {
      if (!user) {
        return response.err(res, "User Not found.", 404);
      }

      let resetToken = crypto.randomBytes(3).toString("hex");
      const hash = await bcrypt.hash(resetToken, Number(10));

      console.log('resetToken : ', resetToken);
      console.log('time : ', Date.now() + 15 * 60000);

      const [record, created] = await token.upsert(
        {
          id: user.id, // You do still need to provide the id of the record you want to upsert or a new record will be created.
          user_id: user.id,
          token: hash,
          expires: Date.now() + 15 * 60000,
        }, // Record to upsert
        { returning: true }     // Return upserted record
      );

      const link = `${resetToken}`; // input on mobile apps
      response.ok(res, "token, berhasil menambahkan data", 1);
      await sentMail(
        user.email,
        "Password Reset Request",
        {
          name: user.email,
          link: link, // token
        },
        "../utils/template/request_reset_password.handlebars"
      );
    })
    .catch((err) => {
      return response.err(res, err.message, 500);
    });
};

exports.reset_password = async (req, res) => {

  const token_data = req.body.token;
  const new_password = req.body.new_password;

  await user.findOne({
    where: {
      email: req.body.email,
    }
  }).then( async (user) => {
      if (!user) {
        return response.err(res, "User Not found.", 404);
      }
      let passwordResetToken = await token.findOne({
        where: {
          user_id: user.id,
        },
      });
      if (!passwordResetToken || passwordResetToken.token == null) {
        throw new Error("Already used or No reset token registered");
      }

      var today = moment().format("yyyy-MM-D HH:mm:SS")
      let expires = moment(passwordResetToken.expires + '+08:00').local().format('yyyy-MM-D HH:mm:SS');
      console.log('compare today : { ', today, ' } and { ', expires , ' } ');

      if (expires <= today) {
        throw new Error("Expired password reset token");
      }

      const isValid = await bcrypt.compare(token_data, passwordResetToken.token);
      if (!isValid) {
        throw new Error("Invalid password reset token");
      }

      const hash = await bcrypt.hash(new_password, Number(10));

      await user.update({
        password: hash,
      }, {
        where: {
          id: user.id,
        }
      }).then( async (model) => {
        const [record, created] = await token.upsert(
          {
            id: user.id, // You do still need to provide the id of the record you want to upsert or a new record will be created.
            user_id: user.id,
            token: null,
          }, // Record to upsert
          { returning: true }     // Return upserted record
        );
        response.ok(res, "user updated password", 1);
        sentMail(
          user.email,
          "Password Reset Successfully",
          {
            name: user.email,
          },
          "../utils/template/notify_reset_password.handlebars"
        );
      }).catch((err) => {
        console.log('user updated password error :', err);
      });



  }).catch((err) => {
    return response.err(res, err.message, 500);
  });
};

exports.refresh_token = async (req, res) => {
  const { refresh_token: requestToken } = req.body;

  if (requestToken == null) {
    return response.err(res, "Refresh Token is required!!", 403);
  }

  try {
    let refreshToken = await refresh_token.findOne({ where: { token: requestToken } });

    if (!refreshToken) {
      response.err(res, "Refresh token is not in database!!", 403);
      return;
    }

    if (refresh_token.verifyExpiration(refreshToken)) {
      refresh_token.destroy({ where: { id: refresh_token.id } });

      response.err(res, "Refresh token was expired. Please make a new signin request", 403);
      return;
    }

    const user = await refreshToken.getUser();

    let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    const resData = {
      access_token: newAccessToken,
      refresh_token: refreshToken.token,
    };
    response.ok(res, "User was refresh authorize!", resData);
  } catch (err) {
    return response.err(res, err, 500);
  }
};