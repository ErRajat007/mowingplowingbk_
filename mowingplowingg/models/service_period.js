'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Service_period extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
     
    }
  };
  Service_period.init({
    type:DataTypes.INTEGER,
    duration: DataTypes.STRING,
    duration_type: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    recommended:DataTypes.ENUM({
     values: ['Yes', 'No']
    }),

    status: DataTypes.INTEGER,
    is_deleted: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Service_period',
    tableName:'service_periods'
  });
  return Service_period;
};