'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      category: {
        type: Sequelize.STRING,
      },
      dateBeginning: {
        type: Sequelize.DATE,
      },
      dateEnd: {
        type: Sequelize.DATE,
      },
      hourBeginning: {
        type: Sequelize.TIME,
      },
      hourEnd: {
        type: Sequelize.TIME,
      },
      address: {
        type: Sequelize.STRING,
      },
      frequency: {
        type: Sequelize.STRING,
      },
      accountable: {
        type: Sequelize.STRING,
      },
      visibility: {
        type: Sequelize.BOOLEAN,
      },
      recall: {
        type: Sequelize.BOOLEAN,
      },
      immediateRecall: {
        type: Sequelize.BOOLEAN,
      },
      mood: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Events');
  },
};
