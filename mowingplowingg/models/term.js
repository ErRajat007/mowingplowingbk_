'use strict';

const {
  Model, STRING
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Term extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
     

    }
  }
  Term.init({
    
     
    description: DataTypes.STRING,
    
    is_deleted: DataTypes.INTEGER,
    
   
  }, {
    sequelize,
    tableName:'terms',
    modelName: 'Term',
  });

  return Term;
};