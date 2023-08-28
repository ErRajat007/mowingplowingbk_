'use strict';

const {
  Model, STRING
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Privacy_policy extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
     

    }
  }
  Privacy_policy.init({
     description:DataTypes.TEXT,
     is_deleted:DataTypes.INTEGER,
   
  }, {
    sequelize,
    tableName:'privacy_policies',
    modelName: 'Privacy_policy',
  });

  return Privacy_policy;
};