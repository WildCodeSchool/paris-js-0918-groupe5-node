/* eslint-disable */
'use strict';

module.exports = (sequelize, DataTypes) => {
  const event = sequelize.define('Event', {
    title: DataTypes.STRING,
    atHomeEvent: DataTypes.BOOLEAN,
    address: DataTypes.STRING,
    startingDate: DataTypes.STRING,
    endingDate: DataTypes.STRING,
    frequency: DataTypes.STRING,
    daysSelected: DataTypes.STRING,
    contact: DataTypes.INTEGER,
    category: DataTypes.STRING,
    visibleEvent: DataTypes.BOOLEAN,
    followedVisit: DataTypes.BOOLEAN,
    reminder: DataTypes.BOOLEAN,
    immediateNotif: DataTypes.BOOLEAN,
    mood: DataTypes.INTEGER,
    status: { type: DataTypes.BOOLEAN, defaultValue: true}
  }, {});
  event.associate = (models) => {
    // associations can be defined here
    event.belongsTo(models.User);
    // event.belongsTo(models.user, { as: "receiver" });
    event.belongsTo(models.Contact, {
      foreignKey: {
        allowNull: true,
      },
    });
  };
  return event;
};
