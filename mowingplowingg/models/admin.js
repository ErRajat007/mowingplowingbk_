'use strict';
const { database } = require('firebase-admin');
const {
  Model, STRING
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
     

    }
  }
  Admin.init({
    fristname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    gender:DataTypes.INTEGER,
    dob:DataTypes.DATE,
    address:DataTypes.STRING,
    city:DataTypes.STRING,
    state:DataTypes.STRING,
    country:DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    support: DataTypes.TEXT,
    about_app: DataTypes.TEXT,
    password: DataTypes.STRING,
    image: DataTypes.STRING,
    role:DataTypes.INTEGER,
    stripe_key:DataTypes.STRING,
    public_stripe_key:DataTypes.STRING,
    google_api_key:DataTypes.STRING,
    fcm_token:DataTypes.STRING,
    device_id:DataTypes.STRING,
    is_deleted: DataTypes.INTEGER,
   
  }, {
    sequelize,
    tableName:'admins',
    modelName: 'Admin',
  });

  return Admin;
};