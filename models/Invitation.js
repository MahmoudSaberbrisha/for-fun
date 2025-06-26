const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Invitation = sequelize.define(
  "Invitation",
  {
    invitationNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    invitationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    meetingType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    memberName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    memberTitleEnd: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sessionNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    meetingPlace: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Invitations",
    timestamps: true,
  }
);

module.exports = Invitation;
