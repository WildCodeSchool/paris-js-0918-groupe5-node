'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    title: DataTypes.STRING,
    lastName: DataTypes.STRING,
    firstName: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.INTEGER,
    dateOfBirth: DataTypes.DATE,
    receiverBond: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    preferenceOfContact: DataTypes.INTEGER,
    numberOfSubscriptions: DataTypes.INTEGER,
    subscriber: DataTypes.BOOLEAN,
    status: DataTypes.BOOLEAN
  }, {});
  user.associate = function(models) {
    // associations can be defined here
    user.belongsToMany(models.contact, {
      through: "user_contact",
      as: "caregiver",
      foreignKey: "caregiverId"
    }, models.event, {
      through: "user_event",
      as: "caregiver",
      foreignKey: "caregiverId"
    });

    user.belongsToMany(models.user, {
      through: "assignees",
      as: 'receiver',
      foreignKey: 'receiverId'
    });

    // user.belongsToMany(models.event, {
    //   through: "user_event",
    //   as: "caregiver",
    //   foreignKey: "caregiverId"
    // })

  };
  return user;
};