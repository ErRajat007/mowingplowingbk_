'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order_sidewalk extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Sidewalk}) {
      // define association here
      this.hasOne(Sidewalk,{foreignKey:'id',sourceKey:'sidewalk_id',as:'sidewalk'});
     
    }
  }
  Order_sidewalk.init({
    order_id: DataTypes.STRING,
    sidewalk_id: DataTypes.INTEGER,
    amount:DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'Order_sidewalk',
    tableName:'order_sidewalks'
  });
  return Order_sidewalk;
};