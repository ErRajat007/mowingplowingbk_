'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bank_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  };
  Bank_detail.init({
    provider_id: DataTypes.INTEGER,
    account_number: DataTypes.STRING,
    bank_name: DataTypes.STRING,
    routing_number: DataTypes.STRING,
    status: DataTypes.INTEGER,
    is_deleted: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Bank_detail',
    tableName:'bank_details'
  });
  return Bank_detail;
};