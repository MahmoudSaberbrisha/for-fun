const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const MembershipRequest = sequelize.define(
  "MembershipRequest",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nationalIdNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    education: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profession: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cvFilePath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isEmployee: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isSupplier: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    pledge: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "MembershipRequests",
    timestamps: false,
  }
);

module.exports = MembershipRequest;
