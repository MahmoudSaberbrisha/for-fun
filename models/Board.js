const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const Member = require("./Member");

const Board = sequelize.define(
  "Board",
  {
    boardCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    startDateHijri: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startDateGregorian: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    appointmentDecisionNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    endDateHijri: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    endDateGregorian: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    decisionImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    boardStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "Boards",
    timestamps: true,
  }
);

// Many-to-many association with Member through BoardMembers join table
Board.belongsToMany(Member, { through: "BoardMembers", foreignKey: "boardId" });
Member.belongsToMany(Board, {
  through: "BoardMembers",
  foreignKey: "memberId",
});

module.exports = Board;
