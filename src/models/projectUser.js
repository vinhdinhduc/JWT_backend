"use strict";

export default (sequelize, DataTypes) => {
  const ProjectUser = sequelize.define(
    "ProjectUser",
    {
      projectId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      tableName: "ProjectUser",
    }
  );

  ProjectUser.associate = (models) => {};

  return ProjectUser;
};
