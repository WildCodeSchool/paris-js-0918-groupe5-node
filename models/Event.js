'use strict';

module.exports = (sequelize, DataTypes) => {
  const event = sequelize.define('Event', {
    name: DataTypes.STRING,
    category: DataTypes.STRING,
    dateBeginning: DataTypes.DATE,
    dateEnd: DataTypes.DATE,
    hourBeginning: DataTypes.TIME,
    hourEnd: DataTypes.TIME,
    address: DataTypes.STRING,
    frequency: DataTypes.STRING,
    accountable: DataTypes.STRING,
    visibility: DataTypes.BOOLEAN,
    recall: DataTypes.BOOLEAN,
    immediateRecall: DataTypes.BOOLEAN,
    mood: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN,
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
