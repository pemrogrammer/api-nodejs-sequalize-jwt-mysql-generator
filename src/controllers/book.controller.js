
var pagination = require("@utils/pagination");
var response = require("@utils/res");

const {
    Sequelize,
    book,

    // ASSOCIATE DEFINE
    
 } = require("@db/models");

// TODO REMOVE OLD CODE || not flexible
// const {
//     data_master
// } = require("./data_master.controller");

const { Op } = require("sequelize")

exports.book_create = async (req, res) => {
  // const my_id = req.user_id; // FROM MIDDLEWARE NEXT() // TODO IF THERE IS ANY FK WITH USER_ID COMMNENT THE CODE ELSE !
  await book.create({
    // user_id: my_id,
    // ASSOCIATE AS REQUEST || VALIDATION
    

    // COLUMN
    
  }).then((book) => {
    response.ok(res, "book, berhasil menambahkan data", 1);
  }).catch((err) => {
    console.log("book, tidak berhasil menambahkan data", 1);
    response.err(res, err.message, 500);
  });
}

exports.book_show = async (req, res) => {
  const id = req.params.id;
  const { page, size, sort, search } = req.query;

  // TODO REMOVE OLD CODE || not flexible
  const dataMaster = "";
  // --- data master #TODO REDIS
  // const dataMaster = {
  //  dataMaster: await data_master(yo_table_id),
  // };
  // --- end of data master #TODO REDIS

  if (id) {
    await book.findOne({
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
    }).then((books) => {
      const resData = {
        books: books,
      };
      response.ok(res, "load book data", resData, dataMaster);
    }).catch((err) => {
      console.log("book_show findOne error : ", err);
      response.err(res, err.message, 500);
    });
  } else {
    const { limit, offset } = pagination.getPagination(page, size);

    var sortInit = sort;
    if (!sortInit)
       sortInit = "ASC";

    await book.findAndCountAll({
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
    .then( async (books) => {
      // TODO REMOVE OLD CODE || not flexible
      // var data = [];
      // if (books.rows[0]) {
      //   books.rows.forEach(element => { // filtering by short_name
      //     if (element.user.departments[0].secret_program != null) {
      //       data.push(element);
      //     }
      //   });
      // }
      // books.rows = data;
      var resData = pagination.getPagingData(books, page, limit, "books");
      response.ok(res, "load books data", resData, dataMaster);
    }).catch((err) => {
      console.log("book_show findAll error : ", err);
      response.err(res, err.message, 500);
    });
  }
};

exports.book_update = async (req, res) => {
  const id = req.params.id;
  // const my_id = req.user_id; // FROM MIDDLEW NEXT() // TODO IF THERE IS ANY FK WITH USER_ID COMMNENT THE CODE ELSE !
  await book.update({
    // user_id: my_id,
    // ASSOCIATE AS REQUEST || VALIDATION
    

    // COLUMN
    
  }, {
    where: {
      id: id
    }
  }).then((book) => {
    response.ok(res, "book, berhasil mengubah data", 1);
  }).catch((err) => {
    console.log("book, tidak berhasil mengubah data :", err);
    response.err(res, err.message, 500);
  });
}

exports.book_delete = async (req, res) => {
  const id = req.params.id; // {id}/{flag}
  const flag = req.params.flag; // {id}/{flag}

  if (flag == 2) {
    await book.restore();
    var msg = "book restore deleted";
    return response.ok(res, msg, 1);
  }

  await book.destroy({
    where: {
      id: id
    },
    force: flag == 1 ? true : false, // hard delete true|1
  }).then((book) => {
    var msg = flag == 0 ? "book, berhasil menghapus data" : "book, berhasil menghapus data secara permanen";
    response.ok(res, msg, 1);
  }).catch((err) => {
    console.log("book deleted error :", err);
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
//   book_export
// } = require("../export/book_export.controller");

// exports.book_submit_show = async (req, res) => {
//   const generateAndGetFileName = await book_export(req, res);
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
            
