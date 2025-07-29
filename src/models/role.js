"use strict";

export default (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
    {
      url: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      tableName: "Role",
    }
  );

  Role.associate = (models) => {
    Role.belongsToMany(models.Group, { through: "GroupRole" });
  };

  return Role;
};
