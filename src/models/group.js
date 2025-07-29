"use strict";

export default (sequelize, DataTypes) => {
  const Group = sequelize.define(
    "Group",
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      tableName: "Group",
    }
  );

  Group.associate = (models) => {
    Group.hasMany(models.User);
    Group.belongsToMany(models.Role, { through: "GroupRole" });
  };

  return Group;
};
