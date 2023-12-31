'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order_image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Order_image.init({
    order_id: DataTypes.STRING,
    image: DataTypes.STRING,
    type:DataTypes.STRING,
    status: DataTypes.INTEGER,
    is_deleted: DataTypes.INTEGER
  }, {
    sequelize,
    tableName:'order_images',
    modelName: 'Order_image',
  });
  return Order_image;
};