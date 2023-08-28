'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Declined_order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User}) {
    //   return this.hasOne(Order,{foreignKey:'order_id',sourceKey:'order_id',as:'order'})
    this.hasOne(User,{foreignKey:'id',sourceKey:'provider_id',as:'provider_details'});
    }
  };
  Declined_order.init({
    provider_id: DataTypes.INTEGER,
    order_id: DataTypes.STRING,  
    status:DataTypes.INTEGER, 
    cancel_reason:DataTypes.STRING, 
    did_accept:DataTypes.INTEGER,
    is_deleted:DataTypes.INTEGER,
  }, {
    sequelize,
    tableName:'declined_orders',
    modelName: 'Declined_order',
  });
  return Declined_order;
};