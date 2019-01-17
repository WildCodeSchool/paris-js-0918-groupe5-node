'use strict';

module.exports = (sequelize, DataTypes) => {
  const contact = sequelize.define('Contact', {
    title: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    firstName: { type: DataTypes.STRING, allowNull: false },
    profession: DataTypes.STRING,
    address: { type: DataTypes.STRING, allowNull: false },
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
