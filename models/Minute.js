const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Minute = sequelize.define(
  "Minute",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
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
    tableName: "Minutes",
    timestamps: false,
  }
);

module.exports = Minute;
