'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
      // this.hasMany(Category_size,{foreignKey:'category_id',sourceKey:'id',as:'category_size'});
    }
  };
  User_detail.init({
    provider_id: DataTypes.INTEGER,
    identity: DataTypes.STRING,    
    license: DataTypes.STRING,    
    insurance: DataTypes.STRING,    
    status: DataTypes.INTEGER,
    is_deleted: DataTypes.INTEGER,
  }, {
    sequelize,
    tableName:'user_details',
    modelName: 'User_detail',
  });
  return User_detail;
};