const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const City = sequelize.define(
  "City",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "Cities",
    timestamps: false,
  }
);

module.exports = City;
