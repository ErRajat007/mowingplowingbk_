'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Option extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  };
  Option.init({
    name: DataTypes.STRING,
    is_deleted: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Option',
    tableName:'options'
  });
  return Option;
};