'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Equipment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Category,Lawn_height,Lawn_size,Fence,Cleanup}) {
      // define association here
       this.hasMany(Category,{foreignKey:'id',sourceKey:'category_id',as:'category'});
    //   this.hasMany(Lawn_height,{foreignKey:'id',sourceKey:'lawn_height_id',as:'lawn_height'});
    //   this.hasMany(Lawn_size,{foreignKey:'id',sourceKey:'lawn_size_id',as:'lawn_size'});
    //   this.hasMany(Fence,{foreignKey:'id',sourceKey:'fence_id',as:'fence'});
    //   this.hasMany(Cleanup,{foreignKey:'id',sourceKey:'cleanup_id',as:'cleanup'});
       
    }
  };
  Equipment.init({
    image: DataTypes.STRING,
    name: DataTypes.STRING,
    category_id:DataTypes.INTEGER,
    type:DataTypes.INTEGER,
    status:DataTypes.INTEGER,
    is_deleted:DataTypes.INTEGER,
  }, {
    sequelize,
    tableName:'equipments',
    modelName: 'Equipment',
  });
  return Equipment;
};