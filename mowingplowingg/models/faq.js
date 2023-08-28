'use strict';

const {
  Model, STRING
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Faq extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
     

    }
  }
  Faq.init({
    
     title:DataTypes.STRING,
     description: DataTypes.STRING,
     is_deleted: DataTypes.INTEGER,
    
   
  }, {
    sequelize,
    tableName:'faqs',
    modelName: 'Faq',
  });

  return Faq;
};