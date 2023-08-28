'use strict';
const { database } = require('firebase-admin');
const {
  Model, STRING
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
     

    }
  }
  Question.init({
    category:DataTypes.INTEGER,  
    question:DataTypes.STRING,
    is_deleted: DataTypes.INTEGER,
   
  }, {
    sequelize,
    tableName:'questions',
    modelName: 'Question',
  });

  return Question;
};