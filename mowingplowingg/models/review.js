'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User}) {
      // define association here
       this.hasOne(User,{foreignKey:'id',sourceKey:'user_id',as:'user'});
     
     }
  }
  Review.init({
   
    user_id: DataTypes.INTEGER,
    provider_id:DataTypes.INTEGER,
    review_to:DataTypes.INTEGER,
    order_id:DataTypes.STRING,
    comment: DataTypes.TEXT,
    rating: DataTypes.DOUBLE,
    is_deleted: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Review',
    tableName:'reviews'
  });
  return Review;
};