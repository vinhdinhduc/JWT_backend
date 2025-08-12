"use strict";

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      address: DataTypes.STRING,
      gender: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      groupId: DataTypes.INTEGER,
    },
    {
      tableName: "User",
    }
  );

  User.associate = (models) => {
    User.belongsTo(models.Group);

    User.belongsToMany(models.Project, { through: "ProjectUser" });
  };

  return User;
};
