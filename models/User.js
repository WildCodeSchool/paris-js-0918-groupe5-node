'use strict';

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('User', {
    title: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    firstName: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.INTEGER, allowNull: false },
    dateOfBirth: DataTypes.DATE,
    receiverBond: DataTypes.STRING, // allowNull: false for caregiver
    email: DataTypes.STRING, // allowNull: false for caregiver
    password: DataTypes.STRING, // allowNull: false for caregiver
    preferenceOfContact: DataTypes.INTEGER, // allowNull: false for caregiver
    numberOfSubscriptions: DataTypes.INTEGER, // allowNull: false for caregiver
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
  return user;
};
