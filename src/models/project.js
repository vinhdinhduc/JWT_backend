"use strict";

export default (sequelize, DataTypes) => {
  const Project = sequelize.define(
    "Project",
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      startDate: DataTypes.STRING,
      customerId: DataTypes.INTEGER,
    },
    {
      tableName: "Project",
    }
  );

  Project.associate = (models) => {
    Project.belongsToMany(models.User, { through: "ProjectUser" });
  };

  return Project;
};
