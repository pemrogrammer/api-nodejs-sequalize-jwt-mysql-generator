const multer = require("multer");

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

var imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/resources/static/assets/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
    // cb(null, `${Date.now()}-imt-${file.originalname}`);
  },
});

const excelFilter = (req, file, cb) => {
  if (
    file.mimetype.includes("excel") ||
    file.mimetype.includes("spreadsheetml") ||
    file.mimetype.includes("application/vnd.ms-excel") ||
    file.mimetype.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")

  ) {
    cb(null, true);
  } else {
    cb("Please upload only excel file.", false);
  }
};

var excelStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/resources/static/assets/excel/");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

const csvFilter = (req, file, cb) => {
  if (
    file.mimetype.includes("text/csv")
  ) {
    cb(null, true);
  } else {
    cb("Please upload only excel file.", false);
  }
};

var csvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/resources/static/assets/csv/");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});


var isImage = multer({ storage: imageStorage, fileFilter: imageFilter });
var isExcel = multer({ storage: excelStorage, fileFilter: excelFilter });
var isCsv = multer({ storage: csvStorage, fileFilter: csvFilter });

const uploadFile = {
  isImage: isImage,
  isExcel: isExcel,
  isCsv: isCsv,
}
module.exports = uploadFile;