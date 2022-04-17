var response = require("@utils/res");
const excel = require("exceljs");
const { Op } = require('sequelize')
const { question } = require("@db/models");

exports.download_excel = async (req, res) => {
  let date1 = req.params.date1;
  let date2 = req.params.date2;

  date1 = moment(date1).format('yyyy-MM-D');
  date2 = moment(date2).add(1, 'days').format('yyyy-MM-D');
  await question.findAll({
      where: {
        created_at: {
          [Op.between]: [`${date1}`, `${date2}`],
        }
      }
    }).then( async (objs) => {
    let questions = [];

    await objs.forEach((obj) => {
      questions.push({
        id: obj.id,
        name: obj.name,
      });
    });

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("questions");

    worksheet.columns = [
      { header: "Id", key: "id", width: 5 },
      { header: "Title", key: "name", width: 25 },
    ];

    // Add Array Rows
    worksheet.addRows(questions);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + `${Date.now()}-bi-ngetrol-report.xlsx`
    );

    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  });
};