'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User}) {
      // define association here
     this.hasOne(User,{foreignKey:'id',sourceKey:'reporter',as:'reporters'});
     this.hasOne(User,{foreignKey:'id',sourceKey:'reportee',as:'reportees'});
     }
  }
  Report.init({
    
    reporter:DataTypes.INTEGER,
    
    reportee:DataTypes.INTEGER,
    report:DataTypes.TEXT,
    img_1:DataTypes.STRING,
    img_2:DataTypes.STRING,
    img_3:DataTypes.STRING,
    order_id:DataTypes.STRING,
    question_id:DataTypes.STRING,
    type:DataTypes.ENUM({values: ['User', 'Provider'] }),
    is_deleted: DataTypes.INTEGER
    },{
    sequelize,
    modelName: 'Report',
    tableName:'reports'
  });
  return Report;
};