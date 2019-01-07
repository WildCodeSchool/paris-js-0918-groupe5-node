'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // title: {
      //   type: Sequelize.STRING
      // },
      // lastName: {
      //   type: Sequelize.STRING
      // },
      // firstName: {
      //   type: Sequelize.STRING
      // },
      // address: {
      //   type: Sequelize.STRING
      // },
      // phone: {
      //   type: Sequelize.INTEGER
      // },
      // dateOfBirth: {
      //   type: Sequelize.DATE
      // },
      // receiverBond: {
      //   type: Sequelize.STRING
      // },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      // preferenceOfContact: {
      //   type: Sequelize.INTEGER
      // },
      // numberOfSubscriptions: {
      //   type: Sequelize.INTEGER
      // },
      // subscriber: {
      //   type: Sequelize.BOOLEAN
      // },
      // caregiver: {
      //   type: Sequelize.BOOLEAN
      // },
      // status: {
      //   type: Sequelize.BOOLEAN
      // },
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
    return queryInterface.dropTable('users');
  }
};