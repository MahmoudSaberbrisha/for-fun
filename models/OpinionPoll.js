const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const OpinionPoll = sequelize.define(
  "OpinionPoll",
  {
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    option1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    option2: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "OpinionPolls",
    timestamps: false,
  }
);

module.exports = OpinionPoll;
