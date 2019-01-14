'use strict';

module.exports = (sequelize, DataTypes) => {
  const contact = sequelize.define('Contact', {
    title: DataTypes.STRING,
    lastName: { type: DataTypes.STRING, allowNull: false },
    firstName: { type: DataTypes.STRING, allowNull: false },
    profession: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    preferenceOfContact: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    comment: DataTypes.STRING,
    status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  }, {});
  contact.associate = (models) => {
    // associations can be defined here
    contact.belongsToMany(models.User, {
      through: 'UserContact',
    });

    contact.hasMany(models.Event);
  };
  return contact;
};
