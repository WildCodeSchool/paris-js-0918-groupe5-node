/* eslint-disable */
'use strict';
module.exports = (sequelize, DataTypes) => {
  const event = sequelize.define('event', {
    title: DataTypes.STRING,
    address: DataTypes.STRING,
    atHomeEvent: DataTypes.BOOLEAN,
    begingDate: DataTypes.DATE,
    endingDate: DataTypes.DATE,
    hourBeginning: DataTypes.TIME,
    hourEnd: DataTypes.TIME,
    frequency: DataTypes.STRING,
    responsible: DataTypes.STRING,
    category: DataTypes.STRING,
    visibleEvent: DataTypes.BOOLEAN,
    followedVisit: DataTypes.BOOLEAN,
    reminder: DataTypes.BOOLEAN,
    immediateNotif: DataTypes.BOOLEAN,
    mood: DataTypes.INTEGER
  }, {});
  event.associate = function(models) {
    // associations can be defined here
    event.belongsTo(models.user);
    // event.belongsTo(models.user, { as: "receiver" });
    event.belongsTo(models.contact), {
      foreignKey: {
        allowNull: true
      }
    };
  };
  return event;
};