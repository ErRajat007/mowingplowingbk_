'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Corner_lot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
    //   return this.hasMany(Subcategory,{foreignKey:'category_id',sourceKey:'id',as:'subcategory'})
    }
  }
  Corner_lot.init({
    price:DataTypes.DOUBLE,
    seven_days_price: DataTypes.DOUBLE,  
    ten_days_price:DataTypes.DOUBLE,  
    fourteen_days_price:DataTypes.DOUBLE, 
    is_deleted:DataTypes.INTEGER,  
  }, {
    sequelize,
    tableName:'corner_lots',
    modelName: 'Corner_lot',
  });
  return Corner_lot;
};