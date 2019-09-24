'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: true,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      social_auth_id: {
         allowNull: true,
         type: Sequelize.STRING
      },
      firstname: {
        allowNull: true,
        type: Sequelize.STRING
      },
      lastname: {
        allowNull: true,
        type: Sequelize.STRING
      },
      bio: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      username: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      email: {
        allowNull: true,
        type: Sequelize.STRING
      },
      password: {
        allowNull: true,
        type: Sequelize.STRING
      },
      avarta: {
        type: Sequelize.STRING
      },
      isVerified:{
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
