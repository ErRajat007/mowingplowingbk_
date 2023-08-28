'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class favourite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User}) {
      // define association here
       this.hasOne(User,{foreignKey:'id',sourceKey:'coach_id',as:'coach'});
    }
  };
  favourite.init({
    coach_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    category_id:DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Favourite',
    tableName:'favourites'
  });
  return favourite;
};