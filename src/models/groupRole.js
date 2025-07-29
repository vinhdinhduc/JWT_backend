"use strict";

export default (sequelize, DataTypes) => {
  const GroupRole = sequelize.define(
    "GroupRole",
    {
      groupId: DataTypes.INTEGER,
      roleId: DataTypes.INTEGER,
    },
    {
      tableName: "GroupRole",
    }
  );

  GroupRole.associate = (models) => {};

  return GroupRole;
};
