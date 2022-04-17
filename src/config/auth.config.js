module.exports = {
  secret: "api-nodejs-sequalize-mysql-2022-secret-key",
  server_key: process.env.SANDBOX_SERVER_KEY,
  client_key: process.env.SANDBOX_CLIENT_KEY,

  // jwtExpiration: 3600,           // 1 hour
  jwtExpiration: 604800, // 1 week
  jwtRefreshExpiration: 604800, // 1 week
  // jwtRefreshExpiration: 86400,   // 24 hours

  /* for test */
  // jwtExpiration: 60,          // 1 minute
  // jwtRefreshExpiration: 120,  // 2 minutes
};
