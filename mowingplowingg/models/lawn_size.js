'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lawn_size extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User}) {
      // define association here
     
    }
  }
  Lawn_size.init({
    name: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    seven_days_price:DataTypes.DOUBLE,
    ten_days_price:DataTypes.DOUBLE,
    fourteen_days_price:DataTypes.DOUBLE,
    is_deleted:DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Lawn_size',
    tableName:'lawn_sizes'
  });
  return Lawn_size;
};