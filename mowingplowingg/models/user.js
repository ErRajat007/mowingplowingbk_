'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Provider_equipment,User_detail,Order,Bank_detail}) {
      // define association here
       this.hasMany(Provider_equipment,{foreignKey:'provider_id',sourceKey:'id', as:'provider_equipment'});
       this.hasOne(User_detail,{foreignKey:'provider_id',sourceKey:'id', as:'user_documents'});
       this.hasMany(Order,{foreignKey:'assigned_to',sourceKey:'id',as:'job_status'});
       this.hasOne(Bank_detail,{foreignKey:'provider_id',sourceKey:'id',as:'bank_details'});
     }
  }
  User.init({
  
    image: DataTypes.STRING,
    fristname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    mobile: DataTypes.STRING,
    password: DataTypes.STRING,
    address:DataTypes.TEXT,
    dob:DataTypes.STRING,
    street:DataTypes.STRING,
    city:DataTypes.STRING,
    zip_code:DataTypes.STRING,
    state:DataTypes.STRING,
    otp:DataTypes.STRING,
    country:DataTypes.STRING,
    role:DataTypes.INTEGER,
    bio:DataTypes.TEXT,
    lat:DataTypes.STRING,
    lng:DataTypes.STRING,
    ssn:DataTypes.STRING,
    account_id:DataTypes.STRING,
    admin_approved:DataTypes.INTEGER,
    fcm_token:DataTypes.STRING,
    device_id:DataTypes.STRING,
    is_deleted:DataTypes.INTEGER,
    status:DataTypes.INTEGER,
    notification:DataTypes.TEXT,
    is_blocked:DataTypes.INTEGER,
    is_forget:DataTypes.INTEGER,
    customer_id:DataTypes.STRING,
    is_available:DataTypes.INTEGER,
  }, {
    sequelize,
    tableName:'users',
    modelName: 'User',
  });


  return User;
};