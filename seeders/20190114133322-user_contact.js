'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('UserContact', [{
      ContactId: 4,
      UserId: 2,
      createdAt: '2019-01-14T10:24:29.956Z',
      updatedAt: '2019-01-14T10:24:29.956Z',
    },
    {
      ContactId: 7,
      UserId: 2,
      createdAt: '2019-01-14T10:24:29.956Z',
      updatedAt: '2019-01-14T10:24:29.956Z',
    },
    {
      ContactId: 2,
      UserId: 2,
      createdAt: '2019-01-14T10:24:29.956Z',
      updatedAt: '2019-01-14T10:24:29.956Z',
    },
    {
      ContactId: 1,
      UserId: 3,
      createdAt: '2019-01-14T10:24:29.956Z',
      updatedAt: '2019-01-14T10:24:29.956Z',
    },
    {
      ContactId: 3,
      UserId: 3,
      createdAt: '2019-01-14T10:24:29.956Z',
      updatedAt: '2019-01-14T10:24:29.956Z',
    },
    {
      ContactId: 5,
      UserId: 4,
      createdAt: '2019-01-14T10:24:29.956Z',
      updatedAt: '2019-01-14T10:24:29.956Z',
    },
    {
      ContactId: 6,
      UserId: 4,
      createdAt: '2019-01-14T10:24:29.956Z',
      updatedAt: '2019-01-14T10:24:29.956Z',
    },
    {
      ContactId: 8,
      UserId: 2,
      createdAt: '2019-01-14T10:24:29.956Z',
      updatedAt: '2019-01-14T10:24:29.956Z',
    },
    {
      ContactId: 9,
      UserId: 4,
      createdAt: '2019-01-14T10:24:29.956Z',
      updatedAt: '2019-01-14T10:24:29.956Z',
    }], {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('UserContact', null, {});
  },
};
