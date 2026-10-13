// All settings in one place. Change them here if you need to.
// To use MongoDB Atlas (cloud) instead, replace the DB_URL text with your Atlas connection link.
module.exports = {
  PORT: process.env.PORT || 8000,
  DB_URL: process.env.DB_URL || "mongodb://127.0.0.1:27017", // 127.0.0.1 is the same as localhost, but works better on Windows
  DB_NAME: process.env.DB_NAME || "ott_platform",
  JWT_SECRET: process.env.JWT_SECRET || "change_this_to_any_long_secret_text", // used to sign login tokens
};
