
var pagination = require("@utils/pagination");
var response = require("@utils/res");

const {
    Sequelize,
    company,

    // ASSOCIATE DEFINE
     user,
 } = require("@db/models");

// TODO REMOVE OLD CODE || not flexible
// const {
//     data_master
// } = require("./data_master.controller");

const { Op } = require("sequelize")

exports.company_create = async (req, res) => {
  // const my_id = req.user_id; // FROM MIDDLEWARE NEXT() // TODO IF THERE IS ANY FK WITH USER_ID COMMNENT THE CODE ELSE !
  await company.create({
    // user_id: my_id,
    // ASSOCIATE AS REQUEST || VALIDATION
     user_id: req.body.user_id,

    // COLUMN
     name: req.body.name,
  }).then((company) => {
    response.ok(res, "company, berhasil menambahkan data", 1);
  }).catch((err) => {
    console.log("company, tidak berhasil menambahkan data", 1);
    response.err(res, err.message, 500);
  });
}

exports.company_show = async (req, res) => {
  const id = req.params.id;
  const { page, size, sort, search } = req.query;

  // TODO REMOVE OLD CODE || not flexible
  // --- data master #TODO REDIS
  // const dataMaster = {
  //  dataMaster: await data_master(yo_table_id),
  // };
  // --- end of data master #TODO REDIS

  if (id) {
    await company.findOne({
      // TODO REMOVE OLD CODE || not flexible
      // include: [
      //   {
      //     model: secret_table,
      //     attributes: ["id", "sc"],
      //   },
      //   {
      //     model: user,
      //     attributes: ["id", "full_name", "phone", "email"],
      //     include: [
      //       {
      //         model: secret_profile,
      //         attributes: [
      //           "id", "email", "no_telp",
      //         ],
      //       },
      //       {
      //         model: secret,
      //         attributes: ["id", "secret_studi", "secret_profile_id"],
      //         through: {attributes: []},
      //         include: [
      //           {
      //             model: secret_profile,
      //             attributes: ["id", "short_name"],
      //             required: false,
      //           }
      //         ]
      //       }
      //     ]
      //   }
      // ],
      where: {
        id: id
      },
       // paranoid: false, // This will also retrieve soft-deleted records
    }).then((companys) => {
      const resData = {
        companys: companys,
      };
      response.ok(res, "load company data", resData, dataMaster);
    }).catch((err) => {
      console.log("company_show findOne error : ", err);
      response.err(res, err.message, 500);
    });
  } else {
    const { limit, offset } = pagination.getPagination(page, size);

    var sortInit = sort;
    if (!sortInit)
       sortInit = "ASC";

    await company.findAndCountAll({
      // TODO REMOVE OLD CODE || not flexible
      // include: [
      //   {
      //     model: secret_table,
      //     attributes: ["id", "sc"],
      //     where: {
      //       sc: `${sc}`
      //     }
      //   },
      //   {
      //     model: user,
      //     attributes: ["id", "full_name", "phone", "email"],
      //     include: [
      //       {
      //         model: secret_profile,
      //         attributes: [
      //           "id", "email", "no_telp",
      //         ],
      //         where: {
      //           ts: `${ts}`
      //         }
      //       },
      //       {
      //         model: secret,
      //         attributes: ["id", "secret_studi", "secret_profile_id"],
      //         through: {attributes: []},
      //         where: secret_studi ? { secret_studi: `${secret_studi}` } : null,
      //         include: [
      //           {
      //             model: secret_program,
      //             attributes: ["id", "secret_program", "short_name"],
      //             where: short_name ? { short_name: `${short_name}` } : null,
      //             required: false,
      //           }
      //         ]
      //       }
      //     ]
      //   }
      // ],
      // where: name ? condition : null,
      limit, offset,
      //paranoid: false, // This will also retrieve soft-deleted records
      order: [
          ["id", `${sortInit}`],
      ],
    })
    .then( async (companys) => {
      // TODO REMOVE OLD CODE || not flexible
      // var data = [];
      // if (companys.rows[0]) {
      //   companys.rows.forEach(element => { // filtering by short_name
      //     if (element.user.departments[0].secret_program != null) {
      //       data.push(element);
      //     }
      //   });
      // }
      // companys.rows = data;
      var resData = pagination.getPagingData(companys, page, limit, "companys");
      response.ok(res, "load companys data", resData, dataMaster);
    }).catch((err) => {
      console.log("company_show findAll error : ", err);
      response.err(res, err.message, 500);
    });
  }
};

exports.company_update = async (req, res) => {
  const id = req.params.id;
  // const my_id = req.user_id; // FROM MIDDLEW NEXT() // TODO IF THERE IS ANY FK WITH USER_ID COMMNENT THE CODE ELSE !
  await company.update({
    // user_id: my_id,
    // ASSOCIATE AS REQUEST || VALIDATION
     user_id: req.body.user_id,

    // COLUMN
     name: req.body.name,
  }, {
    where: {
      id: id
    }
  }).then((company) => {
    response.ok(res, "company, berhasil mengubah data", 1);
  }).catch((err) => {
    console.log("company, tidak berhasil mengubah data :", err);
    response.err(res, err.message, 500);
  });
}

exports.company_delete = async (req, res) => {
  const id = req.params.id; // {id}/{flag}
  const flag = req.params.flag; // {id}/{flag}

  if (flag == 2) {
    await company.restore();
    var msg = "company restore deleted";
    return response.ok(res, msg, 1);
  }

  await company.destroy({
    where: {
      id: id
    },
    force: flag == 1 ? true : false, // hard delete true|1
  }).then((company) => {
    var msg = flag == 0 ? "company, berhasil menghapus data" : "company, berhasil menghapus data secara permanen";
    response.ok(res, msg, 1);
  }).catch((err) => {
    console.log("company deleted error :", err);
    response.err(res, err.message, 500);
  });
}

// #TODO REMOVE OLD CODE || not flexible
// // for EXCEL
// // update link file
// const {
//   secret_table_file_excel_update,
//   secret_table_auto_update
// } = require("./secret_table.controller");

// // generate per criteria
// const {
//   company_export
// } = require("../export/company_export.controller");

// exports.company_submit_show = async (req, res) => {
//   const generateAndGetFileName = await company_export(req, res);
//   if (generateAndGetFileName) { // generate excel file success
//     req.params.id = req.query.secret_table_id; // override update :id for secret table
//     req.body.link_file_excel = generateAndGetFileName; // override raw body for secret table
//     const storeLinkFile = await secret_table_file_excel_update(req, res) // store link file
//     if (storeLinkFile) {
//       req.body.status = "Secret";
//       const changeStatus = await secret_table_auto_update(req, res);
//       if (changeStatus) {
//         response.ok(res, `berhasil mengubah status pengisian`, 1);
//       } else {
//         response.err(err, `tidak berhasil mengubah status pengisian`, 500);
//       }
//     } else {
//       response.err(err, `terjadi kesalahan dalam proses membuat file`, 500);
//     }
//   } else {
//     response.err(err, `tidak berhasil melakukan pengiriman data ke server`, 500);
//   }
// };
