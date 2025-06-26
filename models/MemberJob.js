const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const MemberJob = sequelize.define(
  "MemberJob",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "MemberJobs",
    timestamps: true,
  }
);

module.exports = MemberJob;
