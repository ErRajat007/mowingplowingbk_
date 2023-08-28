'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order_walkway extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Walkway}) {
      // define association here
     this.hasOne(Walkway,{foreignKey:'id',sourceKey:'walkway_id',as:'walkway'});
    }
  }
  Order_walkway.init({
    order_id: DataTypes.STRING,
    walkway_id: DataTypes.INTEGER,
    amount:DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'Order_walkway',
    tableName:'order_walkways'
  });
  return Order_walkway;
};