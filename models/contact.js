'use strict';
module.exports = (sequelize, DataTypes) => {
  const contact = sequelize.define('contact', {
    title: DataTypes.STRING,
    lastName: DataTypes.STRING,
    firstName: DataTypes.STRING,
    profession: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.INTEGER,
    email: DataTypes.STRING,
    preferenceOfContact: DataTypes.STRING,
    category: DataTypes.STRING,
    comment: DataTypes.STRING,
    status: DataTypes.BOOLEAN
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