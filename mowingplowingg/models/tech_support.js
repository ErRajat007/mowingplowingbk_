'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tech_support extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  };
  Tech_support.init({
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    user_id:DataTypes.INTEGER,
    email: DataTypes.STRING,
    phone_type: DataTypes.STRING,
    request_type: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    user_type:DataTypes.ENUM(['User','Provider']),
    images: DataTypes.STRING,
    is_deleted: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Tech_support',
    tableName:'tech_supports'
  });
  return Tech_support;
};