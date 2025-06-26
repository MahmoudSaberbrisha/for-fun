const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const BoardMeeting = require("./BoardMeeting");

const VotingItem = sequelize.define(
  "VotingItem",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    votes: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    followUpStatus: {
      type: DataTypes.ENUM("Pending", "In Progress", "Completed"),
      allowNull: false,
      defaultValue: "Pending",
    },
    followUpNotes: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
  },
  {
    tableName: "VotingItems",
    timestamps: false,
  }
);

VotingItem.belongsTo(BoardMeeting, {
  foreignKey: "boardMeetingId",
  onDelete: "CASCADE",
});
BoardMeeting.hasMany(VotingItem, { foreignKey: "boardMeetingId" });

module.exports = VotingItem;
