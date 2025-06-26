const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const BreakingNews = sequelize.define(
  "BreakingNews",
  {
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "BreakingNews",
    timestamps: false,
  }
);

module.exports = BreakingNews;
