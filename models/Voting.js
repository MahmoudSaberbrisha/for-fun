const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Voting = sequelize.define(
  "Voting",
  {
    sessionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    options: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Open", "Closed"),
      allowNull: false,
      defaultValue: "Open",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Votings",
    timestamps: false,
  }
);

module.exports = Voting;
