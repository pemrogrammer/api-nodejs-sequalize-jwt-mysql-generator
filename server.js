require('module-alias/register')
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;
// const http2 = require('http2');

// ------------------------------ global variable ------------------------------
global.__basedir = __dirname;
// ------------------------------ CONSTANTA
require("./core/constanta");

// ------------------------------ UTILITIES
global.moment = require('moment-timezone');
moment().locale("id");
moment().tz("Asia/Makassar").format(); // should use UTC default, if your apps plains to global location

// ------------------------------ END OF global variable ----------------------


// ------------------------------ LISTENING & CONFIGURATION -------------------
// var corsOptions = {
//   origin: "*",
//   optionsSuccessStatus: 200,
// };

app.use(cors()); // app.use(cors(corsOptions));
app.use(bodyParser.json({limit: "50mb"})); // parse requests of content-type - application/json
app.use(bodyParser.urlencoded({ // increase if you have payload to large 304 || increase your type database
  limit: "50mb", extended: true,
  parameterLimit:50000
}));


// ------------------------------ LOAD ALL MODEL
const db = require("./src/db/models");
db.sequelize.sync().then((req) => { });


// ------------------------------ AUTO REGISTER , ROUTING
const routeCores = require("./src/routes/core");
const routes = require("./src/routes");

for (const [key, value] of routeCores.entries()) {
  require(`${value}`)(app);
}

for (const [key, value] of routes.entries()) {
  require(`${value}`)(app);
}

// ------------------------------ DEFAULT
app.get("/", (req, res) => {
  res.json({ message: "Welcome to API NODEJS SEQUELIZE MYSQL 2022 application." });
});
// ------------------------------ END OF AUTO REGISTER ROUTING -----------------


// ------------------------------ STORAGE LINK ----------------------------------
// ------------------------------ ACCESS DIRECTORY http://domain.com/directory/fike.any
app.use(express.static(__dirname + '/resources/static/assets/tmp'));
app.use(express.static(__dirname + '/resources/static/assets/excel'));
app.use(express.static(__dirname + '/resources/static/assets/uploads'));
app.use(express.static(__dirname + '/resources/static/assets/pdf'));
// ------------------------------ END OF STORAGE LINK -------------------------


// ------------------------------ START LISTENING ------------------------------
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`); // in case if you have built a services in systemd with other port, this port would be override instead of on server.js
  console.log('run mode on : ', process.env.NODE_ENV);
});
// ------------------------------ END OF START LISTENING -----------------------