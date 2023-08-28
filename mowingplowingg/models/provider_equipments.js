'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Provider_equipment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Equipment,User}) {
      // define association here
      this.hasOne(Equipment,{foreignKey:'id',sourceKey:'equipment_id',as:'equipment'});
      this.hasOne(User,{foreignKey:'id',sourceKey:'provider_id',as:'provider_data'});
    }
  }
  Provider_equipment.init({
    provider_id: DataTypes.INTEGER,
    equipment_id: DataTypes.INTEGER,  
    category_id: DataTypes.INTEGER,  
    status:DataTypes.INTEGER,  
    is_deleted:DataTypes.INTEGER,  
  }, {
    sequelize,
    tableName:'provider_equipments',
    modelName: 'Provider_equipment',
  });
  return Provider_equipment;
};