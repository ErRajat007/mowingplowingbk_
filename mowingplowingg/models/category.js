'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Subcategory}) {
      return this.hasMany(Subcategory,{foreignKey:'category_id',sourceKey:'id',as:'subcategory'})
    }
  };
  Category.init({
    image: DataTypes.STRING,
    name: DataTypes.STRING,  
    status:DataTypes.INTEGER,  
    is_deleted:DataTypes.INTEGER,  
  }, {
    sequelize,
    tableName:'categories',
    modelName: 'Category',
  });
  return Category;
};