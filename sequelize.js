const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || "majles",
  process.env.MYSQL_USER || "root",
  process.env.MYSQL_PASSWORD || "",
  {
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: process.env.MYSQL_PORT || 3306,
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
    },
    define: {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
    },
  }
);

module.exports = sequelize;
