'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sidewalk extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({}) {
      // define association here
    }
  };
  Sidewalk.init({
    name: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    type:DataTypes.STRING,
    status: DataTypes.INTEGER,
    is_deleted: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Sidewalk',
    tableName:'sidewalks'
  });
  return Sidewalk;
};