const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const Member = require("./Member");

const SubscriptionLog = sequelize.define(
  "SubscriptionLog",
  {
    subscriptionValue: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    operationType: {
      type: DataTypes.ENUM("استحقاق", "سداد"),
      allowNull: false,
    },
    startYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    endYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiptDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    receiptNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "SubscriptionLogs",
    timestamps: false,
  }
);

SubscriptionLog.belongsTo(Member, { foreignKey: "memberId", as: "member" });
Member.hasMany(SubscriptionLog, {
  foreignKey: "memberId",
  as: "subscriptionLogs",
});

module.exports = SubscriptionLog;
