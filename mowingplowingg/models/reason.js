'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reason extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    //  this.hasOne(User,{foreignKey:'id',sourceKey:'reporter',as:'reporters'});
    //  this.hasOne(User,{foreignKey:'id',sourceKey:'reportee',as:'reportees'});
     
     }
  }
  Reason.init({
    reason: DataTypes.STRING,
    is_deleted: DataTypes.INTEGER
    },{
    sequelize,
    modelName: 'Reason',
    tableName:'reasons'
  });
  return Reason;
};