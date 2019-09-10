'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    social_auth_id: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    avarta: DataTypes.STRING,
    isVerified: DataTypes.BOOLEAN,
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
