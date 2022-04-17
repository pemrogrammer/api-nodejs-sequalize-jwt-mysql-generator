var pagination = require("@utils/pagination");
var response = require("@utils/res");
const { role, Sequelize } = require("@db/models");
const { Op } = require('sequelize')

exports.role_create = async (req, res) => {
  await role.create({
    name: req.body.name,
  }).then((role) => {

    response.ok(res, "role created");
  }).catch((err) => {
    console.log('role, tidak berhasil menambahkan data : ', err);
    response.err(res, err.message, 500);
  });
}

exports.role_show = async (req, res) => {
  const id = req.params.id;
  const exclude_admin_role = rolesJs.super_admin;
  console.log(`exclude_admin_role : ${exclude_admin_role}`);
  if (id) {
    await role.findOne({
      where: {
        id: id,
        name: {
          [Op.notLike]: Sequelize.literal(`\'%${exclude_admin_role}%\'`)
        }
      },
       order: [
         ['id', 'DESC'],
       ],
       // paranoid: false,
    }).then((roles) => {
      const resData = {
        roles: roles,
      };
      response.ok(res, "load role data", resData);
    }).catch((err) => {
      console.log('role_show findOne error : ', err);
      response.err(res, err.message, 500);
    });
  } else {
    const { page, size, title } = req.query;
    // var condition =  { name: 'captain' };
    const { limit, offset } = pagination.getPagination(page, size);

    await role.findAndCountAll({
       // include: user,
       // where: condition,
       where: {
        name: {
          [Op.notLike]: Sequelize.literal(`\'%${exclude_admin_role}%\'`)
        }
       },
       limit, offset,
       // paranoid: false,
       order: [
          ['id', 'DESC'],
       ],

    })
    .then( async (roles) => {
      const resData = pagination.getPagingData(roles, page, limit, 'roles');
      response.ok(res, "load roles data", resData);
    }).catch((err) => {
      console.log('role_show findAll error : ', err);
      response.err(res, err.message, 500);
    });
  }
};

exports.role_update = async (req, res) => {
  const id = req.params.id;
  await role.update({
    name: req.body.name,
  }, {
    where: {
      id: id
    }
  }).then((role) => {
    response.ok(res, "role, berhasil mengubah data", 1);
  }).catch((err) => {
    console.log('role, tidak berhasil mengubah data', err);
    response.err(res, err.message, 500);
  });
}

exports.role_delete = async (req, res) => {
  const id = req.params.id;
  const flag = req.params.flag;

  if (flag == 2) {
    await role.restore();
    var msg = "role restore deleted";
    return response.ok(res, msg, 1);
  }

  await role.destroy({
    where: {
      id: id
    },
    force: flag == 1 ? true : false, // hard delete true
  }).then((role) => {
    var msg = flag == 0 ? "role, berhasil menghapus data" : "role, berhasil menghapus data secara permanen";
    response.ok(res, msg, 1);
  }).catch((err) => {
    console.log('role, tidak berhasil menghapus data', err);
    response.err(res, err.message, 500);
  });
}