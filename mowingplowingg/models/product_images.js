'use strict';
const {
  Model, STRING
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product_image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
     

    }
  }
    Product_image.init({
    image: DataTypes.STRING,    
    product_id:DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    is_deleted: DataTypes.INTEGER
    //name: DataTypes.STRING,
    //description:DataTypes.STRING,
    //price:DataTypes.STRING,
    //expire:DataTypes.DATE,
    //type:DataTypes.INTEGER,
    
    //email: DataTypes.STRING,
   //phone: DataTypes.STRING,
    // password: DataTypes.STRING,
   // bio:DataTypes.STRING,
    //document:DataTypes.STRING,
    //experience:DataTypes.STRING,
    //lat:DataTypes.STRING,
     //lng:DataTypes.STRING,
    //otp: DataTypes.STRING,
    //location: DataTypes.STRING,
    //fcm_token:DataTypes.STRING,
    //device_token:DataTypes.STRING,
  //   is_available:DataTypes.INTEGER,
    //role:DataTypes.INTEGER,
  
  }, {
    sequelize,
    tableName:'product_images',
    modelName: 'Product_image',
  });

  return Product_image;
};