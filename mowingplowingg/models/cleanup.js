'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cleanup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Lawn_size}) {
      // define association here
     this.hasOne(Lawn_size,{foreignKey:'id',sourceKey:'lawn_size_id',as:'lawn_size_table'});
    }
  }
  Cleanup.init({
    lawn_size_id: DataTypes.INTEGER,
    name:DataTypes.STRING,
    price: DataTypes.DOUBLE,
    is_deleted:DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Cleanup',
    tableName:'cleanups'
  });
  return Cleanup;
};