'use strict';
const {
  Model, STRING
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Coupan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
     

    }
  }
  Coupan.init({
    
     
    name: DataTypes.STRING,
    type:DataTypes.INTEGER,
    expiry_date:DataTypes.DATE,
    discount:DataTypes.DOUBLE,
    service:DataTypes.INTEGER,
    description:DataTypes.STRING,
    is_deleted: DataTypes.INTEGER,

   
  }, {
    sequelize,
    tableName:'coupons',
    modelName: 'Coupon',
  });

  return Coupan;
};