var express = require('express');
var router = express.Router();

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const  axios = require('axios');

const fetch = require('node-fetch');

const request = require("request");

const moment = require('moment');

const Stripe = require('stripe');

var FCM = require("fcm-node");
var serverKey = 'AAAADZ2BjMc:APA91bH24Rkt38jTtRMiKfi1ewcCH1NMz6b356a7rI6IDyZojVfxns5nUhS_WDs7uxF8E6wRb8waaiJsbQU-gok1nel-drpmjTAE69x69F0sZHeuqsar3pRMW3Hjkf7vIHlV4D_U-9to'; 
var fcm = new FCM(serverKey);
  

const accessToken = require('../middleware/accessToken');
const {
        Sequelize, 
        sequelize,
        User,
        Category,
        Bank_detail,
        Provider_equipment,
        User_detail,
        Order,
        Property,
        Lawn_height,
        Lawn_size,
        Fence,
        Cleanup,
        Subcategory,
        Color,
        Review,
        Question,
        Order_image,
        Setting,
        Transaction,
        Declined_order,
        Driveway,
        Sidewalk,
        Walkway,
        Order_sidewalk,
        Order_walkway,
        Corner_lot,
        Recurring_history,
        Term,
        Report,
        Equipment,
        User_details,
      

} = require('../models');


const Op = Sequelize.Op;




router.post('/basic-profile-details',accessToken,async(req,res) =>{
    
    const {bio,dob,equipment,account_number,bank_name,routing_number,ssn}  = req.body;
    
    if(!bio) return res.json({status:false,message:"Bio is required."});
    if(equipment.length==0) return res.json({status:false,message:"Equipment is required."});
    if(!account_number) return res.json({status:false,message:"Account number is required."});
    if(!bank_name) return res.json({status:false,message:"Bank name is required."});
    if(!routing_number) return res.json({status:false,message:"Routing number is required."});
    if(!ssn) return res.json({status:false,message:"Ssn number is required."});
    if(!dob) return res.json({status:false,message:"Date of birth is required."})
    
    try{
      var provider = await User.findOne({where:{id:req.user.user_id,is_deleted:0,role:2}});
      if(!provider) return res.json({status:false,message:'Provider not found.'});
    //   return res.json(provider)
      var birth= dob; //moment(dob).format('DD-MM-YYYY')
    //   return res.json(birth)
      provider.ssn = ssn;
      provider.bio = bio;
      provider.dob = birth
      provider.save();
       
      await Bank_detail.create({provider_id:provider.id,account_number,bank_name,routing_number});
      
      for(var i=0; i<equipment.length; i++){
          
        var chack = await Provider_equipment.findOne({where:{is_deleted:0,provider_id:provider.id,equipment_id:equipment[i].equipment_id}})
        
          
            if(!chack)
            {
                      if(equipment[i].equipment_id!=0){
                      await Provider_equipment.create({provider_id:provider.id,category_id:equipment[i].category_id,equipment_id:equipment[i].equipment_id});
                     } 
              
             }
          
          
          
      }
      
      return res.json({status:true,message:'Basic profile details submitted successfully.'});
       
    }catch(err){
        // return res.json(err)
        return res.json({status:false,message:'Something is wrong.'});
    }
});



var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // cb(null,'backend/public/documents/')
     cb(null, path.join(__dirname,'../public/documents/'))
      },
    filename: function (req, file, cb) {
      cb(null, Date.now()+'.png')
    }
  })
  
  
var upload = multer({ storage: storage })



router.post('/profile-documents',accessToken,upload.fields([{name:'identity'},{name:'license'},{name:'insurance'}]),async(req,res) =>{
     
       if(!req.files.license && !req.files.identity) return res.json({status:false,message:'Please select license or identity'});
       if(!req.files.insurance) return res.json({status:false,message:'Insurance document is required.'});
     try{
        
      var provider = await User.findOne({where:{id:req.user.user_id,is_deleted:0}});
      if(!provider) return res.json({status:false,message:'Provider not found.'});
      
     var chack = await User_detail.findOne({where:{is_deleted:0,provider_id:provider.id}})
    
     if(chack){
         
         
             chack.provider_id=provider.id;
             chack.identity=typeof req.files.identity !='undefined' ? '/documents/'+req.files.identity[0].filename:'';
             chack.license=typeof req.files.license !='undefined' ?'/documents/'+req.files.license[0].filename:'';
             chack.insurance='/documents/'+req.files.insurance[0].filename;
             chack.save();
        
     }else{
         
         await User_detail.create({
             provider_id:provider.id,
             identity:typeof req.files.identity !='undefined' ? '/documents/'+req.files.identity[0].filename:'', 
             license:typeof req.files.license !='undefined' ?'/documents/'+req.files.license[0].filename:'', 
             insurance:'/documents/'+req.files.insurance[0].filename
             
         });
     }
       
      
         var bank_detail         =  await Bank_detail.findOne({where:{provider_id:provider.id}}); 
        
    
         return res.json({status:true,message:'Document uploaded successfully'})
     }catch(err){
       // return res.json(err)
        return res.json({status:false,message:'Something is wrong.'}); 
      
     }  
});

// dashboard
router.post('/dashboard',accessToken,async(req,res) =>{
       
        // const {page} = req.body;
        var pageAsNumber = Number.parseInt(req.body.page);
        var sizeAsNumber = Number.parseInt(req.query.size);
    try{
               
          var page = 1;
          
          if(!Number.isNaN(pageAsNumber) && pageAsNumber > 1 ){
             page = pageAsNumber; 
          }
          
          var size = 10;
          if(!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 10){
              size = sizeAsNumber;
          }
        
          var provider = await User.findOne({where:{id:req.user.user_id,is_deleted:0}}); 
        //   return res.json(provider)
          if(!provider) return res.json({status:false,message:'Provider not found.'});
          
          //   dont change messages using in android side
          if(provider.is_blocked==1) return res.json({status:false,message:'Provider is blocked.'});
          
          if(provider.admin_approved!=1) return res.json({status:false,message:'Provider is not approved by Admin.'});
          
        //   return res.json(provider.id)
          
          var provider_category = await Provider_equipment.findAll({where:{is_deleted:0,provider_id:provider.id}})
        
       
            let group = (provider_category).reduce((r, a) => {
            r[a.category_id] = [...r[a.category_id] || [], a];
            return r;
            }, {});
            
            //   return res.json(group)
             
            var categories = [];
           
            // group.push(group)
            // return res.json(categories)
              Object.keys(group).forEach((k,v) => {
                      
                    categories.push(k)
                    
                    // categories.push(k)
                    
                    
                  });
        //  return res.json(categories)
           
           
                
        
         var declined_list= [];
         const declined_orders = await Declined_order.findAll({
             where:{provider_id:provider.id},
             attributes:['order_id']
         });
             
         for(var i=0; i<declined_orders.length; i++){
             declined_list.push(declined_orders[i].order_id)
         }
         
         var radius = await Setting.findOne({where:{field_key:'radius'}}); 
        
      
               
                  if(categories=="1","2")
                  {
                      var options ={order_id:{[Op.not]:declined_list},
                                             payment_status:2,
                                             status:1}
                      
                  }
                  
                  if(categories=="1")
                  {
                       var options ={order_id:{[Op.not]:declined_list},
                                             payment_status:2,
                                             category_id:1,
                                             status:1}
                      
                  }
                  
                  if(categories=="2")
                  {
                       var options ={order_id:{[Op.not]:declined_list},
                                             payment_status:2,
                                             category_id:2,
                                             status:1}
                      
                  }
        
         var radius    = await Setting.findOne({where:{field_key:'radius'}});
         const orderRawdata = await Order.findAll({
                                             where:options,
                                             attributes: [
                                            'id',
                                            'order_id',
                                            'category_id',
                                            'date',
                                            'on_demand',
                                            'service_for',
                                            'property_id',
                                            'lawn_size_id',
                                            'lawn_height_id',
                                            'fence_id',
                                            'fence_amount',
                                            'period_amount',
                                            'img1',
                                            'img2',
                                            'img3',
                                            'img4',
                                            'cleanup_id',
                                            'cleanup_amount',
                                            'corner_lot_id',
                                            'corner_lot_amount',
                                            'service_type',
                                            'recurring_service_id',
                                            'color_id',
                                            'car_number',
                                            'driveway',
                                            'driveway_amount',
                                            'sidewalk_id',
                                            'sidewalk_amount',
                                            'walkway_id',
                                            'walkway_amount',
                                            'admin_fee_perc',
                                            'admin_fee',
                                            'total_amount',
                                            'on_the_way',
                                            'at_location',
                                            'started_job',
                                            'finished_job',
                                            'grand_total',
                                            'tip',
                                            'status',
                                            'subcategory_id',
                                            'instructions',
                                            'gate_code',
                                            'provider_amount',
                                            [Sequelize.literal("6371 * acos(cos(radians("+parseFloat(provider.lat)+")) * cos(radians(lat)) * cos(radians("+parseFloat(provider.lng)+") - radians(lng)) + sin(radians("+parseFloat(provider.lat)+")) * sin(radians(lat)))"),'distance']],
                                            having: Sequelize.literal('distance < '+parseFloat(radius.field_value)),
                                            //  order: Sequelize.literal('distance ASC'),
                                             logging: console.log,
                                             include:[
                                                      {model:Lawn_size ,as:'lawn_size'},
                                                      {model:Lawn_height,as:'lawn_height'},
                                                      {model:Property,as:'property'},
                                                      {model:Subcategory,as:'subcategory'},
                                                      {model:Fence,as:'fence'},
                                                      {model:Cleanup,as:'cleanup'},
                                                      {model:Report,as:'report_table'},
                                                      {model:Color,as:'color'},
                                                      {
                                                         model:Order_sidewalk,
                                                         as:'order_sidewalks',
                                                         include:[
                                                                  {model:Sidewalk,as:'sidewalk'}
                                                                 ]
                                                         
                                                     },
                                                     {
                                                         model:Order_walkway,
                                                         as:'order_walkways',
                                                         include:[
                                                                  {model:Walkway,as:'walkway'}
                                                                 ]
                                                         
                                                     },
                                                    //   {model:Order_image,as:'order_images',where:{},order:[['id','desc']]}
                                                     ],
                                                     limit:size,
                                                     offset:(page-1) * size,
                                                     order:[['id','desc']]
                                          });
                                          
                              
                                    
              const totalRows = await Order.findAll({
                                             where:{
                                             order_id:{[Op.not]:declined_list},
                                             payment_status:2,
                                             status:1},
                                             attributes: { 
                                              include: [[Sequelize.fn("COUNT", Sequelize.col('id')), "total"]] ,  
                                             },
                                             raw:true
                                          });
                                        //   return res.json(totalRows[0].total)
                                          
         var question = await Question.findAll({
             where:{is_deleted:0},
             order:[['id','desc']]
             
         });
      
   
             
         var working_status='';
         var order_table= await Order.findOne({where:{started_job:1,assigned_to:provider.id,is_deleted:0,finished_job:0,status:2}, order:[['updatedAt','desc']],})
         if(order_table!=null)
         {
             var working_status=order_table.order_id;
         }
        //  return res.json(order_table)
       
         var order =[];
        //var orderRaw = orderRawdata.rows;
        var orderRaw = orderRawdata;
        
        // return res.json(orderRaw)
       
         for(var i=0; i<orderRaw.length; i++){
             
             if(orderRaw[i].status==1){
                var status = "Pending" 
             }
             if(orderRaw[i].status==3){
                var status = "Completed"; 
             }
             
             var subamount = parseFloat(orderRaw[i].total_amount) - parseFloat(orderRaw[i].admin_fee);
             var totalAmt = parseFloat(subamount) + parseFloat(orderRaw[i].tip);
            //  if(orderRaw[i].status==1){
            //     var status =  
            //  }
             
            
             var before_order_image = await Order_image.findAll({where:{order_id:orderRaw[i].order_id,type:'before',is_deleted:0}});
             var after_order_image = await Order_image.findAll({where:{order_id:orderRaw[i].order_id,type:'after',is_deleted:0}});
             
                    if(orderRaw[i].category_id==1){
                    
                            order.push({
                            order_id:orderRaw[i].order_id,
                            category: (orderRaw[i].category_id==1) ? "Lawn Mowing":"Snow Removal",
                            datetime:moment(orderRaw[i].date).format('MM-DD-YYYY'),
                            on_demand:orderRaw[i].on_demand,
                            service_for:(orderRaw[i].service_for)?orderRaw[i].service_for:'',
                            
                            address:orderRaw[i].property.address,
                            lat:orderRaw[i].property.lat,
                            lng:orderRaw[i].property.lng,
                            
                            
                            ///
                            report_status:(orderRaw[i].report_table!=null) ? 1:0,
                           
                           
                            corner_lot_id:(orderRaw[i].corner_lot_id) ? parseInt(orderRaw[i].corner_lot_id):0,
                            corner_lot_amount:(orderRaw[i].corner_lot_amount) ? orderRaw[i].corner_lot_amount :0,
                            property_image:(orderRaw[i].property)     ? orderRaw[i].property.image:"",
                            
                            lawn_size:(orderRaw[i].lawn_size)       ? orderRaw[i].lawn_size.name:'',
                            lawn_size_price:(orderRaw[i].lawn_size) ? orderRaw[i].lawn_size_amount:0,
                            
                            lawn_height:(orderRaw[i].lawn_height)       ? orderRaw[i].lawn_height.name:'',
                            lawn_height_price:(orderRaw[i].lawn_height) ? orderRaw[i].lawn_height_amount:0,
                            
                            fence:(orderRaw[i].fence)                 ? orderRaw[i].fence.name:'',
                            fence_price:(orderRaw[i].fence)           ? orderRaw[i].fence_amount:0,
                            yard_cleanup:(orderRaw[i].cleanup)          ? orderRaw[i].cleanup.name:'',
                            yard_cleanup_price:(orderRaw[i].cleanup)  ? orderRaw[i].cleanup_amount:0,
                            gate_code:orderRaw[i].gate_code,
                            instructions:orderRaw[i].instructions,
                            
                            
                            // cornal_lot:orderRaw[i]
                            subcategory_id:(orderRaw[i].subcategory_id) ? orderRaw[i].subcategory_id:0,
                            subcategory_name:(orderRaw[i].subcategory !=null) ? orderRaw[i].subcategory.name:'',
                            subcategory_amount:(orderRaw[i].subcategory!=null) ? orderRaw[i].subcategory_amount:0,
                            
                            color_name:(orderRaw[i].color_id) ? orderRaw[i].color.name:'', 
                            car_number:(orderRaw[i].car_number) ? orderRaw[i].car_number:'',
                            
                            
                            driveway:0,
                            driveway_price:0,
                            sidewalk:[],
                            sidewalk_price:0,
                            walkway:[],
                            walkway_price:0,
                            
                            
                            // before_img1:(orderRaw[i].img1)     ? orderRaw[i].img1:"",
                            // before_img2:(orderRaw[i].img2)     ? orderRaw[i].img2:"",
                            // before_img3:(orderRaw[i].img3)     ? orderRaw[i].img3:"",
                            // before_img4:(orderRaw[i].img4)     ? orderRaw[i].img4:"",
                            
                            
                           
                            img1:(orderRaw[i].img1)     ? orderRaw[i].img1:"",
                            img2:(orderRaw[i].img2)     ? orderRaw[i].img2:"",
                            img3:(orderRaw[i].img3)     ? orderRaw[i].img3:"",
                            img4:(orderRaw[i].img4)     ? orderRaw[i].img4:"",
                            
                            before_image:(before_order_image.length!=0) ? before_order_image:[],
                            after_image:(after_order_image.length!=0) ? after_order_image:[],
                            
                            on_the_way:orderRaw[i].on_the_way,
                            at_location:orderRaw[i].at_location,
                            started_job:orderRaw[i].started_job,
                            finished_job:orderRaw[i].finished_job,
                            status,
                            // admin_fee:orderRaw[i].admin_fee,
                            // tax:orderRaw[i].tax,
                            // total_amount:parseFloat(totalAmt.toFixed(2)),
                            total_amount:(orderRaw[i]) ? orderRaw[i].provider_amount.toFixed(2):'0',
                            question,
                            
                            
                            })
                    
                    }
              
                if(orderRaw[i].category_id==2){
                          
                          
                          if(orderRaw[i].service_for=="CAR"){
                              
                            order.push({
                            order_id:orderRaw[i].order_id,
                            category: (orderRaw[i].category_id==1) ? "Lawn Mowing":"Snow Removal",
                            datetime:moment(orderRaw[i].date).format('MM-DD-YYYY'),
                            on_demand:orderRaw[i].on_demand,
                            service_for:(orderRaw[i].service_for)?orderRaw[i].service_for:"",
                            address:orderRaw[i].property.address,
                            lat:orderRaw[i].property.lat,
                            lng:orderRaw[i].property.lng,
                          
                            report_status:(orderRaw[i].report_table!=null) ? 1:0,
                          
                            corner_lot_id:(orderRaw[i].corner_lot_id) ? parseInt(orderRaw[i].corner_lot_id):0,
                            corner_lot_amount:(orderRaw[i].corner_lot_amount) ? orderRaw[i].corner_lot_amount :0,
                            
                            property_image:(orderRaw[i].property) ? orderRaw[i].property.image:"",
                            
                            lawn_size:(orderRaw[i].lawn_size)       ? orderRaw[i].lawn_size.name:'',
                            lawn_size_price:(orderRaw[i].lawn_size) ? orderRaw[i].lawn_size_amount:0,
                            
                            lawn_height:(orderRaw[i].lawn_height)       ? orderRaw[i].lawn_height.name:'',
                            lawn_height_price:(orderRaw[i].lawn_height) ? orderRaw[i].lawn_height_amount:0,
                            
                            
                            // fence:(orderRaw[i].fence)                 ? orderRaw[i].fence.name:'',
                            // fence_price:(orderRaw[i].fence_id)           ? orderRaw[i].fence_amount:0,
                            // yard_cleanup:(orderRaw[i].cleanup)        ? orderRaw[i].cleanup.name:'',
                            // yard_cleanup_price:(orderRaw[i].cleanup)  ? orderRaw[i].cleanup.price:0,
                            
                            fence:(orderRaw[i].fence)                 ? orderRaw[i].fence.name:'',
                            fence_price:(orderRaw[i].fence)           ? orderRaw[i].fence_amount:0,
                            yard_cleanup:(orderRaw[i].cleanup)        ? orderRaw[i].cleanup.name:'',
                            yard_cleanup_price:(orderRaw[i].cleanup)  ? orderRaw[i].cleanup_amount:0,
                            
                            gate_code:orderRaw[i].gate_code,
                            instructions:orderRaw[i].instructions,
                            
                            
                            
                            subcategory_id:(orderRaw[i].subcategory_id) ? orderRaw[i].subcategory_id:0,
                            subcategory_name:(orderRaw[i].subcategory !=null) ? orderRaw[i].subcategory.name:'',
                            subcategory_amount:(orderRaw[i].subcategory!=null) ? orderRaw[i].subcategory_amount:0,
                            
                            color_name:(orderRaw[i].color_id) ? orderRaw[i].color.name:'', 
                            car_number:(orderRaw[i].car_number) ? orderRaw[i].car_number:'',
                            
                            
                            driveway:0,
                            driveway_price:0,
                            
                            sidewalk:[],
                            sidewalk_price:0,
                            walkway:[],
                            walkway_price:0,
                            
                            
                            // before_img1:(orderRaw[i].img1)     ? orderRaw[i].img1:"",
                            // before_img2:(orderRaw[i].img2)     ? orderRaw[i].img2:"",
                            // before_img3:(orderRaw[i].img3)     ? orderRaw[i].img3:"",
                            // before_img4:(orderRaw[i].img4)     ? orderRaw[i].img4:"",
                            
                            
                            
                            img1:(orderRaw[i].img1)     ? orderRaw[i].img1:"",
                            img2:(orderRaw[i].img2)     ? orderRaw[i].img2:"",
                            img3:(orderRaw[i].img3)     ? orderRaw[i].img3:"",
                            img4:(orderRaw[i].img4)     ? orderRaw[i].img4:"",
                            
                            before_image:(before_order_image.length!=0) ? before_order_image:[],
                            after_image:(after_order_image.length!=0) ? after_order_image:[],
                            
                            on_the_way:orderRaw[i].on_the_way,
                            at_location:orderRaw[i].at_location,
                            started_job:orderRaw[i].started_job,
                            finished_job:orderRaw[i].finished_job,
                            status,
                            // total_amount:parseFloat(totalAmt.toFixed(2)),
                           total_amount:(orderRaw[i]) ? orderRaw[i].provider_amount.toFixed(2):'0',
                            question,
                            
                            
                            })
                            
                            
                          }
                           
                          if(orderRaw[i].service_for=="HOME"){
                          
                        //   var  hsidewalk   = await  Sidewalk.findOne({ where:{id:orderRaw[i].sidewalk_id,type:'HOME',is_deleted:0}});
                        //   var  hwalkway    = await  Walkway.findOne({where:{id:orderRaw[i].walkway_id,type:'HOME',is_deleted:0}});
              
           
                             var sidewalk_names = [];
                             
                             if(orderRaw[i].order_sidewalks){
                             for(var j = 0; j < orderRaw[i].order_sidewalks.length; j++){
                                  sidewalk_names.push({sidewalk:(orderRaw[i].order_sidewalks)[j].sidewalk.name});
                             }
                             }
                             
                             var walkway_names = [];
                             if(orderRaw[i].order_walkways){
                                 for(var j = 0; j < orderRaw[i].order_walkways.length; j++){
                                     walkway_names.push({walkway:(orderRaw[i].order_walkways)[j].walkway.name});
                                 }
                             }
            
            
                            order.push({
                            order_id:orderRaw[i].order_id,
                            category: (orderRaw[i].category_id==1) ? "Lawn Mowing":"Snow Removal",
                            datetime:moment(orderRaw[i].date).format('MM-DD-YYYY'),
                            on_demand:orderRaw[i].on_demand,
                            service_for:(orderRaw[i].service_for)?orderRaw[i].service_for:'',
                            address:orderRaw[i].property.address,
                            lat:orderRaw[i].property.lat,
                            lng:orderRaw[i].property.lng,
                            
                            
                            report_status:(orderRaw[i].report_table!=null) ? 1:0,
                            
                            corner_lot_id:(orderRaw[i].corner_lot_id) ? parseInt(orderRaw[i].corner_lot_id):0,
                            corner_lot_amount:(orderRaw[i].corner_lot_amount) ? orderRaw[i].corner_lot_amount :0,
                            
                            property_image:(orderRaw[i].property) ? orderRaw[i].property.image:"",
                            
                            lawn_size:(orderRaw[i].lawn_size)       ? orderRaw[i].lawn_size.name:'',
                            lawn_size_price:(orderRaw[i].lawn_size) ? orderRaw[i].lawn_size_amount:0,
                            
                            lawn_height:(orderRaw[i].lawn_height)       ? orderRaw[i].lawn_height.name:'',
                            lawn_height_price:(orderRaw[i].lawn_height) ? orderRaw[i].lawn_height_amount:0,
                            
                            
                            // fence:(orderRaw[i].fence)                    ? orderRaw[i].fence.name:'',
                            // fence_price:(orderRaw[i].fence_id)           ? orderRaw[i].fence_amount:0,
                            // yard_cleanup:(orderRaw[i].cleanup)           ? orderRaw[i].cleanup.name:'',
                            // yard_cleanup_price:(orderRaw[i].cleanup_id)  ? orderRaw[i].cleanup_amount:0,
                            
                            
                            fence:(orderRaw[i].fence)                  ? orderRaw[i].fence.name:'',
                            fence_price:(orderRaw[i].fence)            ? orderRaw[i].fence_amount:0,
                            yard_cleanup:(orderRaw[i].cleanup)         ? orderRaw[i].cleanup.name:'',
                            yard_cleanup_price:(orderRaw[i].fence_id)  ? orderRaw[i].cleanup_amount:0,
                            
                            
                            gate_code:orderRaw[i].gate_code,
                            instructions:orderRaw[i].instructions,
                            
                            
                            subcategory_id:(orderRaw[i].subcategory_id) ? orderRaw[i].subcategory_id:0,
                            subcategory_name:(orderRaw[i].subcategory !=null) ? orderRaw[i].subcategory.name:'',
                            subcategory_amount:(orderRaw[i].subcategory!=null) ? orderRaw[i].subcategory_amount:0,
                            
                            color_name:(orderRaw[i].color_id) ? orderRaw[i].color.name:'', 
                            car_number:(orderRaw[i].car_number) ? orderRaw[i].car_number:'',
                            
                            
                            driveway:(orderRaw[i].driveway) ? orderRaw[i].driveway:0,
                            driveway_price:(orderRaw[i].driveway_amount) ? orderRaw[i].driveway_amount:0,
                            
                            sidewalk:sidewalk_names,
                            total_sidewalk:(orderRaw[i].order_sidewalks)? (orderRaw[i].order_sidewalks).length:0,
                            sidewalk_price:(orderRaw[i].sidewalk_amount) ? orderRaw[i].sidewalk_amount:0,
                            
                            walkway:walkway_names,
                            total_walkway:(orderRaw[i].order_walkways)? (orderRaw[i].order_walkways).length:0,
                            walkway_price:(orderRaw[i].walkway_amount)  ? orderRaw[i].walkway_amount:0,
                            
                          
                            // before_img1:(orderRaw[i].img1)     ? orderRaw[i].img1:"",
                            // before_img2:(orderRaw[i].img2)     ? orderRaw[i].img2:"",
                            // before_img3:(orderRaw[i].img3)     ? orderRaw[i].img3:"",
                            // before_img4:(orderRaw[i].img4)     ? orderRaw[i].img4:"",
                            
                            
                            
                            img1:(orderRaw[i].img1)     ? orderRaw[i].img1:"",
                            img2:(orderRaw[i].img2)     ? orderRaw[i].img2:"",
                            img3:(orderRaw[i].img3)     ? orderRaw[i].img3:"",
                            img4:(orderRaw[i].img4)     ? orderRaw[i].img4:"",
                            
                            before_image:(before_order_image.length!=0) ? before_order_image:[],
                            after_image:(after_order_image.length!=0) ? after_order_image:[],
                            
                            on_the_way:orderRaw[i].on_the_way,
                            at_location:orderRaw[i].at_location,
                            started_job:orderRaw[i].started_job,
                            finished_job:orderRaw[i].finished_job,
                            status,
                            // total_amount:parseFloat(totalAmt.toFixed(2)),
                            total_amount:(orderRaw[i]) ? orderRaw[i].provider_amount.toFixed(2):'0',
                            question,
                            // test:sidewalk_names,
                            
                            })
                            
                            
                            
                          }
              
                          if(orderRaw[i].service_for=="BUSINESS"){
                            
                            
                            
                              var sidewalk_names = [];
                             
                             if(orderRaw[i].order_sidewalks){
                             for(var j = 0; j < orderRaw[i].order_sidewalks.length; j++){
                                  sidewalk_names.push({sidewalk:(orderRaw[i].order_sidewalks)[j].sidewalk.name});
                             }
                             }
                             
                             var walkway_names = [];
                             if(orderRaw[i].order_walkways){
                                 for(var j = 0; j < orderRaw[i].order_walkways.length; j++){
                                     walkway_names.push({walkway:(orderRaw[i].order_walkways)[j].walkway.name});
                                 }
                             }
                            
                             
                          
                             
                            order.push({
                            order_id:orderRaw[i].order_id,
                            category: (orderRaw[i].category_id==1) ? "Lawn Mowing":"Snow Removal",
                            datetime:moment(orderRaw[i].date).format('MM-DD-YYYY'),
                            on_demand:orderRaw[i].on_demand,
                            service_for:(orderRaw[i].service_for)?orderRaw[i].service_for:'',
                            address:orderRaw[i].property.address,
                            lat:orderRaw[i].property.lat,
                            lng:orderRaw[i].property.lng,
                            
                            
                            report_status:(orderRaw[i].report_table!=null) ? 1:0,
                            
                            corner_lot_id:(orderRaw[i].corner_lot_id) ? parseInt(orderRaw[i].corner_lot_id):0,
                            corner_lot_amount:(orderRaw[i].corner_lot_amount) ? orderRaw[i].corner_lot_amount :0,
                            
                            property_image:(orderRaw[i].property)? orderRaw[i].property.image:"",
                            // lawn_size:(orderRaw[i].lawn_height)       ? orderRaw[i].lawn_height.name:'',
                            // lawn_size_price:(orderRaw[i].lawn_height) ? orderRaw[i].lawn_height.price:0,
                            // lawn_height:(orderRaw[i].lawn_size)       ? orderRaw[i].lawn_size.name:'',
                            // lawn_height_price:(orderRaw[i].lawn_size) ? orderRaw[i].lawn_size.price:0,
                            
                            lawn_size:(orderRaw[i].lawn_size)       ? orderRaw[i].lawn_size.name:'',
                            lawn_size_price:(orderRaw[i].lawn_size) ? orderRaw[i].lawn_size_amount:0,
                            
                            lawn_height:(orderRaw[i].lawn_height)       ? orderRaw[i].lawn_height.name:'',
                            lawn_height_price:(orderRaw[i].lawn_height) ? orderRaw[i].lawn_height_amount:0,
                            
                            fence:(orderRaw[i].fence)                 ? orderRaw[i].fence.name:'',
                            fence_price:(orderRaw[i].fence)           ? orderRaw[i].fence_amount:0,
                            yard_cleanup:(orderRaw[i].cleanup)        ? orderRaw[i].cleanup.name:'',
                            yard_cleanup_price:(orderRaw[i].fence_id)  ? orderRaw[i].cleanup_amount:0,
                            gate_code:orderRaw[i].gate_code,
                            instructions:orderRaw[i].instructions,
                            
                            
                            
                            subcategory_id:(orderRaw[i].subcategory_id) ? orderRaw[i].subcategory_id:0,
                            subcategory_name:(orderRaw[i].subcategory !=null) ? orderRaw[i].subcategory.name:'',
                            subcategory_amount:(orderRaw[i].subcategory!=null) ? orderRaw[i].subcategory_amount:0,
                            
                            color_name:(orderRaw[i].color_id) ? orderRaw[i].color.name:'', 
                            car_number:(orderRaw[i].car_number) ? orderRaw[i].car_number:'',
                            
                            
                            driveway:(orderRaw[i].driveway) ? orderRaw[i].driveway:0,
                            driveway_price:(orderRaw[i].driveway_amount) ? orderRaw[i].driveway_amount:0,
                            
                            sidewalk:sidewalk_names,
                            total_sidewalk:(orderRaw[i].order_sidewalks)? (orderRaw[i].order_sidewalks).length:0,
                            sidewalk_price:(orderRaw[i].sidewalk_amount) ? orderRaw[i].sidewalk_amount:0,
                            
                            walkway:walkway_names,
                            total_walkway:(orderRaw[i].order_walkways)? (orderRaw[i].order_walkways).length:0,
                            walkway_price:(orderRaw[i].walkway_amount)  ? orderRaw[i].walkway_amount:0,
                            
                            
                            // before_img1:(orderRaw[i].img1)     ? orderRaw[i].img1:"",
                            // before_img2:(orderRaw[i].img2)     ? orderRaw[i].img2:"",
                            // before_img3:(orderRaw[i].img3)     ? orderRaw[i].img3:"",
                            // before_img4:(orderRaw[i].img4)     ? orderRaw[i].img4:"",
                            
                            
                            
                            img1:(orderRaw[i].img1)     ? orderRaw[i].img1:"",
                            img2:(orderRaw[i].img2)     ? orderRaw[i].img2:"",
                            img3:(orderRaw[i].img3)     ? orderRaw[i].img3:"",
                            img4:(orderRaw[i].img4)     ? orderRaw[i].img4:"",
                            
                            before_image:(before_order_image.length!=0) ? before_order_image:[],
                            after_image:(after_order_image.length!=0) ? after_order_image:[],
                            
                            on_the_way:orderRaw[i].on_the_way,
                            at_location:orderRaw[i].at_location,
                            started_job:orderRaw[i].started_job,
                            finished_job:orderRaw[i].finished_job,
                            status,
                            // total_amount:parseFloat(totalAmt.toFixed(2)),
                           total_amount:(orderRaw[i]) ? orderRaw[i].provider_amount.toFixed(2):'0',
                            question,
                            
                            
                            })
                            
                            
                          }
              
                
                         
                
                }
            
         }
        
         var total_page = (totalRows) ? Math.ceil(totalRows[0].total/size):0;
        return res.json({status:true,data:{available_status:provider.is_available,order,working_status,total_page},message:'New jobs list.'});
    }catch(err){
        // console.log(err)
       // return res.json(err)
        return res.json({status:false,message:'something is wrong.'});
    }
});




// jobs  ACTIVE,COMPLETED
router.post('/jobs',accessToken,async(req,res) =>{
    
     const { job_type } = req.body;
     if(!job_type) return res.json({status:false,message:'Job type is required.'});
     
   
    try{
          var provider = await User.findOne({where:{id:req.user.user_id,is_deleted:0}}); 
          if(!provider) return res.json({status:false,message:'Provider not found.'});
          
          //   dont change messages using in android side
          if(provider.is_blocked==1) return res.json({status:false,message:'Provider is blocked.'});
          
          if(provider.admin_approved!=1) return res.json({status:false,message:'Provider is not approved by Admin.'});
          
        //   pagination
          var pageAsNumber = Number.parseInt(req.body.page);
          var sizeAsNumber = Number.parseInt(req.query.size);
          
        //   var page = 0;
        //   if(!Number.isNaN(pageAsNumber) && pageAsNumber > 0 ){
        //       page = pageAsNumber;
        //   }
          
        //   var size = 10;
        //   if(!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 10){
        //       size= sizeAsNumber;
        //   }
        
          var page = 1;
          
          if(!Number.isNaN(pageAsNumber) && pageAsNumber > 1 ){
             page = pageAsNumber; 
          }
          
          var size = 10;
          if(!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 10){
              size = sizeAsNumber;
          }
          
          
         
         
         
          var declined_list= [];
         const declined_orders = await Declined_order.findAll({
                 where:{provider_id:provider.id},
                 attributes:['order_id']
         });
         
         for(var i=0; i<declined_orders.length; i++){
             declined_list.push(declined_orders[i].order_id)
         }
         
         
         
         var provider_category = await Provider_equipment.findAll({where:{is_deleted:0,provider_id:provider.id}})
        
       
            let group = (provider_category).reduce((r, a) => {
          
            r[a.category_id] = [...r[a.category_id] || [], a];
            return r;
            }, {});
            
           
             
            var categories = [];
           
            
              Object.keys(group).forEach((k,v) => {
                      
                    categories.push(k)
                    
                    
                    
                    
                  });
        
               
         
         
         
         
         
          if(job_type=='PENDING'){
            //   var status = 1;
              
              if(categories=="1","2")
                  {
                      var options ={order_id:{[Op.not]:declined_list},
                                             payment_status:2,
                                             status:1}
                      
                  }
                  
                  if(categories=="1")
                  {
                       var options ={order_id:{[Op.not]:declined_list},
                                             payment_status:2,
                                             category_id:1,
                                             status:1}
                      
                  }
                  
                  if(categories=="2")
                  {
                       var options ={order_id:{[Op.not]:declined_list},
                                             payment_status:2,
                                             category_id:2,
                                             status:1}
                      
                  }
         
    
            
             var radius    = await Setting.findOne({where:{field_key:'radius'}});
             var orderRawdata = await Order.findAll({
                                             where:options,
                                             attributes: [
                                            'id',
                                            'order_id',
                                            'category_id',
                                            'date',
                                            'on_demand',
                                            'service_for',
                                            'property_id',
                                            'lawn_size_id',
                                            'lawn_height_id',
                                            'fence_id',
                                            'fence_amount',
                                            'period_amount',
                                            'img1',
                                            'img2',
                                            'img3',
                                            'img4',
                                            'cleanup_id',
                                            'cleanup_amount',
                                            'corner_lot_id',
                                            'corner_lot_amount',
                                            'service_type',
                                            'recurring_service_id',
                                            'color_id',
                                            'car_number',
                                            'driveway',
                                            'driveway_amount',
                                            'sidewalk_id',
                                            'sidewalk_amount',
                                            'walkway_id',
                                            'walkway_amount',
                                            'admin_fee_perc',
                                            'admin_fee',
                                            'total_amount',
                                            'on_the_way',
                                            'at_location',
                                            'started_job',
                                            'finished_job',
                                            'grand_total',
                                            'tip',
                                            'status',
                                            'subcategory_id',
                                            'instructions',
                                            'gate_code',
                                            'provider_amount',
                                            [Sequelize.literal("6371 * acos(cos(radians("+parseFloat(provider.lat)+")) * cos(radians(lat)) * cos(radians("+parseFloat(provider.lng)+") - radians(lng)) + sin(radians("+parseFloat(provider.lat)+")) * sin(radians(lat)))"),'distance']],
                                            having: Sequelize.literal('distance < '+parseFloat(radius.field_value)),
                                            //  order: Sequelize.literal('distance ASC'),
                                             logging: console.log,
                                             include:[
                                                      {model:Lawn_size ,as:'lawn_size'},
                                                      {model:Lawn_height,as:'lawn_height'},
                                                      {model:Property,as:'property'},
                                                      {model:Subcategory,as:'subcategory'},
                                                      {model:Fence,as:'fence'},
                                                      {model:Cleanup,as:'cleanup'},
                                                      {model:Report,as:'report_table'},
                                                      {model:Color,as:'color'},
                                                      {
                                                         model:Order_sidewalk,
                                                         as:'order_sidewalks',
                                                         include:[
                                                                  {model:Sidewalk,as:'sidewalk'}
                                                                 ]
                                                         
                                                     },
                                                     {
                                                         model:Order_walkway,
                                                         as:'order_walkways',
                                                         include:[
                                                                  {model:Walkway,as:'walkway'}
                                                                 ]
                                                         
                                                     },
                                                    //   {model:Order_image,as:'order_images',where:{},order:[['id','desc']]}
                                                     ],
                                                     limit:size,
                                                     offset:(page-1) * size,
                                                     order:[['id','desc']]
                                          });
                                        
                                        
                                        
                  var totalRows = await Order.findAll({
                          where:options,
                          attributes: [
                                            'id',
                                            'order_id',
                                            'category_id',
                                            'date',
                                            'on_demand',
                                            'service_for',
                                            'property_id',
                                            'lawn_size_id',
                                            'lawn_height_id',
                                            'fence_id',
                                            'fence_amount',
                                            'period_amount',
                                            'img1',
                                            'img2',
                                            'img3',
                                            'img4',
                                            'cleanup_id',
                                            'cleanup_amount',
                                            'corner_lot_id',
                                            'corner_lot_amount',
                                            'service_type',
                                            'recurring_service_id',
                                            'color_id',
                                            'car_number',
                                            'driveway',
                                            'driveway_amount',
                                            'sidewalk_id',
                                            'sidewalk_amount',
                                            'walkway_id',
                                            'walkway_amount',
                                            'admin_fee_perc',
                                            'admin_fee',
                                            'total_amount',
                                            'on_the_way',
                                            'at_location',
                                            'started_job',
                                            'finished_job',
                                            'grand_total',
                                            'tip',
                                            'status',
                                            'subcategory_id',
                                            'instructions',
                                            'gate_code',
                                            'provider_amount',
                                            [Sequelize.literal("6371 * acos(cos(radians("+parseFloat(provider.lat)+")) * cos(radians(lat)) * cos(radians("+parseFloat(provider.lng)+") - radians(lng)) + sin(radians("+parseFloat(provider.lat)+")) * sin(radians(lat)))"),'distance'],
                                            [Sequelize.fn("COUNT", Sequelize.col('id')), "total"]],
                                            having: Sequelize.literal('distance < '+parseFloat(radius.field_value)),
                                            raw:true
                  
                     
                  });
                                          
                    // return res.json(totalRows)                   
          }else if(job_type=='ACCEPTED'){
            //   var status = 2;
              
              if(categories=="1","2")
                  {
                      var options ={order_id:{[Op.not]:declined_list},
                                             payment_status:2,
                                             status:2,
                                             assigned_to:req.user.user_id
                                                    
                      }
                      
                  }
                  
                  if(categories=="1")
                  {
                       var options ={order_id:{[Op.not]:declined_list},
                                             payment_status:2,
                                             category_id:1,
                                             status:2,
                                             assigned_to:req.user.user_id
                       }
                      
                  }
                  
                  if(categories=="2")
                  {
                       var options ={order_id:{[Op.not]:declined_list},
                                             payment_status:2,
                                             category_id:2,
                                             status:2,
                                             assigned_to:req.user.user_id
                       }
                      
                  }
         
             
             var orderRawdata = await Order.findAll({
                                             where:options,
                                             include:[
                                                      {model:Lawn_size ,as:'lawn_size'},
                                                      {model:Lawn_height,as:'lawn_height'},
                                                      {model:Property,as:'property'},
                                                      {model:Subcategory,as:'subcategory'},
                                                      {model:Fence,as:'fence'},
                                                      {model:Cleanup,as:'cleanup'},
                                                      {model:Report,as:'report_table'},
                                                      {model:Color,as:'color'},
                                                      {
                                                         model:Order_sidewalk,
                                                         as:'order_sidewalks',
                                                         include:[
                                                                  {model:Sidewalk,as:'sidewalk'}
                                                                 ]
                                                         
                                                     },
                                                     {
                                                         model:Order_walkway,
                                                         as:'order_walkways',
                                                         include:[
                                                                  {model:Walkway,as:'walkway'}
                                                                 ]
                                                         
                                                     },
                                                    //   {model:Order_image,as:'order_images',where:{},order:[['id','desc']]}
                                                     ],
                                                     limit:size,
                                                     offset:(page-1) * size,
                                                     order:[['id','desc']]
                                          });
                                          
                                          
                                          
                 var totalRows = await Order.findAll({
                     where:options,
                     attributes: { 
                      include: [[Sequelize.fn("COUNT", Sequelize.col('id')), "total"]] ,  
                     },
                     raw:true
                  });
                                         
                                          
          }else if(job_type=='COMPLETED'){
            //   var status = 3;
              
              if(categories=="1","2")
                  {
                      var options ={order_id:{[Op.not]:declined_list},
                                             payment_status:2,
                                             status:3,
                                            assigned_to:req.user.user_id
                      }
                      
                  }
                  
                  if(categories=="1")
                  {
                       var options ={order_id:{[Op.not]:declined_list},
                                             payment_status:2,
                                             category_id:1,
                                             status:3, assigned_to:req.user.user_id}
                      
                  }
                  
                  if(categories=="2")
                  {
                       var options ={order_id:{[Op.not]:declined_list},
                                             payment_status:2,
                                             category_id:2,
                                             status:3, assigned_to:req.user.user_id}
                      
                  }
         
              
         
            
            var orderRawdata = await Order.findAll({
                                             where:options,
                                             include:[
                                                      {model:Lawn_size ,as:'lawn_size'},
                                                      {model:Lawn_height,as:'lawn_height'},
                                                      {model:Property,as:'property'},
                                                      {model:Subcategory,as:'subcategory'},
                                                      {model:Fence,as:'fence'},
                                                      {model:Cleanup,as:'cleanup'},
                                                      {model:Report,as:'report_table'},
                                                      {model:Color,as:'color'},
                                                      {
                                                         model:Order_sidewalk,
                                                         as:'order_sidewalks',
                                                         include:[
                                                                  {model:Sidewalk,as:'sidewalk'}
                                                                 ]
                                                         
                                                     },
                                                     {
                                                         model:Order_walkway,
                                                         as:'order_walkways',
                                                         include:[
                                                                  {model:Walkway,as:'walkway'}
                                                                 ]
                                                         
                                                     },
                                                    //   {model:Order_image,as:'order_images',where:{},order:[['id','desc']]}
                                                     ],
                                                     limit:size,
                                                     offset:(page-1) * size,
                                                     order:[['id','desc']]
                                          });
                                          
                                          
                 var totalRows = await Order.findAll({
                     where:options,
                     attributes: { 
                      include: [[Sequelize.fn("COUNT", Sequelize.col('id')), "total"]] ,  
                     },
                     raw:true
                  });
                                          
                                          
          }else{
             return res.json({status:false,message:'Invalid job, type not found.'}); 
          }
         
         

         var order =[];
         var orderRaw = orderRawdata;
        // 

         for(var i=0; i<orderRaw.length; i++){
             
             
                        
            var question = await Question.findAll({
                where:{is_deleted:0,category:orderRaw[i].category_id},
                attributes:['id','question'],
                order:[['id','desc']]
                
            });     
        
                var subamount = parseFloat(orderRaw[i].total_amount) - parseFloat(orderRaw[i].admin_fee);
                var totalAmt = parseFloat(subamount) + parseFloat(orderRaw[i].tip);
             
             
                var sidewalk_names = [];
                if(orderRaw[i].order_sidewalks){
                     for(var j = 0; j < orderRaw[i].order_sidewalks.length; j++){
                          sidewalk_names.push({sidewalk:(orderRaw[i].order_sidewalks)[j].sidewalk.name});
                     }
                 }
                 
                 var walkway_names = [];
                 if(orderRaw[i].order_walkways){
                     for(var j = 0; j < orderRaw[i].order_walkways.length; j++){
                         walkway_names.push({walkway:(orderRaw[i].order_walkways)[j].walkway.name});
                     }
                 }
                            
                            
                            
                            
             if(orderRaw[i].status==1){
                var status = "Pending" 
             }
             if(orderRaw[i].status==2){
                var status = "Accepted"; 
             }
             if(orderRaw[i].status==3){
                var status = "Completed"; 
             }
             
            //  if(orderRaw[i].status==1){
            //     var status =  
            //  }
             var before_order_image = await Order_image.findAll({where:{order_id:orderRaw[i].order_id,type:'before',is_deleted:0}});
             var after_order_image = await Order_image.findAll({where:{order_id:orderRaw[i].order_id,type:'after',is_deleted:0}});
             
             
             order.push({
                 
                order_id:orderRaw[i].order_id,
                category: (orderRaw[i].category_id==1) ? "Lawn Mowing":"Snow Removal",
                on_demand:orderRaw[i].on_demand,
                datetime:moment(orderRaw[i].date).format('MM-DD-YYYY'),
                address:orderRaw[i].property.address,
                lat:orderRaw[i].property.lat,
                lng:orderRaw[i].property.lng,
                service_for:(orderRaw[i].service_for)? orderRaw[i].service_for:'',
                
                corner_lot_id:(orderRaw[i].corner_lot_id)    ? parseInt(orderRaw[i].corner_lot_id):0,
                corner_lot_amount:(orderRaw[i].corner_lot_amount) ? orderRaw[i].corner_lot_amount:0,   
                
                // lawn_size:(orderRaw[i].lawn_height)       ? orderRaw[i].lawn_height.name:'',
                // lawn_size_price:(orderRaw[i].lawn_height) ? orderRaw[i].lawn_height.price:0,
                // lawn_height:(orderRaw[i].lawn_size)       ? orderRaw[i].lawn_size.name:'',
                // lawn_height_price:(orderRaw[i].lawn_size) ? orderRaw[i].lawn_size.price:0,
                
                property_image:(orderRaw[i].property)     ? orderRaw[i].property.image:'',
                
                lawn_size:(orderRaw[i].lawn_size)       ? orderRaw[i].lawn_size.name:'',
                lawn_size_price:(orderRaw[i].lawn_size) ? orderRaw[i].lawn_size_amount:0,
                            
                lawn_height:(orderRaw[i].lawn_height)       ? orderRaw[i].lawn_height.name:'',
                lawn_height_price:(orderRaw[i].lawn_height) ? orderRaw[i].lawn_height_amount:0,
                            
               
                  
                fence:(orderRaw[i].fence)                 ? orderRaw[i].fence.name:'',
                fence_price:(orderRaw[i].fence)           ? orderRaw[i].fence.price:0,
                yard_cleanup:(orderRaw[i].cleanup)        ? orderRaw[i].cleanup.name:'',
                yard_cleanup_price:(orderRaw[i].cleanup)  ? orderRaw[i].cleanup.price:0,
                gate_code:orderRaw[i].gate_code,
                instructions:orderRaw[i].instructions,
                
                
                
                subcategory_id:(orderRaw[i].subcategory_id) ? orderRaw[i].subcategory_id:0,
                subcategory_name:(orderRaw[i].subcategory !=null) ? orderRaw[i].subcategory.name:'',
                subcategory_amount:(orderRaw[i].subcategory!=null) ? orderRaw[i].subcategory.price:0,
                
                color_name:(orderRaw[i].color_id) ? orderRaw[i].color.name:'', 
                car_number:(orderRaw[i].car_number) ? orderRaw[i].car_number:'',
                 
                driveway:(orderRaw[i].driveway) ? orderRaw[i].driveway:0,
                driveway_price:(orderRaw[i].driveway_amount) ? orderRaw[i].driveway_amount:0,
                
                sidewalk:sidewalk_names,
                sidewalk_price:(orderRaw[i].sidewalk_amount) ? orderRaw[i].sidewalk_amount:0,
                
                walkway:walkway_names,
                walkway_price:(orderRaw[i].walkway_amount)  ? orderRaw[i].walkway_amount:0,
                 
                 
                // comment this old
                before_img1:(orderRaw[i].img1)     ? orderRaw[i].img1:"",
                before_img2:(orderRaw[i].img2)     ? orderRaw[i].img2:"",
                before_img3:(orderRaw[i].img3)     ? orderRaw[i].img3:"",
                before_img4:(orderRaw[i].img4)     ? orderRaw[i].img4:"",
                
                
                img1:(orderRaw[i].img1)     ? orderRaw[i].img1:"",
                img2:(orderRaw[i].img2)     ? orderRaw[i].img2:"",
                img3:(orderRaw[i].img3)     ? orderRaw[i].img3:"",
                img4:(orderRaw[i].img4)     ? orderRaw[i].img4:"",
                
                
                
                
                before_image:(before_order_image.length!=0) ? before_order_image:[],
                after_image:(after_order_image.length !=0) ? after_order_image:[],
                
                on_the_way:orderRaw[i].on_the_way,
                at_location:orderRaw[i].at_location,
                started_job:orderRaw[i].started_job,
                finished_job:orderRaw[i].finished_job,
                status,
                // total_amount:parseFloat(totalAmt.toFixed(2)),
                // total_amount:(orderRaw[i].provider_amount).toFixed(2),
                //  total_amount:(orderRaw[i].provider_amount) ? orderRaw[i].provider_amount:'0',
                 total_amount:(orderRaw[i]) ? orderRaw[i].provider_amount.toFixed(2):'0',
                question
             })
         }
         
        //  return res.json(totalRows)
          var total_page = (totalRows && totalRows.length > 0) ? Math.ceil(totalRows[0].total/size):0;
        // return res.json({status:true,data:{jobs:order,total_page:Math.ceil(orderRawdata.count/size)},message:'jobs'});
        return res.json({status:true,data:{jobs:order,total_page},message:'jobs'});
    }catch(err){
        // console.log(err)
        // return res.json(err)
        return res.json({status:false,message:'something is wrong.'});
    }
});







//  get profile

router.get('/profile-details',accessToken,async(req,res)=>{
  try{
    const provider = await User.findOne({
        where:{id:req.user.user_id,is_deleted:0},
        attributes:{exclude:['password','createdAt','updatedAt']},
        include:[
                 {model:User_detail,as:'user_documents'},
                 {model:Provider_equipment,as:'provider_equipment'},
                 {model:Bank_detail,as:'bank_details'}
                ]
    })
    
    
 
    if(!provider) return res.json({status:false,message:'User is deleted'})
    
    //   dont change messages using in android side
      if(provider.is_blocked==1) return res.json({status:false,message:'Provider is blocked.'});
      
      if(provider.admin_approved!=1) return res.json({status:false,message:'Provider not approved by admin.'});

    
    return res.json({status:true,data:{user_details:provider},message:'Service provider profile data'})
   
  }catch(err){
    console.log(err)
    return res.json({status:false,message:"somthing is wrong"})
  }
})








var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // cb(null,'backend/public/documents/')
     cb(null, path.join(__dirname,'../public/users'))
      },
    filename: function (req, file, cb) {
      cb(null, Date.now()+'.png')
    }
  })
var upload = multer({ storage: storage })


// update profile

router.post('/profile-details',accessToken,upload.single('image'),async(req,res)=>{

  const {fname,lname,address,lat,long,bio}=req.body
  if(!fname) return res.json({status:false,message:"fname is require"})
  if(!lname) return res.json({status:false,message:"lname is require"})
  if(!address) return res.json({status:false,message:"address is require"})
  if(!lat) return res.json({status:false,message:"lat is require"})
  if(!long) return res.json({status:false,message:"long is require"})

  try{
    const user = await User.findOne({where:{id:req.user.user_id,is_deleted:0}})
    if(!user) return res.json({status:false,message:'provider is deleted'})
    
     //   dont change messages using in android side
      if(user.is_blocked==1) return res.json({status:false,message:'Provider is blocked.'});
      
      if(user.admin_approved!=1) return res.json({status:false,message:'Provider is not approved by admin.'});
      
 
    user.fristname = fname;
    user.lastname = lname;
    user.address= address;
    user.lat=lat;
    user.lng =long;
    user.bio=bio;
   if(req.file){
    //   return res.json("okkk")
    user.image="/public/users/"+req.file.filename;
   }   
   
      
        // return res.json("okhhk")
    user.save();
   
    return res.json({status:true,message:'Provider profile updated'})
   
  }catch(err){
    console.log(err)
    return res.json({status:false,message:"somthing is wrong"})
  }
});






// rating post
router.post('/rating',accessToken,async(req,res)=>{
  const {review_to,comment,rating}= req.body
  if(!review_to) return res.json({status:false,message:'review to is required.'});
  if(!comment) return res.json({status:false,message:'comment  is required.'});
  if(!rating) return res.json({status:false,message:'rating  is required.'});

  try{

    const provider = await User.findOne({where:{id:req.user.user_id,is_deleted:0,role:2}})
    if(!provider) return res.json({status:false,message:"provider not found"})
    
      //   dont change messages using in android side
      if(provider.is_blocked==1) return res.json({status:false,message:'Provider is blocked.'});
      
      if(provider.admin_approved!=1) return res.json({status:false,message:'Provider not approved by admin.'});
    
  
    await Review.create({user_id:review_to,provider_id:provider.id,review_to,comment,rating})
     
    return res.json({status:true,message:"Your review has been submitted"}) 
  }catch(err){
    console.log(err)
    return res.json({status:false,message:"somthing wrong"})
  }
})



router.post('/order-status',accessToken,async(req,res)=>{
    const {order_id,status}=req.body
    
    if(!status) return res.json({status:false,message:"status is require"})
    if(!order_id) return res.json({status:false,message:"order_id is require"})
    
    try{
        
        var provider = await User.findOne({where:{id:req.user.user_id,is_deleted:0,role:2}}); 
        if(!provider) return res.json({status:false,message:'Provider not found.'});
        //   dont change messages using in android side
        if(provider.is_blocked==1) return res.json({status:false,message:'Provider is blocked.'});
      
        if(provider.admin_approved!=1) return res.json({status:false,message:'Provider not approved by admin.'});
      
        
         const  appointment = await Order.findOne({where:{order_id}})
       
         if(!appointment) return res.json({status:false,message:'Order not found.'})
        //  return res.json(appointment.assigned_to)
        //  if(appointment.assigned_to!="") return res.json({status:false,message:"Order already accepted"})
        
          
         if(status==2){
            var user= await User.findOne({where:{id:appointment.user_id,is_deleted:0}})
           if( appointment.status==2)  return res.json({status:false,message:"Job already accepted"})
            var  date_and_time=moment().format(); 
            
              const  transaction = await Transaction.findOne({where:{order_id}});
              if(!transaction) return res.json({status:false,message:'Order id is not found in transaction table.'});
              
              
              appointment.assigned_to = provider.id;
              appointment.provider_assigned_date=date_and_time;
              appointment.status=2;
              appointment.save();
             
              var recurrentHistory = await Recurring_history.findOne({where:{order_id}})
              
              if(recurrentHistory){
                   recurrentHistory.provider_id = provider.id;
                   recurrentHistory.save();
                  }
             
            
              transaction.provider_id =  provider.id;
              transaction.save();
              
              
             
             
            
            if(user.fcm_token !=''){
 
            //start notification  
            var message = { 
            to: user.fcm_token, 
            collapse_key: '',
            
            notification:{
                title:'Order Update',
                body:'Your job has been accepted'
            },
            
            data:{
                order_id:order_id,
                title:'Order Update',
                body:'Your job has been accepted',
                click_action:'job_accepted'
            }
            };
          
            fcm.send(message,function(err,response){
            if(err){
              console.log(err);
            }else{
              console.log(response);
            }
             });
             
            //end notification
            }
             
             return res.json({status:true,message:"Order has accepted. "})
         }
         
         if(status==4){ 
             
            var user = await User.findOne({where:{id:appointment.user_id,is_deleted:0}});
           
            // return res.json(user.fcm_token)
            await Declined_order.create({
                 provider_id:provider.id,
                 order_id:appointment.order_id,  
               

            });
            
        //      var payload = {
            // notification:{
            
            // title:'Order Update',
            // body:'Provider cancel order'
            // },
            //  data:{
            //     order_id:order_id,
            //     title:'Order Update',
            //     body:'Provider cancel order',
            //     click_action:'provider_cancel_order'
            // }
        //     };
            
        //     var options = {
        //     priority  : "high",
        //     timeToLive: 60 * 60 * 24,
        //     };
        
        //   var fcm  =   user.fcm_token;
        //   var test =  await adminpush1.messaging().sendToDevice(fcm,payload,options)
        
        
        //  if(user.fcm_token !=''){
                
        //     //start notification  
        //     var message = { 
        //     to: user.fcm_token, 
        //     collapse_key: '',
            
        //         notification:{
            
        //     title:'Order Update',
        //     body:'Your job has been cancelled by service provider'
        //     },
        //      data:{
        //         order_id:order_id,
        //         title:'Order Update',
        //         body:'Your job has been cancelled by service provider',
        //         click_action:'provider_cancel_order'
        //     }
        //     };
            
            
        //     fcm.send(message, function(err, response){
        //     if (err) {
        //     console.log("errrrr notification");
        //     } else {
        //     console.log("notification done");
        //     }
        //     });
        //     //end notification
        //     }
            
            
        //   return res.json(test)
            // var test =   adminpush.messaging().sendToDevice(user.fcm_token,payload,options)
            //  return res.json(test)
             return res.json({status:true,message:"Order has declined."})
         }
         
         
         return res.json({status:true,message:"Order has been changed"})
    }catch(err){
    //   return res.json(err)
        console.log(err)
        return res.json({status:false,message:"something is wrong."})
    }
})


//get review rating

router.post('/get-review',accessToken,async(req,res)=>{
    try{
        var provider = await User.findOne({where:{id:req.user.user_id,is_deleted:0,role:2}}); 
        if(!provider) return res.json({status:false,message:'Provider not found.'});
        
        
          //   dont change messages using in android side
      if(provider.is_blocked==1) return res.json({status:false,message:'Provider is blocked.'});
      
      if(provider.admin_approved!=1) return res.json({status:false,message:'Provider not approved by admin.'});
      
        
        //   pagination
          var pageAsNumber = Number.parseInt(req.query.page);
          var sizeAsNumber = Number.parseInt(req.query.size);
          
          var page = 0;
          if(!Number.isNaN(pageAsNumber) && pageAsNumber > 0 ){
              page = pageAsNumber;
          }
          
          var size = 10;
          if(!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 10){
              size= sizeAsNumber;
          }
          
        
        const reviewRawdata = await Review.findAndCountAll({
            where:{review_to:provider.id},
            include:[
                     {model:User,as:'user'}
                    ],
                    order:[['id','desc']],
                    limit:size,
                    offset:page*size
         });
         
         const totalRateAvg = await Review.findAll({
            where:{review_to:provider.id},
            attributes:[
                        [Sequelize.fn('AVG',Sequelize.col('rating')),'total_rating'],
                        [Sequelize.fn('COUNT',Sequelize.col('rating')),'total_user']
                      ],
            raw:true
         });
        //  return res.json(totalRateAvg)
         
         const poor = await Review.findAll({
            where:{review_to:provider.id,rating:1},
            attributes:[
                        [Sequelize.fn('COUNT',Sequelize.col('rating')),'poor']
                      ],
            raw:true
         });
         
         var poor_percentage = (poor[0].poor !=null || poor[0].poor!=0) ? (parseInt(poor[0].poor)/parseInt(totalRateAvg[0].total_user) * 100):0;
         
         
          const blow_average = await Review.findAll({
            where:{review_to:provider.id,rating:2},
            attributes:[
                        [Sequelize.fn('COUNT',Sequelize.col('rating')),'blow_average']
                      ],
            raw:true
         });
         
          var blow_average_percentage =  (blow_average[0].blow_average !=null || blow_average[0].blow_average !=0 ) ? (parseInt(blow_average[0].blow_average)/parseInt(totalRateAvg[0].total_user) * 100):0;
         
         const average = await Review.findAll({
            where:{review_to:provider.id,rating:3},
            attributes:[
                        [Sequelize.fn('COUNT',Sequelize.col('rating')),'average']
                      ],
            raw:true
         });
         
         
          var average_percentage = (average[0].average!=null || average[0].average !=0) ?  (parseInt(average[0].average)/parseInt(totalRateAvg[0].total_user) * 100):0;
           
         const good = await Review.findAll({
            where:{review_to:provider.id,rating:4},
            attributes:[
                        [Sequelize.fn('COUNT',Sequelize.col('rating')),'good']
                      ],
            raw:true
         });
         
         
         var good_percentage =  (good[0].good !=null || good[0].good !=0) ? (parseInt(good[0].good)/parseInt(totalRateAvg[0].total_user) * 100):0;
           
          const excellent = await Review.findAll({
            where:{review_to:provider.id,rating:5},
            attributes:[
                        [Sequelize.fn('COUNT',Sequelize.col('rating')),'excellent']
                      ],
            raw:true
         });
         
        //  return res.json(excellent[0].excellent)
          var excellent_percentage =  (excellent[0].excellent !=0) ? (parseInt(excellent[0].excellent)/parseInt(totalRateAvg[0].total_user) * 100):0;
        //  return res.json(excellent_percentage)
        // return res.json({poor_percentage,excellent_percentage,good_percentage,average_percentage,blow_average_percentage})
         var review = [];
          var reviewRaw = reviewRawdata.rows;
          for(var i=0; i < reviewRaw.length; i++)
             {
               review.push({
                   id:reviewRaw[i].user.id,
                   image:reviewRaw[i].user.image,
                   fullname:reviewRaw[i].user.fristname+' '+reviewRaw[i].user.lastname,
                   comment:reviewRaw[i].comment,
                   rating:reviewRaw[i].rating,
                   date:moment(reviewRaw[i].createdAt).format('DD-MM-YYYY')
               })   
             }
       
        // return res.json(poor_percentage)
          var pp =  (poor_percentage) ? poor_percentage:0;
          var ep =  (excellent_percentage) ? excellent_percentage:0;
          var gp =  (good_percentage) ? good_percentage:0;
          var ap =  (average_percentage)      ? average_percentage:0;
          var bap = (blow_average_percentage) ? blow_average_percentage:0;
           
        return res.json({status:true,data:{
            total:(totalRateAvg[0].total_rating !=null) ? parseInt(totalRateAvg[0].total_rating):0,
            poor_percentage:pp,
            excellent_percentage:ep,
            good_percentage:gp,
            average_percentage:ap,
            blow_average_percentage:bap,
            review,
            review_total_page:Math.ceil(reviewRawdata.count/size)
            
        },message:"review"})
    }catch(err){
        console.log(err)
       // return res.json(err)
        return res.json({status:false,message:"somthing is wrong"})
    }
})






var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // cb(null,'backend/public/documents/')
     cb(null, path.join(__dirname,'../public/order/'))
      },
    filename: function (req, file, cb) {
        let r = (Math.random() + 1).toString(36).substring(7);
      cb(null, Date.now()+r+'.png')
    }
  })
  
  
var upload = multer({ storage: storage })



router.post('/tracking-status',accessToken,upload.any('images'),async(req,res) =>{
    
    const {order_id,on_the_way, at_location, started_job, finished_job, checked_questions } = req.body;
    if(!order_id) return res.json({status:false,message:'Order id is required.'});
    if(!on_the_way && !at_location && !started_job && !finished_job) return res.json({status:false,message:'at least one action is required.'});
    try{
        
        
        
        
            // var payload = {
            // notification:{
            
            // title:'Job Update',
            // body:'Your job has been accepted'
            // }
            // };
            
            // var options = {
            // priority: "high",
            // timeToLive: 60 * 60 * 24,
            // };
        
        //   var fcm= "dWnXBhioSq2Sp39OQBI9R_:APA91bEC65hkByIIkVtLbYs-2gnd-fJL6kp7SQ9xNNYO15c2cVbOqA7rFNp8k4XqOJnOZORWoOgBpRjdY03DLsMUoLQtcezFuPv-rG2fbVg5K5NCZbqXmDr5qxc7hR7HOdLHl7reK1zt"
        // var test =   adminpush.messaging().sendToDevice(fcm,payload,options)
        
      var provider = await User.findOne({where:{id:req.user.user_id,is_deleted:0,role:2}}); 
      if(!provider) return res.json({status:false,message:'Provider not found.'});
    // return res.json(provider)
      //   dont change messages using in android side
      if(provider.is_blocked==1) return res.json({status:false,message:'Provider is blocked.'});
      
      if(provider.admin_approved!=1) return res.json({status:false,message:'Provider not approved by admin.'});
      
      
      
      
      
        
        const  order = await Order.findOne({where:{order_id}});
        if(!order) return res.json({status:false,message:'order id not found.'});
        // return res.json(order)
          if(order.status==3) return res.json({status:false,message:"This order has been completed"})
           
          
          
         var date_and_time=moment().format();
         var user= await User.findOne({where:{id:order.user_id,is_deleted:0}})
        // return res.json(order)
        if(on_the_way==1){
          
           order.on_the_way  = parseInt(on_the_way); 
           var msg='now status is on the way.';
           order.on_the_way_date=date_and_time;
           
        //       var payload = {
        //     notification:{
            
        //     title:'Order Update',
        //     body:'Your service provider has on the way'
        //     },
            //  data:{
            //     order_id:order_id,
            //     title:'Order Update',
            //     body:'Your service provider has on the way',
            //     click_action:'on_the_way'
            //   }
        //     };
            
        //     var options = {
        //     priority: "high",
        //     timeToLive: 60 * 60 * 24,
        //     };
        // //   return res.json("okk")
        //   var fcm=user.fcm_token;
        //   var test =   adminpush1.messaging().sendToDevice(fcm,payload,options)
        
        
        
         if(user.fcm_token !=''){
                
            //start notification  
            var message = { 
            to: user.fcm_token, 
            collapse_key: '',
            
            notification:{
                title:'Order Update',
                body:'Hey , Your service provider is on the way '
            },
            
             data:{
                order_id:order_id,
                title:'Order Update',
                body:'Hey , Your service provider is on the way ',
                click_action:'on_the_way'
              }
            };
            
            
            fcm.send(message, function(err, response){
            if (err) {
            console.log("errrrr notification");
            } else {
            console.log("notification done");
            }
            });
            //end notification
            }
           
    //   return res.json(test)
        }
        if(at_location==1){
           order.at_location = parseInt(at_location); 
           var msg='now status at location.';
           order.at_location_date=date_and_time;
           
           
        //     var payload = {
        //     notification:{
            
            // title:'Order Update',
            // body:'Your service provider has reached the location'
            // },
            //  data:{
            //     order_id:order_id,
            //     title:'Order Update',
            //     body:'Your service provider has reached the location',
            //     click_action:'reach_at_location'
            // }
        //     };
            
        //     var options = {
        //     priority: "high",
        //     timeToLive: 60 * 60 * 24,
        //     };
           
        //   var fcm=user.fcm_token;
        //   var test =   adminpush1.messaging().sendToDevice(fcm,payload,options)
        
        
        
        
         if(user.fcm_token !=''){
                
            //start notification  
            var message = { 
            to: user.fcm_token, 
            collapse_key: '',
            
            notification:{
                title:'Order Update',
                body:'Provider has arrived at your location'
            },
            
             data:{
                order_id:order_id,
                title:'Order Update',
                body:'Provider has arrived at your location',
                click_action:'reach_at_location'
              }
            };
            
            
            fcm.send(message, function(err, response){
            if (err) {
            console.log("errrrr notification");
            } else {
            console.log("notification done");
            }
            });
            //end notification
            }
            
           
        }
        if(started_job==1){
            // return res.json(req.files)
          if(req.files.length==0) return res.json({status:false,message:'Images are required.'});
            
            for(var i =0; req.files.length > i; i++){
                 await Order_image.create({order_id,image:'/order/'+req.files[i].filename,type:'before'})
            }
            
            
           order.started_job = parseInt(started_job);
           var msg='now status is started job.';
           order.started_job_date=date_and_time;
           
           
           
        //     var payload = {
            // notification:{
            
            // title:'Order Update',
            // body:'Provider has started your work'
            // },
            //  data:{
            //     order_id:order_id,
            //     title:'Order Update',
            //     body:'Provider has started your work',
            //     click_action:'started_your_work',
            // }
            // };
            
        //     var options = {
        //     priority: "high",
        //     timeToLive: 60 * 60 * 24,
        //     };
           
        //   var fcm=user.fcm_token;
        //   var test =   adminpush1.messaging().sendToDevice(fcm,payload,options)
        
        
        
        if(user.fcm_token !=''){
                
            //start notification  
            var message = { 
            to: user.fcm_token, 
            collapse_key: '',
            
           notification:{
            
            title:'Order Update',
            body:'Provider has started your Job'
            },
             data:{
                order_id:order_id,
                title:'Order Update',
                body:'Provider has started your Job',
                click_action:'started_your_work',
            }
            };
            
            
            fcm.send(message, function(err, response){
            if (err) {
            console.log("errrrr notification");
            } else {
            console.log("notification done");
            }
            });
            //end notification
            }
            
            
           
        }
        if(finished_job==1){
            
           if(req.files.length==0) return res.json({status:false,message:'Images are required.'});
           if(!checked_questions)  return res.json({status:false,message:'please mark questions.'});
            
            for(var i =0; req.files.length > i; i++){
                 await Order_image.create({order_id,image:'/order/'+req.files[i].filename,type:'after'})
            }
            
            
           order.finished_job = parseInt(finished_job); 
           order.checked_questions = checked_questions;
           order.status=3;
           var msg='now status is finished job.';
           order.finished_job_date=date_and_time;
           
           
        //       var payload = {
            // notification:{
            
            // title:'Order Update',
            // body:'Your work has been completed by the provider'
            // },
            //  data:{
            //     order_id:order_id,
            //     title:'Order Update',
            //     body:'Your work has been completed by the provider',
            //     click_action:'terminated_by_the_provider',
            // }
        //     };
            
        //     var options = {
        //     priority: "high",
        //     timeToLive: 60 * 60 * 24,
        //     };
           
        //   var fcm=user.fcm_token;
        //   var test =   adminpush1.messaging().sendToDevice(fcm,payload,options)
        
        
        
          if(user.fcm_token !=''){
                
            //start notification  
            var message = { 
            to: user.fcm_token, 
            collapse_key: '',
            
            notification:{
            title:'Order Update',
            body:'Your service provider has finished work'
            },
             data:{
                order_id:order_id,
                title:'Order Update',
                body:'Your service provider has finished work',
                click_action:'terminated_by_the_provider',
            }
            };
            
            
            fcm.send(message, function(err, response){
            if (err) {
            console.log("errrrr notification");
            } else {
            console.log("notification done");
            }
            });
            //end notification
            }
            
            
        }
       order.save();
    //   return res.json(test)
       return res.json({
           status:true,
           data:{
           current_status:{
               on_the_way:order.on_the_way, 
               at_location:order.at_location,
               started_job:order.started_job,
               finished_job:order.finished_job
               
           }
           
       },message:msg});
         
    }catch(err){
        return res.json({status:false,message:"somthing is wrong"})
    }
});





// status add update


router.post('/available-status',accessToken,async(req,res) =>{
    

    try{
        
        
      var provider = await User.findOne({where:{id:req.user.user_id,is_deleted:0,role:2}}); 
      if(!provider) return res.json({status:false,message:'Provider not found.'});
        
      //   dont change messages using in android side
      if(provider.is_blocked==1) return res.json({status:false,message:'Provider is blocked.'});
      
      if(provider.admin_approved!=1) return res.json({status:false,message:'Provider not approved by admin.'});
      
      if(provider.is_available==1){
          provider.is_available =0;
          var msg = 'Offline';
      }else{
          provider.is_available =1;
          var msg = 'online';
      }
      provider.save();
      
    
       
       return res.json({status:true,message:msg});
         
    }catch(err){
        return res.json({status:false,message:"somthing is wrong"})
    }
})






router.post('/earning',accessToken,async(req,res) =>{
    
    const {start_date,end_date} = req.body;
    
    try{
        
        
      var provider = await User.findOne({where:{id:req.user.user_id,is_deleted:0,role:2}}); 
      if(!provider) return res.json({status:false,message:'Provider not found.'});
//   return res.json(provider.id)
        
      //   dont change messages using in android side
      if(provider.is_blocked==1) return res.json({status:false,message:'Provider is blocked.'});
      
      if(provider.admin_approved!=1) return res.json({status:false,message:'Provider not approved by admin.'});
      
      
      
      
         //   pagination
          var pageAsNumber = Number.parseInt(req.query.page);
          var sizeAsNumber = Number.parseInt(req.query.size);
          
          var page = 0;
          if(!Number.isNaN(pageAsNumber) && pageAsNumber > 0 ){
              page = pageAsNumber;
          }
          
          var size = 10;
          if(!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 10){
              size= sizeAsNumber;
          }
          
          
     
      if(start_date && end_date){
          
                  var  transactionRaw = await Transaction.findAll({
                                              where:{
                                                  provider_id:req.user.user_id,
                                                  type:2,
                                                  createdAt:{
                                                      [Op.between]:[start_date+' 00:00:00',end_date+' 23:59:59']
                                                  }
                                                  
                                              },
                                              order:[['id','desc']],
                //  limit:size,
                //  offset:page*size
          
          
                                   });
          
      var  total = await Transaction.findAll({
                      where:{
                          type:2,
                          provider_id:req.user.user_id,
                          createdAt:{
                              [Op.between]:[start_date+' 00:00:00',end_date+' 23:59:59']
                          }
                      },
                  
                    attributes:[
                            [Sequelize.fn('SUM',Sequelize.col('amount')),'total']
                          ],
                    raw:true
                  
                  });
      
      
      }else{
         
        
          var  transactionRaw = await Transaction.findAll({
                  where:{
                      type:2,
                      provider_id:req.user.user_id
                  },
                   order:[['id','desc']],
                   //limit:size,
                 //  offset:page*size
                  
                  
                  });
                  
                  
             var  total = await Transaction.findAll({
                  where:{
                      type:2,
                      provider_id:req.user.user_id
                  },
                  
                    attributes:[
                            [Sequelize.fn('SUM',Sequelize.col('amount')),'total']
                          ],
                    raw:true
                  
                  });
                  
                 ///return res.json(req.user.user_id)
      
      
      }
     
       
                  
    //   return res.json(total)
    var transactions_list = [];
    //   var total = [];
    var transaction = transactionRaw;
    
    //  return res.json(transaction)
     
     for(var i=0; i<transaction.length; i++){
         
         transactions_list.push({
             order_id:transaction[i].order_id,
             category_name:(transaction[i].category_id==1) ?  "Lawn mowing":"Snow Plowing",
             amount:(transaction[i].amount) ? transaction[i].amount:0,
             date:moment(transaction[i].createdAt).format('DD MMM YYYY')
         });
         
        //  total.push(transaction[i].amount)
     }
    
       var capsule = {
                      total_amount:total[0].total,
                      transactions:transactions_list,
                    //  total_page:Math.ceil(transactionRaw.count/size)
       };
       
       return res.json({status:true,data:{transaction_list:capsule},message:'transaction list.'});
         
    }catch(err){
        console.log(err)
        return res.json({status:false,message:"somthing is wrong"})
    }
})


//change password 

router.post('/change-password',accessToken,async(req,res)=>{
    const {oldpassword,newpassword} = req.body
    
    if(!oldpassword) return res.json({status:false,message:"old_passworld is require"})
    if(!newpassword) return res.json({status:false,message:"new_password is require"})
    try{
        
        const provider = await User.findOne({where:{id:req.user.user_id,is_deleted:0,role:2}})
        if(!provider) return res.json({status:false,message:"provider not found"})
        
      
         const match = await bcrypt.compare(oldpassword,provider.password)
         if(!match) return res.json({status:false,message:"password is wrong"})
         
         
         const hash = bcrypt.hashSync(newpassword,10)
             provider.password = hash
             provider.save();
             
         return res.json({status:true,message:"password change successfully done"})
        
        // const match = await User.findOne({where:{id:provider_id,is_deleted:0,role:0}})
        
    }catch(err){
        console.log(err)
        return res.json({status:false,message:"something is wrong"})
    }
});

//t&c
router.post('/terms',async(req,res)=>{
  
  try{
      
      const termss = await Term.findOne({where:{is_deleted:0}})
      //   return res.json("okk")
       return res.json({status:true,data:{termss},message:"Terms & Condition Show"})
       
      }catch(err){
        console.log(err)
        return res.json({status:false,message:"Something is wrong"})
      }
})



//get provider details
router.post('/service-provider-details',accessToken,async(req,res)=>{
    const {provider_id}= req.body;
    if(!provider_id) return res.json({status:false,message:'Provider id is require'})
    
    try{
        
        const provider = await User.findOne({where:{id:req.user.user_id,is_deleted:0,role:2}})
        if(!provider) return res.json({status:false,message:"provider not found"})
        
        const user = await User.findOne({
            where:{id:provider_id,is_deleted:0},
            include:[
                {
                model:Provider_equipment,as:'provider_equipment',
                 
                  include:[{model:Equipment,as:'equipment'}],
                  
                 where:{is_deleted:0},
                },
                {
                    model:User_detail,as:'user_documents'
                },
                {
                  model:Order,as:'job_status',
                  include:[{model:User,as:'user_details'}],
                 }
                ]
        });
         
        
   if(!user) return res.json({statu:false,message:"Provider id not match"})
  
         
         var equipment_data = [];
         var commercial   = [];
         var residential  = [];
         var snow_plowing = [];
         var lawnmowing="0";
         var snowplowing="0";
        // return res.json(user)
              
         let group = (user.provider_equipment).reduce((r, a) => {
            // console.log("a", a);
            // console.log('r', r);
            r[a.category_id] = [...r[a.category_id] || [], a];
            return r;
            }, {});
   
        
            //   return res.json("0k")
              Object.keys(group).forEach((k,v) => {
               
                    
                     if(k=="1"){
                         lawnmowing="1"
                      }
                    
                     if(k=="2"){
                        snowplowing="1"
                     }
                     
                    
                  });
        //   return res.json({lawnmowing,snowplowing})
                
            var commercial_status=0;
            var residential_status=0;
            var snow_plowing_status=0;
          
          
           var equipment= await Equipment.findAll({where:{is_deleted:0}})
           
           for(i=0; i<equipment.length; i++)
                {
                 
            
                 var pequipment= await Provider_equipment.findOne({where:{provider_id,equipment_id:equipment[i].id,is_deleted:0}});
                 
                 
                   if(equipment[i].type==1){
                       
                        commercial.push({
                        id:equipment[i].id,
                        name:equipment[i].name,
                        status:(pequipment)? 1:0
                        });
                        if(pequipment){
                       commercial_status=1;     
                     }
                    }
            
                 if(equipment[i].type==2){
                      residential.push({
                      id:equipment[i].id,
                      name:equipment[i].name,
                      status:(pequipment)? 1:0
                 
                  });
                     if(pequipment){
                      residential_status=1;
                     }
                 }
            
                 if(equipment[i].type==0){
                     snow_plowing.push({
                     id:equipment[i].id,
                     name:equipment[i].name,
                     status:(pequipment)? 1:0
                   
                    })
                     if(pequipment){
                      snow_plowing_status=1;
                     }
                }
                }
            //   return res.json('okk')
          
        
            
             
           
         
      
        
   
         
        var jobs = [];
        
   
      if(user.job_status.length!=0){
      
        for(let i=0;i<user.job_status.length;i++)
        {
         if(user.job_status[i].status==1)
         {status="Pending"}
         if(user.job_status[i].status==2)
         {status="Accepted"}
         if(user.job_status[i].status==3)
         {status="Completed"}
         if(user.job_status[i].status==4)
         {status="Cancel"}
         if(user.job_status[i].category_id==1)
         {service="Lawn Mowing"}
         if(user.job_status[i].category_id==2)
         {service="Snow Plowing"}
         
         
        
          jobs.push({
            // id:user.job_status[i].user_details.id,
            fullname:user.job_status[i].user_details.fristname+' '+user.job_status[i].user_details.lastname,
            order_id:user.job_status[i].id,
            total_amount:user.job_status[i].total_amount,
            job_done:service,
            details:status
          })
        }
      }
       
     
      
        const bank = await Bank_detail.findOne({where:{provider_id:provider_id,is_deleted:0}})
        
      
         var capsule = {
            firstname:user.fristname,
            lastname:user.lastname,
            bio:user.bio,
            image:user.image,
            email:user.email,
            mobile:user.mobile,
            ssn:user.ssn,
            address:user.address,
            status:user.status,
            document:(user.user_documents) ? user.user_documents:"",
            jobs:jobs,
            bank_name:bank.bank_name,
            account_number:bank.account_number,
            routing_number:bank.routing_number,
            equipment_data: equipment_data,
            lawnmowing,
            snowplowing,
            commercial,
            residential,
            snow_plowing,
            commercial_status,
            residential_status
        }
         
        
        return res.json({status:true,data:{capsule},message:"User Data Show"})
    }catch(err){
        console.log(err)
        return res.json({status:false,message:"Something is wrong"})
    }
})


//update provider-details
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // cb(null,'backend/public/documents/')
      if(file.fieldname == 'image'){
        //   console.log('testtttttttttttt',req.fieldname)
        cb(null, path.join(__dirname,'../public/users/'))  
      }else{
          cb(null, path.join(__dirname,'../public/documents/'))
      }
     
      },
    filename: function (req, file, cb) {
      cb(null, Date.now()+'.png')
    }
  })
  
  
  

var upload = multer({ storage: storage })

router.post('/edit-provider',upload.fields([{name:'identity'},{name:'license'},{name:'insurance'},{name:'image'}]),accessToken,async(req,res)=>{
    const {provider_id,password,equipments,service,newAccount_number,new_routing_number,newBank_name,ssn,dob}= req.body;
    if(!provider_id) return res.json({status:false,message:'Provider id is require'})
    if(!equipments) return res.json({status:false,messgae:"equipments is require"})
    try{
    
         const provider_details = await User.findOne({where:{id:req.user.user_id,is_deleted:0,role:2}})
         if(!provider_details) return res.json({status:false,message:"Provider not found"})
         const user_detail = await User_detail.findOne({where:{provider_id,is_deleted:0}})
       
        
        
        if(password){
            
            var hash = bcrypt.hashSync(password,10);
            provider_details.password=hash;
        }
        
        if(ssn){
            provider_details.ssn=ssn;
        }
        if(dob){
            
            var bdate = dob; //moment(dob).format("DD-MM-YYYY")
            provider_details.dob=bdate;
        }
        // return res.json(req.files)
        
        if(req.files.identity)
        {
            user_detail.identity="/public/documents/"+req.files.identity[0].filename;
        }
        if(req.files.license)
        {
           user_detail.license="/public/documents/"+req.files.license[0].filename;
           
        }
         if(req.files.insurance)
        {
           user_detail.insurance="/public/documents/"+req.files.insurance[0].filename;
        }
        
         user_detail.save();
         provider_details.save();
         
        var chackzero = equipments.indexOf('0') != -1;
        if(chackzero) return res.json({status:false,message:'Equipment Id Zero Not Exist'})
        
        const equip = equipments.split('');
        
        await Provider_equipment.update({is_deleted:1},{where:{provider_id}})
        
         for(let i=0; i<equip.length; i++)
        { 
            
           const checke = await Equipment.findOne({where:{id:equip[i],is_deleted:0}});
           
           if(checke){
            
           await Provider_equipment.create({
                                                provider_id:provider_details.id,
                                                equipment_id:checke.id,
                                                category_id:checke.category_id
                                            }) 
          }            

            
        }
         const bank_detail = await Bank_detail.findOne({where:{provider_id,is_deleted:0}})
          
             
             bank_detail.account_number= newAccount_number;
             bank_detail.bank_name =     newBank_name;
             bank_detail.routing_number = new_routing_number;
             bank_detail.save();
             
          return res.json({status:true,message:"Provider Details Update Successfully Done "})
        
    }catch(err){
        console.log(err)
        return res.json({status:false,message:'Something is wrong'})
    }
})


//Cancel woking status 
router.post('/cancel-working-status',accessToken,async(req,res)=>{
    const {order_id,cancel_reason} =req.body
    if(!order_id) return res.json({status:false,message:'Order id is required'})
    if(!cancel_reason) return res.json({status:false,message:"Cancel reason is required"})
    try{
         const provider_details = await User.findOne({where:{id:req.user.user_id,is_deleted:0,role:2}})
         if(!provider_details) return res.json({status:false,message:"Provider not found"})
        //  return res.json(provider_details)
         var order = await Order.findOne({
           where:{order_id,is_deleted:0,assigned_to:provider_details.id},//assigned_to:provider_details.id
           include:[
            {
              model:User,as:'user_details'
            }
        ]
          
          })
          var today_date = moment().format('YYYY-MM-DD');
 
     
     
      if(!order) return res.json({status:false,message:"Order not found."})
       if(order.started_job==1 || order.finished_job==1)
       {
           return res.json({status:false,message:'you can not cancel this job'})
       }
        order.on_the_way=0;
        order.at_location=0;
        // order.status=4;
        order.cancel_reason=cancel_reason;
        order.date=today_date;
        order.save();
        
        // return res.json("okk")
        if(order.user_details.fcm_token!="")
        {
             //start notification  
             var message = { 
                to: order.user_details.fcm_token, 
                collapse_key: '',
                
                notification:{
                    title:'Order Update',
                    body:`Your order has cancel by provider because of ${cancel_reason}`
                },
                
                    data:{
                    title:'Order Update',
                    body:`Your order has cancel by provider because of ${cancel_reason}`,
                    click_action:'order update'
                    }
                };
                
                
                fcm.send(message, function(err, response){
                if (err) {
                console.log("errrrr notification");
                } else {
                console.log("notification done");
                }
                });
                //end notification
        }else{ 
            var reslt = await client.messages.create({ 
                body: `Your order has cancel by provider because of ${cancel_reason}`,
                from: "+17075874531",
                to: "+1"+order.user_details.mobile,
                // to:"+917447070365"
                });
            //end notification 
            } 

            

        
        return res.json({
           status:true,
           data:{
           current_status:{
               on_the_way:order.on_the_way, 
               at_location:order.at_location,
               started_job:order.started_job,
               finished_job:order.finished_job
               
           }
           
       }
        ,message:'Your job has been cancelled'})
    }catch(err){
        console.log(err)
        return res.json({status:false,message:'Something is wrong'})
    }
})







// get order
router.post('/get-order',accessToken,async(req,res) =>{
    
     const {order_id } = req.body;
  
     if(!order_id) return res.json({status:false,message:'Order id is require'})
     
   
    try{
          var provider = await User.findOne({where:{id:req.user.user_id,is_deleted:0}}); 
          if(!provider) return res.json({status:false,message:'Provider not found.'});
          
          //   dont change messages using in android side
          if(provider.is_blocked==1) return res.json({status:false,message:'Provider is blocked.'});
          
          if(provider.admin_approved!=1) return res.json({status:false,message:'Provider not approved by admin.'});
          
         
              var orderRawdata = await Order.findOne({
                                             where:{
                                                 order_id:order_id,
                                                },
                                             include:[
                                                         {model:Lawn_height,as:'lawn_height'},
                                                         {model:Property,as:'property'},
                                                         {model:Lawn_size, as:'lawn_size'},
                                                         {model:Fence,as:'fence'},
                                                         {model:Cleanup,as:'cleanup'},
                                                         {model:Subcategory,as:'subcategory'},
                                                         {model:Color,as:'color'},
                                                         {
                                                         model:Order_sidewalk,
                                                         as:'order_sidewalks',
                                                         include:[
                                                                  {model:Sidewalk,as:'sidewalk'}
                                                                 ]
                                                         },
                                                         {
                                                         model:Order_walkway,
                                                         as:'order_walkways',
                                                         include:[
                                                                  {model:Walkway,as:'walkway'}
                                                                 ]
                                                         
                                                         },
                                                     ]
                                                     
                                          });
                                          
        
          if(!orderRawdata){return res.json({status:false,message:'Invalid job type not found.'}); }
         
         

         
         var orderRaw = orderRawdata;

        //  for(var i=0; i<orderRaw.length; i++){
             
              
                       
            var question = await Question.findAll({
                 where:{is_deleted:0,category:orderRaw.category_id},
                attributes:['id','question'],
                order:[['id','desc']]    
                
            });     
            //  return res.json(orderRaw.category_id)
                var subamount = parseFloat(orderRaw.total_amount) - parseFloat(orderRaw.admin_fee);
                var totalAmt = parseFloat(subamount) + parseFloat(orderRaw.tip);
             
             
                var sidewalk_names = [];
                if(orderRaw.order_sidewalks){
                     for(var j = 0; j < orderRaw.order_sidewalks.length; j++){
                          sidewalk_names.push({sidewalk:(orderRaw.order_sidewalks)[j].sidewalk.name});
                     }
                 }
                 
                 var walkway_names = [];
                 if(orderRaw.order_walkways){
                     for(var j = 0; j < orderRaw.order_walkways.length; j++){
                         walkway_names.push({walkway:(orderRaw.order_walkways)[j].walkway.name});
                     }
                 }
                            
                            
                            
                            
             if(orderRaw.status==1){
                var status = "Pending" 
             }
             if(orderRaw.status==2){
                var status = "Accepted"; 
             }
             if(orderRaw.status==3){
                var status = "Completed"; 
             }
             
            //  if(orderRaw.status==1){
            //     var status =  
            //  }
             var before_order_image = await Order_image.findAll({where:{order_id:orderRaw.order_id,type:'before',is_deleted:0}});
             var after_order_image = await Order_image.findAll({where:{order_id:orderRaw.order_id,type:'after',is_deleted:0}});
             
            
            var  order = {
                 
                order_id:orderRaw.order_id,
                category: (orderRaw.category_id==1) ? "Lawn Mowing":"Snow Removal",
                on_demand:orderRaw.on_demand,
                datetime:moment(orderRaw.date).format('MM-DD-YYYY'),
                address:orderRaw.property.address,
                lat:orderRaw.property.lat,
                lng:orderRaw.property.lng,
                service_for:(orderRaw.service_for)? orderRaw.service_for:'',
                
                corner_lot_id:(orderRaw.corner_lot_id)    ? parseInt(orderRaw.corner_lot_id):0,
                corner_lot_amount:(orderRaw.corner_lot_amount) ? orderRaw.corner_lot_amount:0,   
                
                // lawn_size:(orderRaw[i].lawn_height)       ? orderRaw[i].lawn_height.name:'',
                // lawn_size_price:(orderRaw[i].lawn_height) ? orderRaw[i].lawn_height.price:0,
                // lawn_height:(orderRaw[i].lawn_size)       ? orderRaw[i].lawn_size.name:'',
                // lawn_height_price:(orderRaw[i].lawn_size) ? orderRaw[i].lawn_size.price:0,
                
                property_image:(orderRaw.property)     ? orderRaw.property.image:'',
                
                lawn_size:(orderRaw.lawn_size)       ? orderRaw.lawn_size.name:'',
                lawn_size_price:(orderRaw.lawn_size) ? orderRaw.lawn_size_amount:0,
                            
                lawn_height:(orderRaw.lawn_height)       ? orderRaw.lawn_height.name:'',
                lawn_height_price:(orderRaw.lawn_height) ? orderRaw.lawn_height_amount:0,
                            
               
                  
                fence:(orderRaw.fence)                 ? orderRaw.fence.name:'',
                fence_price:(orderRaw.fence)           ? orderRaw.fence.price:0,
                yard_cleanup:(orderRaw.cleanup)        ? orderRaw.cleanup.name:'',
                yard_cleanup_price:(orderRaw.cleanup)  ? orderRaw.cleanup.price:0,
                gate_code:orderRaw.gate_code,
                instructions:orderRaw.instructions,
                
                
                
                subcategory_id:(orderRaw.subcategory_id) ? orderRaw.subcategory_id:0,
                subcategory_name:(orderRaw.subcategory !=null) ? orderRaw.subcategory.name:'',
                subcategory_amount:(orderRaw.subcategory!=null) ? orderRaw.subcategory.price:0,
                
                color_name:(orderRaw.color_id) ? orderRaw.color.name:'', 
                car_number:(orderRaw.car_number) ? orderRaw.car_number:'',
                 
                driveway:(orderRaw.driveway) ? orderRaw.driveway:0,
                driveway_price:(orderRaw.driveway_amount) ? orderRaw.driveway_amount:0,
                
                sidewalk:sidewalk_names,
                sidewalk_price:(orderRaw.sidewalk_amount) ? orderRaw.sidewalk_amount:0,
                
                walkway:walkway_names,
                walkway_price:(orderRaw.walkway_amount)  ? orderRaw.walkway_amount:0,
                 
                 
                // comment this old
                before_img1:(orderRaw.img1)     ? orderRaw.img1:"",
                before_img2:(orderRaw.img2)     ? orderRaw.img2:"",
                before_img3:(orderRaw.img3)     ? orderRaw.img3:"",
                before_img4:(orderRaw.img4)     ? orderRaw.img4:"",
                
                
                img1:(orderRaw.img1)     ? orderRaw.img1:"",
                img2:(orderRaw.img2)     ? orderRaw.img2:"",
                img3:(orderRaw.img3)     ? orderRaw.img3:"",
                img4:(orderRaw.img4)     ? orderRaw.img4:"",
                
                
                
                
                before_image:(before_order_image.length!=0) ? before_order_image:[],
                after_image:(after_order_image.length !=0) ? after_order_image:[],
                
                on_the_way:orderRaw.on_the_way,
                at_location:orderRaw.at_location,
                started_job:orderRaw.started_job,
                finished_job:orderRaw.finished_job,
                status,
                // total_amount:parseFloat(totalAmt.toFixed(2)),
                // total_amount:(orderRaw[i].provider_amount).toFixed(2),
                //  total_amount:(orderRaw[i].provider_amount) ? orderRaw[i].provider_amount:'0',
                 total_amount:(orderRaw) ? orderRaw.provider_amount.toFixed(2):'0',
                question
             }
        //  }
        
        return res.json({status:true,data:{jobs:order},message:'jobs'});
    }catch(err){
        console.log(err)
        // return res.json(err)
        return res.json({status:false,message:'something is wrong.'});
    }
});






router.post('/logout',accessToken,async(req,res)=>{
    try{
        
        var provider = await User.findOne({where:{id:req.user.user_id,is_deleted:0,role:2}}); 
        if(!provider) return res.json({status:false,message:'Provider not found.'});
        
        provider.fcm_token=""
        provider.save();
        // return res.json(provider)
        return res.json({status:true,message:"Provider logout"})
        
    }catch(err){
        console.log(err)
        return res.json({status:false,message:"Something is wrong"})
        
    }
})

router.post('/noti',async(req,res) =>{
    
    try{
        //  var payload = {
        //     notification:{
            
        //     title:'New Job',
        //     body:'New job has been posted',
           
        //     },
        //     data:{
        //         order_id:'jjhgj' ,
        //         title:'New Job',
        //         body:'New job has been posted',
        //         click_action:'postjob',
        //     }
        //     };
            
            
        //     var options = {
        //     priority: "high",
        //     timeToLive: 60 * 60 * 24,
            
        //     };
            
           
        //   var test = await  adminpush1.messaging().sendToDevice('eE3M7CVvU0X4vcfLZnogca:APA91bG86YgeJiG5nMwv_xUc3X4iH2oDKwo5NbiQ__E380hKNlY419QUCNGcyaF6hxb3x8A2o3Ju31NV4Anep_1dELnilirYIZW76Vvb27c50dmp4_MDq_t68B2I1T17_LkZ7KflR8dV',payload,options)
        //     return res.json(test);
        
        
    // var message = { 
    //     to: 'e_jDkkpyROuxswYYZsMLUE:APA91bE8MEkfA1hdPQQy3WvypJjO6ZlcLlK1xwvGFPbLApT72_j95S8ijuAUv0DxrH_SPQaKhTD5a9Pur5k8ERWNq9GehVHY1LnnK4ryxXQ-slBJVo-ulPRcOl1oHiGNzNdhNuhuQGZx', 
    //     collapse_key: '',
        
    //     notification: {
    //         title: 'Title of your push notification', 
    //         body: 'Body of your push notification' 
    //     },
        
    //         data:{
    //             order_id:'jjhgj' ,
    //             title:'New Job',
    //             body:'New job has been posted',
    //             click_action:'postjob',
    //         }
    //     };
        
       
    //  fcm.send(message, function(err, response){
    //         if (err) {
    //           console.log("errrrr notification");
    //         } else {
    //             console.log("notification done");
    //         }
    //     });
    
            
    }catch(err){
        console.log(err)
     return res.json(err)   
    }
     
});

//tech suport
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null,'backend/public/documents/')
   cb(null, path.join(__dirname,'../public/support_img'))
    },
  filename: function (req, file, cb) {
    var rdmstring = Math.floor(Math.random() * 100);
    cb(null, Date.now()+rdmstring+'.png')
  }
});


var upload = multer({ storage: storage })
router.post('/tech-support',accessToken,upload.array('images'),async(req,res) =>{
      const {firstname,lastname,email,phone_type,request_type,description,images} = req.body;
      if(!firstname) return res.json({status:false,message:'firstname is required.'});
      if(!lastname) return res.json({status:false,message:'Firstname is required.'});
      if(!email) return res.json({status:false,message:'email is required.'});
      if(!phone_type) return res.json({status:false,message:'phone type is required.'});
      if(!request_type) return res.json({status:false,message:'request type is required.'});
      if(!description) return res.json({status:false,message:'description is required.'});
      try{
    
         console.log(req.files)
          var imagestring = [];
          if(req.files){
            for(var i =0; i < req.files.length; i++){
              imagestring.push('/support_img/'+req.files[i].filename)
            }
          }
          // return res.json(imagestring)
          await Tech_support.create({
            user_id:req.user.user_id,
            user_type:'Provider',
            firstname,
            lastname,
            email,
            phone_type,
            request_type,
            description,
            images:(imagestring.length > 0)  ? imagestring.toString():''
          });
    
          return res.json({status:true,message:'Your request has submitted successfully.'});
      }catch(err){
      return res.json({status:false,message:'Options list.'});
      }
    });
    
    

//add eta

router.post('/send-eta',accessToken,async(req,res)=>{
  const {dateAndtime,order_id}= req.body;
  if(!dateAndtime) return res.json({status:false,message:"Date is require"});
  if(!order_id) return res.json({status:false,message:"Order id require"});
 

  try{
    
    const provider = await User.findOne({where:{id:req.user.user_id,role:2,is_deleted:0}})
    if(!provider) return res.json({status:false,message:"provider not found"})

    var order = await Order.findOne({where:{order_id,is_deleted:0,status:2}});
    if(!order) return res.json({status:false,message:"order not found"});

    
    order.eta_date=dateAndtime
    order.save();
    var user= await User.findOne({where:{id:order.user_id,is_deleted:0}});
    if(user.fcm_token !=''){
                
            //start notification  
            var message = { 
            to: user.fcm_token, 
            collapse_key: '',
            
           notification:{
            
            title:'Order Update',
            body:`Provider has start your Job at ${dateAndtime}`
            },
             data:{
                order_id:order_id,
                title:'Order Update',
                body:`Provider has start your Job at ${dateAndtime}`,
                click_action:'started_your_work',
            }
            };
            
            
            fcm.send(message, function(err, response){
            if (err) {
            console.log("errrrr notification");
            } else {
            console.log("notification done");
            }
            });
            //end notification
            return res.json({status:true,messgae:"Your ETA time set..."})
            }
   
    return res.json({status:false,messgae:"User not found"})

  }catch(err)
  {
    return res.json({status:false,message:"Something is wrong.."})
  }
})


//get eta
router.post('/get_eta',accessToken,async(req,res)=>{
 const {order_id}= req.body;
 if(!order_id) return res.json({status:false,message:"Order_id is require"});
  try{

    const provider = await User.findOne({where:{id:req.user.user_id,role:2,is_deleted:0}})
    if(!provider) return res.json({status:false,message:"Provider not found"})

    var order = await Order.findOne({where:{order_id,is_deleted:0,status:2}});
    if(!order) return res.json({status:false,message:"Order not found"})

    return res.json({status:true,data:{order:order.eta_date},message:"ETA time and date"})
  }catch(err)
  {
    return res.json({status:false,data:{err},message:"Somthing is wrong"})
  }
})


// //update eta
// router.post('update-eta',accessToken,async(req,res)=>{
//  const {date,order_id} =req.body;
//  if(!order_id) return res.json({status:false,messgae:"order id is require"})
//  if(!date) return res.json({status:false,messgae:"date is require"})
//   try{
//     var provider = await User.findOne({where:{id:req.user.user_id,role:2,is_deleted:0}});
//     if(!provider) return res.json({status:false,message:'Provider not found'});

//     var order = await Order.findOne({where:{order_id,is_deleted:0,status:2}});
//     if(!order) return res.json({status:false,message:"Order not found"})



//   }catch(err)
//   {
//     return res.json({status:false,message:"Something is wrong."})
//   }
// })


//contractor rain delay for lawn mowing jobs reschedule for next day
router.post('/rain-delay',accessToken,async(req,res)=>{
  const {order_id} = req.body;
 if(!order_id) return res.json({status:false,message:"Order id is require."});
  try{
      var provider = await User.findOne({where:{id:req.user.user_id,is_deleted:0,role:2}}); 
      if(!provider) return res.json({status:false,message:'Provider not found.'});
      
      // return res.json(provider)
      
      var order = await Order.findOne({
        where:{order_id,is_deleted:0,status:2,category_id:2},
        include:[
          {model:User,as:'user_details'}
         ],
      })
      if(order!=null){
        if(order.user_details.fcm_token!="")
         {return res.json("okkk")
        }else return res.json("Fcm not found")
      }else{
       return res.json({status:false,message:"order not found"})
      }
     
      
      
      
  }catch(err)
  {
      return res.json({status:false,message:"Something is wrong."})
  }
})


//Cancel woking status 
router.post('/cancel-accepted-job',accessToken,async(req,res)=>{
  const {order_id,reason} =req.body
  if(!reason) return res.json({statu:"false",message:"Reason is require"})
  if(!order_id) return res.json({status:false,message:'Order id is required'})
  try{
       const provider = await User.findOne({where:{id:req.user.user_id,is_deleted:0,role:2}});
       if(!provider) return res.json({status:false,message:"Provider not found"})
       
       var order = await Order.findOne({where:{order_id,is_deleted:0}});
       if(!order) return res.json({status:false,message:"Order not found"});
       
       if(order.started_job==1)  return res.json({status:false,message:"Your cannot cancel started job."});
       order.on_the_way  = 0;
       order.at_location = 0;
       order.status      = 1;
       order.assigned_to = 0;
       order.provider_assigned_date =null;
       order.save();
       
        await Declined_order.create({
              cancel_reason:reason,
               provider_id:provider.id,
               order_id:order.order_id,   
       });
       
      //  var declined_list =[];
      //  for(var i=0; i<declined_orders.length; i++){
      //      declined_list.push(declined_orders[i].order_id)
      //  }
       
       
      var radius    = await Setting.findOne({where:{field_key:'radius'}});
      var all_provider= await User.findAll({
          where:{
              is_deleted:0,
              is_blocked:0,
              status:1,
              role:2,
              id:{[Op.not]:provider.id},
              
          },
          attributes:['fcm_token','id',[Sequelize.literal("6371 * acos(cos(radians("+parseFloat(order.lat)+")) * cos(radians(lat)) * cos(radians("+parseFloat(order.lng)+") - radians(lng)) + sin(radians("+parseFloat(order.lat)+")) * sin(radians(lat)))"),'distance']],
          having: Sequelize.literal('distance < '+parseFloat(radius.field_value)),
          //  order: Sequelize.literal('distance ASC'),
          logging: console.log,
      });
      
  
          
        
       for(i=0; i<all_provider.length; i++)
          {
              if(all_provider[i].fcm_token!='')
              {
                  
                  var provider_category = await Provider_equipment.findAll({where:{is_deleted:0,provider_id:all_provider[i].id}})
                   
                  if(!provider_category){
                    
                     let group = provider_category.reduce((r, a) => {
                  r[a.category_id] = [...r[a.category_id] || [], a];
                  return r;
                  }, {});
                  
                  
                  
                  var categories = [];
                  Object.keys(group).forEach((k,v) => {
                  categories.push(k)
                  });
                  
                  
                  
                  if(categories.indexOf((getorder.category_id).toString()) !== -1){
               
                    if(all_provider[i].fcm_token !=''){
                     
                          var message = { 
                          to: all_provider[i].fcm_token, 
                          collapse_key: '',
                          
                          notification:{
                                          title:'New Job',
                                          body:'(NEW JOB) available in your Area !'
                                      },
                          
                           data:{
                                          order_id:new_order_id,
                                          title:'New Job',
                                          body:'(NEW JOB) available in your Area !',
                                          click_action:'postjob'
                                      }
                          };
                          
                          
                          fcm1.send(message, function(err, response){
                          if (err) {
                          console.log("errrrr notification");
                          } else {
                          console.log("notification done");
                          }
                          });
                          
              
              
             
                    }
              }
              
                  }
             
          
             }
      }
       
       
       
      
      
      return res.json({status:true,message:'Job has cancelled'});
  }catch(err){
      console.log(err)
      return res.json({status:false,message:'Something is wrong'})
  }
})







module.exports = router;