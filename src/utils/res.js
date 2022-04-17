"use strict";

// TODO i18n

exports.ok = function (res, msg, data, dataMaster, calculation) {
  var data = {
    success: true,
    message: msg,
    ...dataMaster, // if you have data master
    ...calculation, // if you have optional.
    ...data, // main of data
  };
  res.status(res.statusCode).send(data);
};
exports.err = function (res, msg, error_code) {
  var data = {
    success: false,
    message: msg,
    error_code: error_code,
  };
  res.status(error_code).send(data);
};
