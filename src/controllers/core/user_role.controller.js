var pagination = require("@utils/pagination");
var response = require("@utils/res");
const { user, user_role, role } = require("@db/models");

exports.clear_role = async (id, bulkRole, isHardDelete) => {
  // DELETE UN REQUEST ROLE IF !EXIST | EXIST
  var all_role_id = [];
  all_role_id.__proto__.remove = (n) => { all_role_id = all_role_id.flatMap((v) => { return v !== n ? v : []; }) };

  await user.findByPk(id).then(async(user) => {
    await user.getRoles({
      attributes: ['id'], // get data id only
    }).then(async(roles) => {
      roles.forEach(async(data) => {
        all_role_id.push(data.id);
      });
    });
  });

  bulkRole.forEach(async(data) => {
    all_role_id.remove(data.role_id);
  });

  var role_id_del = [];
  var user_id_del = [];

  all_role_id.forEach(async(data) => {
    role_id_del.push(data);
    user_id_del.push(id);
  });

  await user_role.destroy({
    where: {
      role_id: role_id_del,
      user_id: user_id_del
    },
    force: isHardDelete
  });
}

exports.user_update_role = async (req, res) => {
  const id = req.params.id;
  const bulkRole = req.body.roles;

  await this.clear_role(id, bulkRole, isHardDelete = true); // DELETE ROLE BY !ROLES

  // INSERT NEW or UPDATE HOOK BEFORE
  await user_role.beforeBulkCreate((userRoles, options) => {
    for (const user of userRoles) {
      user.helper_unique = `${user.role_id}${user.user_id}`;
    }
    if (options.updateOnDuplicate && !options.updateOnDuplicate.includes('helper_unique')) {
      options.updateOnDuplicate.push('helper_unique');
    }
  });

  // INSERT NEW or UPDATE on EXIST ROLE
  await user_role.bulkCreate(bulkRole, {
    updateOnDuplicate: ['role_id'],
    ignoreDuplicates: true
  }).then(async(result) => {
    console.log(`📗📗📗 result bulk create user_role ${result}`);
    response.ok(res, 'user updated role', 1);
  }).catch(async(err) => {
    console.log(`📕📕📕 result bulk create user_role err ${err}`);
    response.err(res, err.message, 500);
  });
}