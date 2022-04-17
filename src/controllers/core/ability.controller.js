var pagination = require("@utils/pagination");
var response = require("@utils/res");
const {
     Sequelize, ability,
 } = require("@db/models");
const Op = Sequelize.Op;

exports.ability_show = async (req, res) => {
  const id = req.params.id;
  if (id) {
    await ability.findOne({
      where: {
        id: id
      },
      // attributes: { // override show data
      //  exclude: ['full_name']
      //},
      // attributes: ['full_name'], // override show data
       order: [
         ['id', 'DESC'],
       ],
       // paranoid: false, // This will also retrieve soft-deleted records
    }).then((abilitys) => {
      const resData = {
        abilitys: abilitys,
      };
      response.ok(res, "load ability data", resData);
    }).catch((err) => {
      console.log('ability_show findOne error : ', err);
      response.err(res, err.message, 500);
    });
  } else {
    const { page, size, sort, title } = req.query;
    // var condition =  { name: 'captain' };
    const { limit, offset } = pagination.getPagination(page, size);

    var sortInit = sort;
    if (!sortInit)
       sortInit = 'ASC';

    await ability.findAndCountAll({
       // include: user,
       // where: condition,
       limit, offset,
       // paranoid: false, // This will also retrieve soft-deleted records
       order: [
          ['id', `${sortInit}`],
       ],

    })
    .then( async (abilitys) => {
      const resData = pagination.getPagingData(abilitys, page, limit, 'abilitys');
      response.ok(res, "load abilitys data", resData);
    }).catch((err) => {
      console.log('ability_show findAll error : ', err);
      response.err(res, err.message, 500);
    });
  }
};