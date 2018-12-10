'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    title: {type: DataTypes.STRING, allowNull : false},
    lastName: {type: DataTypes.STRING, allowNull : false},
    firstName: {type: DataTypes.STRING, allowNull : false},
    address: {type: DataTypes.STRING, allowNull : false},
    phone: {type : DataTypes.INTEGER, allowNull : false},
    dateOfBirth: DataTypes.DATE,
    receiverBond: DataTypes.STRING, // false pour caregiver
    email: DataTypes.STRING, // false pour caregiver
    password: DataTypes.STRING, // false pour caregiver
    preferenceOfContact: DataTypes.INTEGER, // false pour caregiver
    numberOfSubscriptions: DataTypes.INTEGER, // false pour caregiver
    subscriber: { type: DataTypes.BOOLEAN, allowNull : false},
    status: { type : DataTypes.BOOLEAN, allowNull : false }
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