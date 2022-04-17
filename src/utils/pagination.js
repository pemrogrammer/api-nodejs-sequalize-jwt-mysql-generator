"use strict";
// thanks for stackoverflow

exports.getPagination = function (page, size) {
  const limit = size ? +size : 15;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

exports.getPagingData = function (datas, page, limit, resName) {
  const { count: total_items, rows: results } = datas;
  const current_page = page ? +page : 0;
  const total_pages = Math.ceil(total_items / limit);

  return { total_items, [resName]: results, total_pages, current_page };
};
