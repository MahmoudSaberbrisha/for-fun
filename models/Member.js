const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Member = sequelize.define(
  "Member",
  {
    membershipNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM("Male", "Female", "Other"),
      allowNull: true,
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    maritalStatus: {
      type: DataTypes.ENUM("Single", "Married", "Divorced", "Widowed"),
      allowNull: true,
    },
    nationalIdNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
      validate: {
        is: /^\d{10}$/,
      },
    },
    issuingAuthority: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    issueDateHijri: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    issueDateGregorian: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    birthDateHijri: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    birthDateGregorian: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^966\d{9}$/,
      },
    },
    secondaryPhoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    neighborhood: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    streetName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nationalAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    academicDegree: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    academicQualifications: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    workLifeExperience: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profession: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    workEntity: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    workAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    workPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    personalPhoto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    idPhoto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    memberType: {
      type: DataTypes.ENUM("Chairman", "BoardMember", "Employee", "Other"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      allowNull: false,
      defaultValue: "Active",
    },
    subscriptionStartDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    subscriptionEndDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    councilCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    appointmentDateHijri: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shortName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Members",
    timestamps: true,
    createdAt: true,
    updatedAt: false,
  }
);

module.exports = Member;
