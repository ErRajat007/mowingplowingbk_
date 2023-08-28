'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Fence extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
     
    }
  }
  Fence.init({
      name:DataTypes.STRING,
      price:DataTypes.DOUBLE,
      seven_days_price:DataTypes.DOUBLE,
      ten_days_price:DataTypes.DOUBLE,
      fourteen_days_price:DataTypes.DOUBLE,
      is_deleted:DataTypes.INTEGER,
  }, {
    sequelize,
    tableName:'fences',
    modelName: 'Fence',
  });


  return Fence;
};