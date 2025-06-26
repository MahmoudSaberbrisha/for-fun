const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const WorkDestination = sequelize.define(
  "WorkDestination",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "WorkDestinations",
    timestamps: true,
  }
);

const MembershipType = sequelize.define(
  "MembershipType",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "MembershipTypes",
    timestamps: true,
  }
);

const MemberJob = sequelize.define(
  "MemberJob",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "MemberJobs",
    timestamps: true,
  }
);

const MemberTitle = sequelize.define(
  "MemberTitle",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "MemberTitles",
    timestamps: true,
  }
);

const MeetingPlace = sequelize.define(
  "MeetingPlace",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "MeetingPlaces",
    timestamps: true,
  }
);

const City = sequelize.define(
  "City",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "Cities",
    timestamps: true,
  }
);

const Neighborhood = sequelize.define(
  "Neighborhood",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "Neighborhoods",
    timestamps: true,
  }
);

// Associations
Neighborhood.belongsTo(City, { foreignKey: "cityId", allowNull: false });
City.hasMany(Neighborhood, { foreignKey: "cityId" });

const MembershipSuspensionReason = sequelize.define(
  "MembershipSuspensionReason",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "MembershipSuspensionReasons",
    timestamps: true,
  }
);

module.exports = {
  WorkDestination,
  MembershipType,
  MemberJob,
  MemberTitle,
  MeetingPlace,
  City,
  Neighborhood,
  MembershipSuspensionReason,
};
