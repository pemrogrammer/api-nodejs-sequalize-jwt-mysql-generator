#!/bin/bash
# https://archlinux.org/packages/extra/any/cowsay/files/
PROC_PID=$!

# UTILS .
export RED=$(tput setaf 1 :-"" 2>/dev/null)
export GREEN=$(tput setaf 2 :-"" 2>/dev/null)
export YELLOW=$(tput setaf 3 :-"" 2>/dev/null)
export BLUE=$(tput setaf 4 :-"" 2>/dev/null)
export RESET=$(tput sgr0 :-"" 2>/dev/null)

echo $BLUE; printf -- "-%.0s" $(seq $(tput cols)); echo $RESET

fortune | cowsay -f tux "NodeJS Sequelize with JWT Auth

versi 1.0.0

GENERATOR CRUD by @yogithesymbian

TIP : " # TODO print random tip from an array
# maybe about shortcut, extension vscode, or any tricks

echo $BLUE; printf -- "-%.0s" $(seq $(tput cols)); echo $RESET

PS3='Please enter your choice: '
options=(
  "-----------------------"
  "generate migration, model, controller & router"
  "generate seeder"
  "-----------------------"
  "migrate fresh seed"
  "import view.sql"
  "npx sequelize-cli db:migrate"
  "npx sequelize-cli db:seed:all"
  "DROP DATABASE"
  "--------SERVER---------"
  "RESTART SERVICE NODEJS"
  "JOURNAL SERVICE NODEJS"
  "show http listen"
  "Quit"
)
select opt in "${options[@]}"
do
    case $opt in
        "generate migration, model, controller & router")
            CURRENTEPOCTIME=`date +"%Y%m%d%H%M%S"`
            echo $BLUE; printf -- "-%.0s" $(seq $(tput cols)); echo $RESET
            echo 'Processing Generate model ...
                  deliver to (./src/db/models/)'
            echo
            echo 'Processing Generate migration ...
                  deliver to (./src/db/migrations/)'
            echo
            echo 'example   : ' $GREEN 'book' $RESET
            # MODEL NAME I/O
            read -p 'Please enter your model_name: ' MODEL_NAME

            echo

            cowsay -f tux  '(1) now ... if you have relation lets type and enter.

            for next relation just type and enter again

            TIP : relations is equal to associate, CTRL + D for next command
            '

            # ASSOCIATE I/O
            while read -p 'input relations model_name : ' line
            do
                yo_associate=("${yo_associate[@]}" $line)
            done

            for i in ${!yo_associate[@]}; do

              # .src/db/migrations/*.js
              yo_associate_code_in_migration+=("
                ${yo_associate[$i]}_id: {
                  type: Sequelize.INTEGER,
                  allowNull: false,
                  references: {
                    model: '"${yo_associate[$i]}"s',
                    key: "'id'"
                  },
                  onDelete: "'CASCADE'"
                },
              ")

              # ./src/db/models/*.js
              yo_associate_code_model+=("
                models.${MODEL_NAME}.belongsTo(models.${yo_associate[$i]}, {
                  foreignKey: '"${yo_associate[$i]}"_id',
                  constraint: false,
                });
              ")

              # ./src/db/models/*.js
              # usually FK is INTEGER | BIGINT
              yo_associate_code_model_init+=("
                ${yo_associate[$i]}_id: DataTypes.INTEGER,
              ")

              # .src/controllers/*.js , AS MODEL DEFINE
              yo_associate_code_in_controller_define+=("
                ${yo_associate[$i]},
              ")

              # .src/controllers/*.js , AS REQUEST + VALIDATION #TODO make a pattern into repositroy for more clean
              yo_associate_code_in_controller_request+=("
                ${yo_associate[$i]}_id: req.body.${yo_associate[$i]}_id,
              ")
            done

            # FIELD | COLUMN OF TABLE I/O
            echo

            cowsay -f tux  '(2) now ... you need to define column table

            in this version, we only define string type of these output code
            search #TODO to see any code for enhancement.

            TIP : we have present snippet on .vscode for column with any type
            '

            while read -p 'input column of model_name : ' line
            do
                yo_model_column=("${yo_model_column[@]}" $line)
            done

            for i in ${!yo_model_column[@]}; do

              # .src/db/migrations/*.js
              #TODO flexible on data type
              yo_model_column_code_in_migration+=("
                ${yo_model_column[$i]}: {
                  type: Sequelize.STRING
                },
              ")

              # ./src/db/models/*.js
              #TODO flexible on data type
              yo_model_column_code_in_model+=("
                ${yo_model_column[$i]}: DataTypes.STRING,
              ")

              # .src/controllers/*.js , AS REQUEST + VALIDATION #TODO make a pattern into repositroy for more clean
              yo_model_column_code_in_controller_request+=("
                ${yo_model_column[$i]}: req.body.${yo_model_column[$i]},
              ")

            done
# GENERATE MODEL
            echo '
"use strict";
const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class '${MODEL_NAME}' extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      '${yo_associate_code_model[@]}'
    }
  };
  '${MODEL_NAME}'.init({
    '${yo_associate_code_model_init[@]}'
    '${yo_model_column_code_in_model[@]}'
    // code here
  }, {
    sequelize,
    modelName: "'${MODEL_NAME}'",
    paranoid: true,
    underscored: true,
  });
  return '${MODEL_NAME}';
};
            ' > "./src/db/models/${MODEL_NAME}.js"

# GENERATE MIGRATION
            echo '
"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("'${MODEL_NAME}s'", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // FK
      '${yo_associate_code_in_migration[@]}'

      // COLUMN
      '${yo_model_column_code_in_migration[@]}'

      // code here
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("'${MODEL_NAME}s'");
  }
};
            ' > "./src/db/migrations/${CURRENTEPOCTIME}-create-${MODEL_NAME}.js"

# GENERATE CONTROLLER
            echo '
var pagination = require("@utils/pagination");
var response = require("@utils/res");

const {
    Sequelize,
    '${MODEL_NAME}',

    // ASSOCIATE DEFINE
    '${yo_associate_code_in_controller_define[@]}'
 } = require("@db/models");

// TODO REMOVE OLD CODE || not flexible
// const {
//     data_master
// } = require("./data_master.controller");

const { Op } = require("sequelize")

exports.'${MODEL_NAME}'_create = async (req, res) => {
  // const my_id = req.user_id; // FROM MIDDLEWARE NEXT() // TODO IF THERE IS ANY FK WITH USER_ID COMMNENT THE CODE ELSE !
  await '${MODEL_NAME}'.create({
    // user_id: my_id,
    // ASSOCIATE AS REQUEST || VALIDATION
    '${yo_associate_code_in_controller_request[@]}'

    // COLUMN
    '${yo_model_column_code_in_controller_request[@]}'
  }).then(('${MODEL_NAME}') => {
    response.ok(res, "'${MODEL_NAME}', berhasil menambahkan data", 1);
  }).catch((err) => {
    console.log("'${MODEL_NAME}', tidak berhasil menambahkan data", 1);
    response.err(res, err.message, 500);
  });
}

exports.'${MODEL_NAME}'_show = async (req, res) => {
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
    await '${MODEL_NAME}'.findOne({
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
    }).then(('${MODEL_NAME}'s) => {
      const resData = {
        '${MODEL_NAME}'s: '${MODEL_NAME}'s,
      };
      response.ok(res, "load '${MODEL_NAME}' data", resData, dataMaster);
    }).catch((err) => {
      console.log("'${MODEL_NAME}'_show findOne error : ", err);
      response.err(res, err.message, 500);
    });
  } else {
    const { limit, offset } = pagination.getPagination(page, size);

    var sortInit = sort;
    if (!sortInit)
       sortInit = "ASC";

    await '${MODEL_NAME}'.findAndCountAll({
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
    .then( async ('${MODEL_NAME}'s) => {
      // TODO REMOVE OLD CODE || not flexible
      // var data = [];
      // if ('${MODEL_NAME}'s.rows[0]) {
      //   '${MODEL_NAME}'s.rows.forEach(element => { // filtering by short_name
      //     if (element.user.departments[0].secret_program != null) {
      //       data.push(element);
      //     }
      //   });
      // }
      // '${MODEL_NAME}'s.rows = data;
      var resData = pagination.getPagingData('${MODEL_NAME}'s, page, limit, "'${MODEL_NAME}'s");
      response.ok(res, "load '${MODEL_NAME}'s data", resData, dataMaster);
    }).catch((err) => {
      console.log("'${MODEL_NAME}'_show findAll error : ", err);
      response.err(res, err.message, 500);
    });
  }
};

exports.'${MODEL_NAME}'_update = async (req, res) => {
  const id = req.params.id;
  // const my_id = req.user_id; // FROM MIDDLEW NEXT() // TODO IF THERE IS ANY FK WITH USER_ID COMMNENT THE CODE ELSE !
  await '${MODEL_NAME}'.update({
    // user_id: my_id,
    // ASSOCIATE AS REQUEST || VALIDATION
    '${yo_associate_code_in_controller_request[@]}'

    // COLUMN
    '${yo_model_column_code_in_controller_request[@]}'
  }, {
    where: {
      id: id
    }
  }).then(('${MODEL_NAME}') => {
    response.ok(res, "'${MODEL_NAME}', berhasil mengubah data", 1);
  }).catch((err) => {
    console.log("'${MODEL_NAME}', tidak berhasil mengubah data :", err);
    response.err(res, err.message, 500);
  });
}

exports.'${MODEL_NAME}'_delete = async (req, res) => {
  const id = req.params.id; // {id}/{flag}
  const flag = req.params.flag; // {id}/{flag}

  if (flag == 2) {
    await '${MODEL_NAME}'.restore();
    var msg = "'${MODEL_NAME}' restore deleted";
    return response.ok(res, msg, 1);
  }

  await '${MODEL_NAME}'.destroy({
    where: {
      id: id
    },
    force: flag == 1 ? true : false, // hard delete true|1
  }).then(('${MODEL_NAME}') => {
    var msg = flag == 0 ? "'${MODEL_NAME}', berhasil menghapus data" : "'${MODEL_NAME}', berhasil menghapus data secara permanen";
    response.ok(res, msg, 1);
  }).catch((err) => {
    console.log("'${MODEL_NAME}' deleted error :", err);
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
//   '${MODEL_NAME}'_export
// } = require("../export/'${MODEL_NAME}'_export.controller");

// exports.'${MODEL_NAME}'_submit_show = async (req, res) => {
//   const generateAndGetFileName = await '${MODEL_NAME}'_export(req, res);
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
            ' > "./src/controllers/${MODEL_NAME}.controller.js"

# GENERATE ROUTER
            echo '
const { authJwt } = require("@middleware");
const controller = require("@controllers/'${MODEL_NAME}'.controller");


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
  app.get("/api/'${MODEL_NAME}'",
    [authJwt.verifyToken],
    controller.'${MODEL_NAME}'_show
  );

  // findOne
  app.get("/api/'${MODEL_NAME}'/:id",
    [authJwt.verifyToken],
    controller.'${MODEL_NAME}'_show
  );

  // create
  app.post("/api/'${MODEL_NAME}'",
    [authJwt.verifyToken],
    controller.'${MODEL_NAME}'_create
  );

  // update
  app.put("/api/'${MODEL_NAME}'/:id",
    [authJwt.verifyToken],
    controller.'${MODEL_NAME}'_update
  );

  // delete
  app.delete("/api/'${MODEL_NAME}'/:id/:flag",
    [authJwt.verifyToken],
    controller.'${MODEL_NAME}'_delete
  );
  // // submit
  // app.get("/api/'${MODEL_NAME}'/submit/excel",
  //   [authJwt.verifyToken],
  //   controller.'${MODEL_NAME}'_submit_show
  // );
};

            ' > "./src/routes/${MODEL_NAME}.routes.js"

            echo $GREEN; printf -- "-%.0s" $(seq $(tput cols)); echo $RESET

            echo $BLUE 'CRUD ALREADY CREATED' $RESET
            echo '// SHOW ALL -> GET    : /api/'${MODEL_NAME}'' $RESET
            echo '// FIND ONE -> GET    : /api/'${MODEL_NAME}'/:id' $RESET
            echo '// CREATE   -> POST   : /api/'${MODEL_NAME}'' $RESET
            echo '// UPDATE   -> PUT    : /api/'${MODEL_NAME}'/:id' $RESET
            echo '// DELETE   -> DELETE : /api/'${MODEL_NAME}'/:id/:flag' $RESET

            echo $BLUE '* SELAMAT, GRATS & AWESOME *' $RESET

            cowthink -f kiss 'asd'

            echo $GREEN; printf -- "-%.0s" $(seq $(tput cols)); echo $RESET


            echo "PID : '${PROC_PID}'"
            read -p 'you are awesome (r) for recall (any) for exit : ' action

            if [ "$action" = "r" ]; then
                ./yo-coregen.sh
            else
                # kill -9 PROC_PID
                # break
                exit
            fi
            ;;
        "generate seeder")
            CURRENTEPOCTIME=`date +"%Y%m%d%H%M%S"`
            read -p 'Please enter your model(+s/db) : : ' MODEL_NAME
            read -p 'Please enter Number of Daftar Table (secret_table_id) : : ' secret_NUMBER
            echo "
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const secret_table_id = ${secret_NUMBER};
    const user_id = 2;

    return await queryInterface.bulkInsert('${MODEL_NAME}', [
     {
        id: 1,
        secret_table_id: secret_table_id,
        user_id: user_id,
        // data_master_ドセン_id: 1,
        // code here
        created_at: new Date(),
        updated_at: new Date()
     },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
     return await queryInterface.bulkDelete('${MODEL_NAME}', null, {});
  }
};
            " > "./src/db/seeders/$CURRENTEPOCTIME-demo-${MODEL_NAME}.js"
            ./yo-coregen.sh
            ;;
        "migrate fresh seed")
            npm run db:reset
            ./yo-coregen.sh
            ;;
        "import view.sql")
            read -p 'Please enter your db_name : : ' db_name
            read -p 'Please enter your username : : ' user_name
            read -p 'Please enter your password : : ' password
            mysql -v -u$user_name -p$password $db_name < view.sql
            mysql -v -u$user_name -p$password $db_name < view_calculation.sql
            ;;
        "npx sequelize-cli db:migrate")
            npx sequelize-cli db:migrate
            ./yo-coregen.sh
            ;;
        "npx sequelize-cli db:seed:all")
            npx sequelize-cli db:seed:all
            ./yo-coregen.sh
            ;;
        "DROP DATABASE")
            npm run db:erase
            ./yo-coregen.sh
            ;;
        "RESTART SERVICE NODEJS") # node-yo-2
            read -p 'Please enter your process name : : ' NAME_PROCESS
            sudo systemctl restart $NAME_PROCESS
            ./yo-coregen.sh
            ;;
        "JOURNAL SERVICE NODEJS") # node-yo-2
            read -p 'Please enter your process name : : ' NAME_PROCESS
            sudo journalctl -u $NAME_PROCESS -n 100 --no-pager
            ./yo-coregen.sh
            ;;
        "show http listen")
            read -p 'Please enter your port : : ' PORT
            lsof -n -i4TCP:$PORT
            read -p 'if you want to kill, enter the PID (q: to break, r: recall): : ' PID
            if [ $PID == 'q' ]
            then
              break;

            elif [ $PID == 'r' ]
            then
              ./yo-coregen.sh

            else
              echo "killing $PID"
              kill -9 $PID
            fi
            ./yo-coregen.sh
            ;;
        "Quit")
            break
            ;;
        *) echo "invalid option $REPLY";;
    esac
done
