const jwt = require("jsonwebtoken");
const config = require("@config/auth.config.js");
var response = require("@utils/res");
var pagination = require("@utils/pagination");
const { Op } = require('sequelize')
const {
  user, role,
  department, user_role,
  ability,
  Sequelize, refresh_token
} = require("@db/models");
const fs = require("fs");
var bcrypt = require("bcryptjs");

exports.user_create = async  (req, res) => {
  await user.create({
    full_name: req.body.full_name,
    phone: req.body.phone,
    email: req.body.email,
    avatar: 'imt.png',
    password: bcrypt.hashSync(req.body.password, 8),
  }).then( async (user) => {

    const TAG_LOG = `user_create`;
    console.log(`\n\n\n\n${TAG_LOG} onStart\n`);

    // bulkRole | setRoles # TODO MAKE THESE TO UTILS CLASS
    const bulkRole = req.body.roles;
    bulkRole.forEach(
      async (data)  => {

        await role.findAll({
          where: {
            id: `${data.role_id}`,
          },
        }).then( async (roles) => {

          await user.setRoles(
            roles
          ).then( async (roles) => {
            console.log(`${TAG_LOG} added role - ${roles}`);
          }).catch( async (err) => {
            console.log(`${TAG_LOG} setRoles error ${err}`);
          });

        }).catch( async (err) => {
          console.log(`${TAG_LOG} role findAll error ${err}`);
        });
      }
    );
    // end of bulkRole | setRoles

    response.ok(res, "user created");
  }).catch((err) => {
    console.log('user, tidak berhasil menambahkan data : ', err);
    response.err(res, err.message, 500);
  });
}

exports.user_show = async (req, res) => {
  const id = req.params.id;
  if (id) {
    await user.findOne({
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
      where: {
        id: id,
      },
       order: [
         ['id', 'DESC'],
       ],
       paranoid: false,
    }).then((users) => {
      const resData = {
        users: users,
      };
      response.ok(res, "load user data", resData);
    }).catch((err) => {
      console.log('user_show findOne error : ', err);
      response.err(res, err.message, 500);
    });
  } else {
    const { page, size, sort, keyword } = req.query;
    var condition =  {
      full_name: {
        [Op.like]: Sequelize.literal(`\'%${keyword}%\'`)
      }
    };
    const { limit, offset } = pagination.getPagination(page, size);
    const exclude_admin_role = 'superadmin';

    var sortInit = sort;
    if (!sortInit)
       sortInit = 'ASC';

    await user.findAndCountAll({
       include: [
         {
            model : role,
            through: {attributes: []},
            // attributes:[ 'name'], // custom
            where: {
              name: {
                [Op.notLike]: Sequelize.literal(`\'%${exclude_admin_role}%\'`)
              }
            },
            include: [
              {
                model: ability,
                through: {attributes: []},
                // attributes:[ 'action', 'subject' ], // custom
              }
            ]
          },
       ],
       where: keyword ? condition : null,
       limit, offset,
       // paranoid: false,
       order: [
          ['id', `${sortInit}`],
       ],
    })
    .then( async (users) => {
      const resData = pagination.getPagingData(users, page, limit, 'users');
      response.ok(res, "load users data", resData);
    }).catch((err) => {
      console.log('user_show findAll error : ', err);
      response.err(res, err.message, 500);
    });
  }
};

exports.user_update = async (req, res) => {
  // LOCK DATA TO CHANGE
  const id = req.params.id;

  const TAG_LOG = `user_update`;
  console.log(`\n\n\n\n${TAG_LOG} onStart\n`);

  // CHANGE PASSWORD
  if (req.body.new_password) {
    await user.update({
      password: bcrypt.hashSync(req.body.new_password, 8),
    }, {
      where: {
        id: id
      }
    }).then((user) => {
      console.log(`${TAG_LOG} password change... ${user}`)
    }).catch((err) => {
      console.log('user password, tidak berhasil mengubah data', err);
    });
  }
  // END OF CHANGE PASSWORD

  // CHANGE ALL DATA USER
  await user.update({
    full_name: req.body.full_name,
    // username: req.body.username,
    phone: req.body.phone,
    email: req.body.email,
  }, {
    where: {
      id: id
    }
  }).then( async (user) => {
    console.log(`${TAG_LOG} data change... ${user}`)
    response.ok(res, "user, berhasil mengubah data", 1);
  }).catch((err) => {
    console.log('user, tidak berhasil mengubah data', err);
    response.err(res, err.message, 500);
  });
  // END OF CHANGE ALL DATA USER

}

exports.user_delete = async (req, res) => {
  const id = req.params.id;
  const flag = req.params.flag;

  if (flag == 2) {
    await user.restore();
    var msg = "user restore deleted";
    return response.ok(res, msg, 1);
  }

  await user.destroy({
    where: {
      id: id
    },
    force: flag == 1 ? true : false, // hard delete
  }).then((user) => {
    var msg = flag == 0 ? "user, berhasil menghapus data" : "user, berhasil menghapus data secara permanen";
    response.ok(res, msg, 1);
  }).catch((err) => {
    console.log('user, tidak berhasil menghapus data', err);
    response.err(res, err.message, 500);
  });
}

exports.user_upload_image_update = async (req, res) => {
  const id = req.params.id;

  console.log(req.file.mimetype);
  console.log(req.file.originalname);
  const mimetype = req.file.mimetype;
  if (mimetype == "image/jpeg" || mimetype == "image/png" || mimetype == "application/octet-stream") {
      fs.writeFileSync(
        __basedir + "/resources/static/assets/tmp/" + req.file.filename,
      fs.readFileSync(
            __basedir + "/resources/static/assets/uploads/" + req.file.filename
        )
      );
      await user.update({
        avatar: req.file.originalname,
      }, {
        where: {
          id: id
        }
      }).then( async (user) => {

        response.ok(res, "user, berhasil mengubah data", 1);
      }).catch((err) => {
        console.log('user, tidak berhasil mengubah data', err);
      });
  } else {
    const msg = "mimetype not valid : " + mimetype;
    response.err(res, msg, 401);
  }
};

exports.user_whoisme = async (req, res) => {
  console.log("\ncalled\n");
  let token = req.headers["x-access-token"];

  if (!token) {
    return response.err(res, "No token provided!", 403);
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return response.err(res, "Unauthorized!", 401);
    }
    const myId = decoded.id;

     user.findOne({
      where: {
        id: myId,
      },
      include: [
        {
          model : role,
          through: {attributes: []},
          // attributes:[ 'name'], // custom
          include: [
            {
              model: ability,
              through: {attributes: []},
              // attributes:[ 'action', 'subject' ], // custom
            }
          ]
        },
      ],
  }).then( async (user) => {
      if (!user) {
        return response.err(res, "User Not found.", 404);
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration
      });
      let refreshToken = await refresh_token.createToken(user);
      var authorities = [];
      const resData = {
        userData: user,
        // roles: authorities,
        accessToken: token,
        refreshToken: refreshToken
      };
      response.ok(res, "Whoisme!", resData);
    });
  });
};