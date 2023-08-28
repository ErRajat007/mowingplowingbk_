'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Notification.init({
    coach_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    type: DataTypes.INTEGER,
    title: DataTypes.STRING,
    message: DataTypes.TEXT,
    image:DataTypes.STRING,
    status: DataTypes.INTEGER,
    // is_deleted: DataTypes.INTEGER
  }, {
    sequelize,
    tableName:'notifications',
    modelName: 'Notification',
  });
  return Notification;
};