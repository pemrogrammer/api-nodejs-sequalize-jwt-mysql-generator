// TODO MULTIPLE DATABASE
// TODO OTHER DRIVE DATABASE
const fs = require('fs');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint } = format;

const logger = createLogger({
  format: combine(
    // label({ label: 'right meow!' }),
    timestamp(),
    format.splat(),
    prettyPrint(),
  ),
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
    new transports.Console(),
    ]
})

module.exports = {
  development: {
    username: process.env.DEV_DB_USERNAME,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DB_NAME,
    host: process.env.DEV_DB_HOSTNAME,
    port: process.env.DEV_DB_PORT,
    dialect: 'mysql',
    logging: (msg) => logger.info(msg),
    dialectOptions: {
      bigNumberStrings: true,
      useUTC: false
    },
    timezone: "+08:00",
    // OVERRIDE CORE NAME
    define : {
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at"
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  test: {
    username: process.env.CI_DB_USERNAME,
    password: process.env.CI_DB_PASSWORD,
    database: process.env.CI_DB_NAME,
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql',
    logging: (msg) => logger.info(msg),
    dialectOptions: {
      bigNumberStrings: true,
      useUTC: false
    },
    timezone: "+08:00",
    // OVERRIDE CORE NAME
    define : {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  production: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOSTNAME,
    port: process.env.PROD_DB_PORT,
    dialect: 'mysql',
    logging: (msg) => logger.info(msg),
    dialectOptions: {
      bigNumberStrings: true,
      // ssl: {
      //   ca: fs.readFileSync(__dirname + '/mysql-ca-master.crt')
      // },
      useUTC: false
    },
    timezone: "+08:00",
    // OVERRIDE CORE NAME
    define : {
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at"
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};