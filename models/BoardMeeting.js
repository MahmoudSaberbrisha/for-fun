const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const BoardMeeting = sequelize.define(
  "BoardMeeting",
  {
    sessionNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    day: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    secretary: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Open", "Closed"),
      allowNull: false,
      defaultValue: "Open",
    },
  },
  {
    tableName: "BoardMeetings",
    timestamps: true,
  }
);

module.exports = BoardMeeting;
