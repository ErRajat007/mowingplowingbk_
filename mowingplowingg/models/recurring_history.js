'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recurring_history extends Model {
   
    static associate({
        User,
        Lawn_height,
        Property,
        Lawn_size,
        Provider_equipment,
        Fence,
        // Subcategory,
        Cleanup,
        // Color,
        Order_image,
        Sidewalk,
        Walkway,
        Order_sidewalk,
        Order_walkway,
        // Recurring_history,
        Corner_lot,
        Order,
        Transaction,
    }) {
        
       
        
      this.hasOne(Corner_lot,{foreignKey:'id',sourceKey:'corner_lot_id',as:'corner_details'});
      
      this.hasOne(User,{foreignKey:'id',sourceKey:'provider_id',as:'provider'});
      
      this.hasOne(Lawn_height,{foreignKey:'id',sourceKey:'lawn_height_id',as:'lawn_height'});
      
      this.hasOne(Property,{foreignKey:'id',sourceKey:'property_id',as:'property'});
      
      this.hasOne(Lawn_size,{foreignKey:'id',sourceKey:'lawn_size_id',as:'lawn_size_details'});
      
      this.hasOne(Fence,{foreignKey:'id',sourceKey:'fence_id',as:'fence_details'});
      
      this.hasOne(Cleanup,{foreignKey:'id',sourceKey:'cleanup_id',as:'cleanup'});
      
    //   this.hasOne(Subcategory,{foreignKey:'id',sourceKey:'subcategory_id',as:'subcategory'});
      
    //   this.hasOne(Color,{foreignKey:'id',sourceKey:'color_id',as:'color'});
      
      this.hasOne(User,{foreignKey:'id',sourceKey:'user_id',as:'userdata'});
      
      this.hasMany(Order_image,{foreignKey:'order_id',sourceKey:'order_id',as:'order_images'});
      
      
      this.hasMany(Order_sidewalk,{foreignKey:'order_id',sourceKey:'order_id',as:'order_sidewalks'});
      
      this.hasMany(Order_walkway,{foreignKey:'order_id',sourceKey:'order_id',as:'order_walkways'});
      
    //   this.hasOne(Recurring_history,{foreignKey:'order_id',sourceKey:'order_id',as:'recurring_view'});
      
      this.hasMany(Provider_equipment,{foreignKey:'category_id',sourceKey:'category_id',as:'provider_equipment'});
      
      this.hasOne(Order,{foreignKey:'order_id',sourceKey:'order_id',as:'order_table'});
      
      this.hasOne(Transaction,{foreignKey:'order_id',sourceKey:'order_id',as:'transaction_details'});
      
     }
  }
  
  Recurring_history.init({
    order_id: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    property_id:DataTypes.INTEGER,
    provider_id: DataTypes.INTEGER,
    category_id:DataTypes.INTEGER,
    service_for:DataTypes.STRING,
    on_every:DataTypes.INTEGER,
    date:DataTypes.DATE,
    
    lawn_size_id:DataTypes.INTEGER,
    lawn_size_amount:DataTypes.DOUBLE,
    
    lawn_height_id:DataTypes.INTEGER,
    lawn_height_amount:DataTypes.DOUBLE,
    
    gate_code:DataTypes.STRING,
  
    fence_id:DataTypes.INTEGER,
    fence_amount:DataTypes.DOUBLE,
    
    cleanup_id:DataTypes.INTEGER,
    cleanup_amount:DataTypes.DOUBLE,
    
    corner_lot_id:DataTypes.INTEGER,
    corner_lot_amount:DataTypes.DOUBLE,
    admin_commision:DataTypes.DOUBLE,
    admin_fee_perc:DataTypes.STRING,
    admin_fee:DataTypes.DOUBLE,
    
    tax_perc:DataTypes.STRING,
    tax:DataTypes.DOUBLE,
    
    // recurring_histories:DataTypes.INTEGER,
    
    
    
    total_amount:DataTypes.DOUBLE,
    
    grand_total:DataTypes.DOUBLE,
    
    status:DataTypes.ENUM(['Pending','Completed','Failed','Cancel','Active']),
    is_deleted:DataTypes.INTEGER   
  }, {
    sequelize,
    tableName:'recurring_histories',
    modelName: 'Recurring_history',
  });
  return Recurring_history;
};