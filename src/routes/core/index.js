const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

const routes = [];

fs
  .readdirSync(__dirname)
  .filter(file => { // every name end with .routes.js
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const route = `${path.join(__dirname, file)}`;
    routes.push(route);
  });

module.exports = routes;