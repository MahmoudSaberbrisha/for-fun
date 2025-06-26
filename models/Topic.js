const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const BoardMeeting = require("./BoardMeeting");

const Topic = sequelize.define(
  "Topic",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Topics",
    timestamps: false,
  }
);

Topic.belongsTo(BoardMeeting, {
  foreignKey: "boardMeetingId",
  onDelete: "CASCADE",
});
BoardMeeting.hasMany(Topic, { foreignKey: "boardMeetingId" });

module.exports = Topic;
