'use strict';

require('dotenv').config();
const path = require('path');

common = {
  path_models: require(path.resolve('src/db', 'models')),
};

module.exports = common;