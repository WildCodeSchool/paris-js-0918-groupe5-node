'use strict';
module.exports = (sequelize, DataTypes) => {
  const contact = sequelize.define('contact', {
    title: DataTypes.STRING,
    lastName: {type: DataTypes.STRING, allowNull: false},
    firstName: {type: DataTypes.STRING, allowNull: false},
    profession: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.INTEGER,
    email: DataTypes.STRING,
    preferenceOfContact: {type: DataTypes.STRING, allowNull: false},
    category: {type: DataTypes.STRING, allowNull: false},
    comment: DataTypes.STRING,
    status: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true}
  }, {});
  contact.associate = function(models) {
    // associations can be defined here
    contact.belongsToMany(models.user, {
      through: "contact_user"
    });

    // contact.belongsToMany(models.event, {
    //   through: "contact_event"
    // });

    contact.hasMany(models.event);
  };
  return contact;
};