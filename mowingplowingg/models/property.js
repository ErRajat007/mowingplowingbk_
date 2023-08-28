'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Property extends Model {
   
    static associate() {
     }
  };
  Property.init({
    image: DataTypes.STRING,
    address: DataTypes.TEXT,
    lat:DataTypes.STRING,
    lng:DataTypes.STRING,
    user_id:DataTypes.INTEGER,
    is_deleted:DataTypes.INTEGER   
  }, {
    sequelize,
    tableName:'properties',
    modelName: 'Property',
  });
  return Property;
};