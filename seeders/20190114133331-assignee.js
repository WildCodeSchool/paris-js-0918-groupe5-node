'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Assignee', [{
      caregiverId: 1,
      receiverId: 2,
      createdAt: '2019-01-14T10:24:29.956Z',
      updatedAt: '2019-01-14T10:24:29.956Z',
    },
    {
      caregiverId: 1,
      receiverId: 3,
      createdAt: '2019-01-14T10:24:29.956Z',
      updatedAt: '2019-01-14T10:24:29.956Z',
    },
    {
      caregiverId: 1,
      receiverId: 4,
      createdAt: '2019-01-14T10:24:29.956Z',
      updatedAt: '2019-01-14T10:24:29.956Z',
    }], {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Assignee', null, {});
  },
};
