const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Attendance = sequelize.define(
  "Attendance",
  {
    sessionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Sessions", // name of Target model table
        key: "id", // key in Target model that we're referencing
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Members", // name of Target model table
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    status: {
      type: DataTypes.ENUM("Present", "Absent"),
      allowNull: false,
      defaultValue: "Absent",
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Attendances",
    timestamps: false,
  }
);

module.exports = Attendance;
