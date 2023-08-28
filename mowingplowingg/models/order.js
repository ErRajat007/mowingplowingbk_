'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User,Refund_history,Lawn_height,Property,Report,Lawn_size,Provider_equipment,Transaction,Fence,Subcategory,Cleanup,Color,Order_image,Sidewalk,Walkway,Order_sidewalk,Order_walkway,Recurring_history}) {
      // define association here
      this.hasOne(User,{foreignKey:'id',sourceKey:'assigned_to',as:'provider'});
      
      this.hasOne(Refund_history,{foreignKey:'order_id',sourceKey:'order_id',as:'refund_histories'});
      
      this.hasOne(Lawn_height,{foreignKey:'id',sourceKey:'lawn_height_id',as:'lawn_height'});
      
      this.hasOne(Property,{foreignKey:'id',sourceKey:'property_id',as:'property'});
      
      this.hasOne(Lawn_size,{foreignKey:'id',sourceKey:'lawn_size_id',as:'lawn_size'});
      
      this.hasOne(Fence,{foreignKey:'id',sourceKey:'fence_id',as:'fence'});
      
      this.hasOne(Cleanup,{foreignKey:'id',sourceKey:'cleanup_id',as:'cleanup'});
      
      this.hasOne(Subcategory,{foreignKey:'id',sourceKey:'subcategory_id',as:'subcategory'});
      
      this.hasOne(Color,{foreignKey:'id',sourceKey:'color_id',as:'color'});
      
      this.hasOne(User,{foreignKey:'id',sourceKey:'user_id',as:'user_details'});
      
      this.hasMany(Order_image,{foreignKey:'order_id',sourceKey:'order_id',as:'order_images'});
      
      this.hasOne(Report,{foreignKey:'order_id',sourceKey:'order_id',as:'report_table'});
      
      this.hasMany(Order_sidewalk,{foreignKey:'order_id',sourceKey:'order_id',as:'order_sidewalks'});
      
      this.hasMany(Order_walkway,{foreignKey:'order_id',sourceKey:'order_id',as:'order_walkways'});
      
      this.hasOne(Recurring_history,{foreignKey:'order_id',sourceKey:'order_id',as:'recurring_view'});
      
      this.hasMany(Provider_equipment,{foreignKey:'category_id',sourceKey:'category_id',as:'provider_equipment'});
      
      this.hasOne(Transaction,{foreignKey:'order_id',sourceKey:'order_id',as:'transaction_details'});
      
    //   this.hasOne(Sidewalk,{foreignKey:'id',sourceKey:'sidewalk_id',as:'sidewalk'});
      
    //   this.hasOne(Walkway,{foreignKey:'id',sourceKey:'walkway_id',as:'walkway'});
     
      
     }
  }
  Order.init({
    order_id:DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    subcategory_id: DataTypes.INTEGER,
    subcategory_amount:DataTypes.DOUBLE,
    property_id: DataTypes.INTEGER,
    lat: DataTypes.STRING,
    lng: DataTypes.STRING,

    
    on_demand: DataTypes.STRING,
    on_demand_fee:DataTypes.DOUBLE,
    
    date:DataTypes.DATE,
    provider_assigned_date:DataTypes.DATE,
    change_provider_assigned_date:DataTypes.DATE,
    
    
    on_the_way_date:DataTypes.DATE,
    at_location_date:DataTypes.DATE,
    started_job_date:DataTypes.DATE,  
    finished_job_date:DataTypes.DATE,

    cancel_reason:DataTypes.STRING,
    cancel_order_date:DataTypes.DATE,
    cancel_by:DataTypes.INTEGER,
    
    lawn_size_id:DataTypes.INTEGER,
    lawn_size_amount:DataTypes.DOUBLE,
    
    lawn_height_id:DataTypes.INTEGER,
    lawn_height_amount:DataTypes.DOUBLE,
    
    service_type:DataTypes.INTEGER,
    recurring_service_id:DataTypes.INTEGER,
    period_amount:DataTypes.DOUBLE,
    
    user_status:DataTypes.INTEGER,
    
    fence_id:DataTypes.INTEGER,
    fence_amount:DataTypes.DOUBLE,
    
    cleanup_id:DataTypes.INTEGER,
    cleanup_amount:DataTypes.DOUBLE,
    
    corner_lot_id:DataTypes.INTEGER,
    corner_lot_amount:DataTypes.DOUBLE,
                                
    // Car
    service_for:DataTypes.STRING,
    
    color_id:DataTypes.INTEGER,
    car_number:DataTypes.STRING,
    
    // HOME
    driveway:DataTypes.INTEGER,
    driveway_amount:DataTypes.DOUBLE,
    
    sidewalk_id:DataTypes.STRING,
    sidewalk_amount:DataTypes.DOUBLE,
    
    walkway_id:DataTypes.STRING,
    walkway_amount:DataTypes.DOUBLE,
    
    admin_fee_perc:DataTypes.STRING,
    admin_fee:DataTypes.DOUBLE,
    
    tax_perc:DataTypes.STRING,
    tax:DataTypes.DOUBLE,
    
      
    on_the_way:DataTypes.INTEGER,
    at_location:DataTypes.INTEGER,
    started_job:DataTypes.INTEGER,
    finished_job:DataTypes.INTEGER,
    
    coupon_id:DataTypes.INTEGER,
    coupon_code:DataTypes.STRING,
    coupon_type:DataTypes.INTEGER,
    discount_value:DataTypes.STRING,
    discount_amount:DataTypes.DOUBLE,
    grand_total:DataTypes.DOUBLE,

    
    img1: DataTypes.STRING,
    img2: DataTypes.STRING,
    img3: DataTypes.STRING,
    img4: DataTypes.STRING,
    
    gate_code:DataTypes.STRING,
    instructions: DataTypes.TEXT,
    tip:DataTypes.DOUBLE,
    total_amount:DataTypes.DOUBLE,
    assigned_to:DataTypes.INTEGER,
    checked_questions:DataTypes.STRING,
    
    provider_amount:DataTypes.DOUBLE,
    is_coupon_applied:DataTypes.INTEGER,
    payment_status:DataTypes.INTEGER,
    status:DataTypes.INTEGER,
    
    
    paid_to_provider:DataTypes.INTEGER,
    eta_date:DataTypes.DATE,
   
    
    parent_recurrent_order_id:DataTypes.STRING,
    is_reviewed:DataTypes.INTEGER,
    is_refund_reviewed:DataTypes.INTEGER,
    is_deleted: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Order',
    tableName:'orders'
  });
  return Order;
};