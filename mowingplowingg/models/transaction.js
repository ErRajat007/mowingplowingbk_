'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User,Order}) {
      // define association here
      this.hasOne(User,{foreignKey:"id",sourceKey:"user_id",as:"user_details"});
      this.hasOne(Order,{foreignKey:"order_id",sourceKey:"order_id",as:'order'});
    }
  }
  Transaction.init({
    transaction_id: DataTypes.STRING,
    provider_id:DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    order_id: DataTypes.STRING,
    admin_commision: DataTypes.STRING,
    category_id:DataTypes.INTEGER,
    amount: DataTypes.DOUBLE,
    payment_status: DataTypes.INTEGER,
    stripe_response: DataTypes.TEXT,
    type:DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    is_deleted: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction',
    tableName:'transactions'
  });
  return Transaction;
};