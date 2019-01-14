'use strict';

const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('User', {
    title: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    firstName: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    dateOfBirth: DataTypes.DATE,
    receiverBond: DataTypes.STRING, // allowNull: false for caregiver
    email: { type: DataTypes.STRING, unique: true }, // allowNull: false for caregiver
    password: { type: DataTypes.STRING, defaultValue: null }, // allowNull: false for caregiver
    preferenceOfContact: DataTypes.INTEGER, // allowNull: false for caregiver
    numberOfSubscriptions: DataTypes.INTEGER, // allowNull: false for caregiver
    selectedReceiverId: { type: DataTypes.INTEGER, defaultValue: -1 },
    subscriber: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }, // value is true for caregiver who are not invited
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }, // value is true for caregiver
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    }, // value is false if the user is not active anymore (deleted)
    avatar: DataTypes.STRING, // allowNull: false for receiver
  }, {});
  user.associate = (models) => {
    // Many events can be linked to one user
    user.hasMany(models.Event);

    // Many contacts can be linked to one user
    user.belongsToMany(models.Contact, {
      through: 'UserContact',
    });

    // Many user can be linked to many users (many receivers can be linked to many caregivers
    // (the main one and the invited ones))
    user.belongsToMany(models.User, {
      through: 'Assignee',
      as: 'Caregiver',
      foreignKey: 'receiverId',
    });

    user.belongsToMany(models.User, {
      through: 'Assignee',
      as: 'Receiver',
      foreignKey: 'caregiverId',
    });
  };
  // launched before the creation of an user
  user.beforeSave((newUser) => {
    return newUser.password !== null
    ? bcrypt.hash(newUser.password, 10) // hash the password
    .then((hash) => {
      newUser.password = hash; // assign the hashed password
      newUser.isAdmin = true; // isAdmin because we create a caregiver
    })
    .catch((err) => {
      throw new Error(err);
    }) : true;
  });
  return user;
};
