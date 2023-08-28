'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Refund_history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Order}) {
      // define association here
      this.hasOne(Order,{foreignKey:'order_id',sourceKey:'order_id',as:'order'});
     
    }
  }
  Refund_history.init({
    transaction_id: DataTypes.STRING,
    amount: DataTypes.DOUBLE,
    status:DataTypes.STRING,
    user_id:DataTypes.INTEGER,
    order_id:DataTypes.STRING,
    is_deleted:DataTypes.INTEGER,
    
  }, {
    sequelize,
    modelName: 'Refund_history',
    tableName:'refund_histories'
  });
  return Refund_history;
};