var express = require('express');
var router = express.Router();

const multer = require('multer');

const path = require('path');
const fs = require('fs');

const  axios = require('axios');
const fetch = require('node-fetch');
const request = require("request");

const bcrypt = require('bcrypt');

const moment = require('moment');
 

const multiparty = require("multiparty");

var cron = require('node-cron');

const Stripe = require('stripe');


// var adminpush = require("firebase-admin");

// var serviceAccount3 = require("../mowing-plowing-sp-firebase-adminsdk-v93sq-82906ee7ec.json");

// adminpush.initializeApp({
//       credential:adminpush.credential.cert(serviceAccount3)
// },"pros");

var FCM = require("fcm-node");
//provider
var serverKey = 'AAAAPuQLOzM:APA91bH9_mEd6oSMV5eSB9SILCslz8sq564yPQoT0sTdmZ4yOCHv4DZWF8khDMf0i2P6jrvVBuOe0YLFHDdX1ml2v3-iiWMHA11eydRjtz98oleiE0JBdedvEDO3vvftxAgbmv1yQpTR'; 
var fcm = new FCM(serverKey);


// user
var serverKey1 = 'AAAADZ2BjMc:APA91bH24Rkt38jTtRMiKfi1ewcCH1NMz6b356a7rI6IDyZojVfxns5nUhS_WDs7uxF8E6wRb8waaiJsbQU-gok1nel-drpmjTAE69x69F0sZHeuqsar3pRMW3Hjkf7vIHlV4D_U-9to'; 
var fcm1 = new FCM(serverKey1);
  
const client = require('twilio')("ACa7971b7881e2db94aff914f7efb68c81", "20326a88cc3feca1af3a5df461e340eb");



const accessToken = require('../middleware/accessToken');
const {
    Sequelize, 
    sequelize,
    User,
    Category,
    Subcategory,
    Property,
    Order,
    Order_image,
    Order_walkway,
    Order_sidewalk,
    Faq,Lawn_height,
    Term,
    Lawn_size,
    Service_period,
    Fence,
    Cleanup,
    Transaction,
    Color,
    Review,
    Driveway,
    Sidewalk,
    Walkway,
    Card,
    Setting,
    Report,
    Coupon,
    Corner_lot,
    Recurring_history,
    Question,
    Bank_detail,
    Provider_equipment,
    Admin
} = require('../models');
const { reservationsUrl } = require('twilio/lib/jwt/taskrouter/util');

const Op = Sequelize.Op;


// cron.schedule('*/ * * * *', async() => {
//   console.log("cron working");

//   var today_date = moment().add(1, 'days').format('YYYY-MM-DD');

//   try{
//         //  var getrecurring = await Recurring_history.findAll({
//         //   where: sequelize.where(sequelize.fn('date', sequelize.col('date')), '=', today_date)
//         // //   where:{status:'Active'}
//         //  });
        
//          var getrecurring = await Recurring_history.findAll({
//          where: {
//              [Op.and]:sequelize.where(sequelize.fn('date', sequelize.col('date')), '=', today_date),
//              status:'Active'
//          },
//          });
         
         
//      //  return res.json(getrecurring);
//          if(getrecurring && getrecurring.length > 0 ){
//             for(var i=0; getrecurring.length > i; i++ ){
            
//                 var neworder_id =  'ORD'+Math.floor(Math.random() * 100000000000);
                
//                 var checkOrderIdExist = await Order.findOne({where:{order_id:neworder_id}});
//                 if(checkOrderIdExist){
//                 var neworder_id =  'ORD'+Math.floor(Math.random() * 1000000000000);
//                 }
                
                
//                 var getorder = await Order.findOne({where:{order_id:getrecurring[i].order_id}});
//                 var finalamount = (parseFloat(getrecurring[i].grand_total) - parseFloat(getrecurring[i].tax));
//                 var gfinalamount =   parseFloat(finalamount)- parseFloat(getrecurring[i].admin_fee)
//                 var totalAdminCommision =    parseFloat(getrecurring[i].admin_commision)/100*parseFloat(gfinalamount);
//                 var provider_amountttt     = parseFloat(gfinalamount) - parseFloat(totalAdminCommision);
                
//                 var getstripe =  await Admin.findOne();
//                 var stripe = Stripe(getstripe.stripe_key);
        
                
//                 var getcard = await Card.findOne({
//                     where:{user_id:getrecurring[i].user_id,is_primary:1,is_deleted:0}
                    
//                 });
                
//                 var user = await User.findOne({
//                     where:{id:getrecurring[i].user_id,is_deleted:0}
                    
//                 });
                
//                 if(getcard){
                    
                
                        
                        
//                       const charge = await stripe.charges.create({
//                               amount: getrecurring[i].grand_total*100,
//                               currency:'usd',
//                               source: getcard.card_id,
//                               description:'recurring payment from '+user.fristname+" "+user.lastname,
//                               metadata:{user_id:getrecurring[i].user_id},
//                               customer:user.customer_id
//                       });
                      
//                       if(charge.status=='succeeded'){
                           
//                         await Transaction.create({
//                             user_id:getrecurring[i].user_id,
//                             order_id:neworder_id,
//                             category_id:getorder.category_id,
//                             transaction_id : charge.id,
//                             amount:getrecurring[i].grand_total,
//                             stripe_response: JSON.stringify(charge),
//                             payment_status : 2,
//                             provider_id:0
//                         });  
          
            
          
           
           
                          
//                      await Order.create({
//                             order_id:neworder_id,
//                             user_id:getrecurring[i].user_id,
//                             property_id:getrecurring[i].property_id,
//                             category_id:getrecurring[i].category_id,
//                             subcategory_id:0,
//                             subcategory_amount:0,
//                             service_for:"",
//                             on_demand:"Schedule",
//                             on_demand_fee:0,
//                             date:today_date,
//                             lat:getorder.lat,
//                             lng:getorder.lng,
//                             lawn_size_id:getrecurring[i].lawn_size_id,
//                             lawn_size_amount:getrecurring[i].lawn_size_amount,
                            
//                             lawn_height_id:0,//getrecurring[i].lawn_height_id,
//                             lawn_height_amount:0,//getrecurring[i].lawn_height_amount,
                            
//                             service_type:2,
//                             recurring_service_id:0,
                            
//                             fence_id:getrecurring[i].fence_id,
//                             fence_amount:getrecurring[i].fence_amount,
//                             cleanup_id:getrecurring[i].cleanup_id,
//                             cleanup_amount:getrecurring[i].cleanup_amount,
//                             provider_id:0,
//                             corner_lot_id:getrecurring[i].corner_lot_id,
//                             corner_lot_amount:getrecurring[i].corner_lot_amount,
//                             color_id:0,
//                             car_number:0,
//                             driveway:0,
//                             driveway_amount:0,
//                             sidewalk_id:0,
//                             sidewalk_amount:0,
//                             walkway_id:0,
//                             walkway_amount:0,
//                             admin_fee_perc:getrecurring[i].admin_fee_perc,
//                             admin_fee:getrecurring[i].admin_fee,
//                             tax_perc:getrecurring[i].tax_perc,
//                             tax:getrecurring[i].tax,
//                             img1:getorder.img1,
//                             img2:getorder.img2,
//                             img3:getorder.img3,
//                             img4:getorder.img4,
//                             gate_code:(getrecurring[i].gate_code) ? getrecurring[i].gate_code:'',
//                             instructions:"",
//                             total_amount:getrecurring[i].total_amount,
//                             grand_total:getrecurring[i].grand_total,
//                             parent_recurrent_order_id:getorder.order_id,
//                             provider_amount:parseFloat(provider_amountttt),
//                             payment_status:2,

//                       });
//                          var gtrecurring = await Recurring_history.findOne({
//                                              where:{id:getrecurring[i].id}
//                                               });
                                              
//                         gtrecurring.date = moment(gtrecurring.date).add(gtrecurring.on_every, 'days');
//                         gtrecurring.save();
                        
                        
                        
                        
                        
                        
//                         // 
                         
//             // var all_provider= await User.findAll({where:{is_deleted:0,is_blocked:0,status:1,role:2}})
//         var radius = await Setting.findOne({
//         where: {
//             field_key: 'radius'
//         }
//         });
//         var all_provider = await User.findAll({
//             where: {
//                 is_deleted: 0,
//                 is_blocked: 0,
//                 status: 1,
//                 role: 2
//             },
//             attributes: ['id','fcm_token','lat','lng',
//                 [Sequelize.literal("6371 * acos(cos(radians(" + parseFloat(getorder.lat) + ")) * cos(radians(lat)) * cos(radians(" + parseFloat(getorder.lng) + ") - radians(lng)) + sin(radians(" + parseFloat(getorder.lat) + ")) * sin(radians(lat)))"), 'distance']
//             ],
//             having: Sequelize.literal('distance < ' + parseFloat(radius.field_value)),
//             logging: console.log,

//         });
           
//             for(var i=0; i<all_provider.length; i++)
//             {
//                 if(all_provider[i].fcm_token!='')
//                 {
                    
//                 var provider_category = await Provider_equipment.findAll({where:{is_deleted:0,provider_id:all_provider[i].id}})
                 
//                 let group = provider_category.reduce((r, a) => {
//                 r[a.category_id] = [...r[a.category_id] || [], a];
//                 return r;
//                 }, {});
                
                
                
//                 var categories = [];
//                 Object.keys(group).forEach((k,v) => {
//                 categories.push(k)
//                 });

//                 if(categories.indexOf((getorder.category_id).toString()) !== -1){
//                 //return res.json("ok")
//                 //   adminpush.messaging().sendToDevice(all_provider[i].fcm_token,payload,options)
//                  if(all_provider[i].fcm_token !=''){
                
//                         //start notification  
//                         var message = { 
//                         to: all_provider[i].fcm_token, 
//                         collapse_key: '',
                        
//                         notification:{
//                             title:'New Job',
//                             body:'(NEW JOB) available in your Area !'
//                         },
                    
//                         data:{
//                             order_id:neworder_id,
//                             title:'New Job',
//                             body:'(NEW JOB) available in your Area !',
//                             click_action:'postjob'
//                         }
//                         };
                    
                    
//                         fcm.send(message, function(err, response){
//                         if (err) {
//                         console.log("errrrr notification");
//                         } else {
//                         console.log("notification done");
//                         }
//                         });
//                         //end notification
//                 }
//                 }
                
//                 }
//             }
//                         // 
                        
                        
//                         if(user.fcm_token !=''){
                        
//                         //start notification  
//                         var message = { 
//                         to: user.fcm_token, 
//                         collapse_key: '',
                        
//                         notification:{
//                         title:'You recurrent Job',
//                         body:'Your recurrent job posted'
//                         },
                        
//                         data:{
//                         order_id:neworder_id,
//                         title:'You recurrent Job',
//                         body:'Your recurrent job posted',
//                         click_action:'recurrentjob'
//                         }
//                         };
                        
                        
//                         fcm1.send(message, function(err, response){
//                         if (err) {
//                         console.log("errrrr notification");
//                         } else {
//                         console.log("notification done");
//                         }
//                         });
//                         //end notification
//                         }
         
         
                           
//                       }else{
                          
                          
//                          var gtrecurring = await Recurring_history.findOne({
//                                              where:{id:getrecurring[i].id}
//                                               });
                                              
//                         gtrecurring.status ='Cancel';
//                         gtrecurring.save();
                         
//                          if(user.fcm_token !=''){
                        
//                         //start notification  
//                         var message = { 
//                         to: user.fcm_token, 
//                         collapse_key: '',
                        
//                         notification:{
//                         title:'You recurrent job has cancelled',
//                         body:'Your recurrent job cancelled'
//                         },
                        
//                         data:{
//                         order_id:neworder_id,
//                         title:'You recurrent cancelled',
//                         body:'Your recurrent job cancelled',
//                         click_action:'recurrentjob'
//                         }
//                         };
                        
                        
//                         fcm.send(message, function(err, response){
//                         if (err) {
//                         console.log("errrrr notification");
//                         } else {
//                         console.log("notification done");
//                         }
//                         });
//                         //end notification
//                         } 
//                       }
                        
                    
//                 }
               

                
                
                
              
                
    
            
//             }
           
          
             
//          }
//         //  return res.json("ok")
//        console.log("ok")
     
//      }catch(err){
//          console.log(err)
//          console.log("errorrrrrrrrrrrrrrrrrrrrrrrrrr cron")
//      }
    
// });
 
 
 

//  cron test


router.post('/crontest',async(req,res) =>{
    
    
  var today_date = moment().add(1, 'days').format('YYYY-MM-DD');
  // return res.json(today_date)

  try{
        //  var getrecurring = await Recurring_history.findAll({
        //   where: sequelize.where(sequelize.fn('date', sequelize.col('date')), '=', today_date)
        // //   where:{status:'Active'}
        //  });
        
         var getrecurring = await Recurring_history.findAll({
         where: {
             [Op.and]:sequelize.where(sequelize.fn('date', sequelize.col('date')), '=', today_date),
             status:'Active'
             
         },
         limit: 20//for a every second , 20 recurring order post 
         });
         
         
     // return res.json(getrecurring);
         if(getrecurring.length > 0 ){
            for(var i=0; getrecurring.length > i; i++ ){
            
                var neworder_id =  'ORD'+Math.floor(Math.random() * 100000000000);
                
                var checkOrderIdExist = await Order.findOne({where:{order_id:neworder_id}});
                if(checkOrderIdExist){
                var neworder_id =  'ORD'+Math.floor(Math.random() * 1000000000000);
                }
                
                
                var getorder = await Order.findOne({where:{order_id:getrecurring[i].order_id}});
                var finalamount = (parseFloat(getrecurring[i].grand_total) - parseFloat(getrecurring[i].tax));
                var gfinalamount =   parseFloat(finalamount)- parseFloat(getrecurring[i].admin_fee)
                var totalAdminCommision =    parseFloat(getrecurring[i].admin_commision)/100*parseFloat(gfinalamount);
                var provider_amountttt     = parseFloat(gfinalamount) - parseFloat(totalAdminCommision);
                
                var getstripe =  await Admin.findOne();
                var stripe = Stripe(getstripe.stripe_key);
        
                
                var getcard = await Card.findOne({
                    where:{user_id:getrecurring[i].user_id,is_primary:1,is_deleted:0}
                    
                });
                
                var user = await User.findOne({
                    where:{id:getrecurring[i].user_id,is_deleted:0}
                    
                });
                
                if(getcard){
                    
                    //  const token = await stripe.tokens.create({
                    //       card: {
                    //         number:getcard.card_number,
                    //         exp_month:getcard.exp_month,
                    //         exp_year: getcard.exp_year,
                    //         cvc:getcard.cvv,
                    //       },
                    //     });
                        
                        
                      const charge = await stripe.charges.create({
                              amount: getrecurring[i].grand_total*100,
                              currency:'usd',
                              source: getcard.card_id,
                              description:'recurring payment from '+user.fristname+" "+user.lastname,
                              metadata:{user_id:getrecurring[i].user_id},
                              customer:user.customer_id
                      });
                      
                      if(charge.status=='succeeded'){
                           
                        await Transaction.create({
                            user_id:getrecurring[i].user_id,
                            order_id:neworder_id,
                            category_id:getorder.category_id,
                            transaction_id : charge.id,
                            amount:getrecurring[i].grand_total,
                            stripe_response: JSON.stringify(charge),
                            payment_status : 2,
                        });  
          
            
          
           
           
                          
                     await Order.create({
                            order_id:neworder_id,
                            user_id:getrecurring[i].user_id,
                            property_id:getrecurring[i].property_id,
                            category_id:getrecurring[i].category_id,
                            subcategory_id:0,
                            subcategory_amount:0,
                            service_for:"",
                            on_demand:"Schedule",
                            on_demand_fee:0,
                            date:today_date,
                            lawn_size_id:getrecurring[i].lawn_size_id,
                            lawn_size_amount:getrecurring[i].lawn_size_amount,
                            
                            lawn_height_id:0,//getrecurring[i].lawn_height_id,
                            lawn_height_amount:0,//getrecurring[i].lawn_height_amount,
                            
                            service_type:2,
                            recurring_service_id:0,
                            
                            fence_id:getrecurring[i].fence_id,
                            fence_amount:getrecurring[i].fence_amount,
                            cleanup_id:getrecurring[i].cleanup_id,
                            cleanup_amount:getrecurring[i].cleanup_amount,
                            
                            corner_lot_id:getrecurring[i].corner_lot_id,
                            corner_lot_amount:getrecurring[i].corner_lot_amount,
                            color_id:0,
                            car_number:0,
                            driveway:0,
                            driveway_amount:0,
                            sidewalk_id:0,
                            sidewalk_amount:0,
                            walkway_id:0,
                            walkway_amount:0,
                            admin_fee_perc:getrecurring[i].admin_fee_perc,
                            admin_fee:getrecurring[i].admin_fee,
                            tax_perc:getrecurring[i].tax_perc,
                            tax:getrecurring[i].tax,
                            img1:getorder.img1,
                            img2:getorder.img2,
                            img3:getorder.img3,
                            img4:getorder.img4,
                            gate_code:(getrecurring[i].gate_code) ? getrecurring[i].gate_code:'',
                            instructions:"",
                            total_amount:getrecurring[i].total_amount,
                            grand_total:getrecurring[i].grand_total,
                            parent_recurrent_order_id:getorder.order_id,
                            provider_amount:parseFloat(provider_amountttt),
                            payment_status:2,

            });
                         var gtrecurring = await Recurring_history.findOne({
                                             where:{id:getrecurring[i].id}
                                              });
                                              
                        gtrecurring.date = moment(gtrecurring.date).add(gtrecurring.on_every, 'days');
                        gtrecurring.save();
                        
                        
                        
                        
                        
                        
                        
                        
                        if(user.fcm_token !=''){
                        
                        //start notification  
                        var message = { 
                        to: user.fcm_token, 
                        collapse_key: '',
                        
                        notification:{
                        title:'You recurrent Job',
                        body:'Your recurrent job posted'
                        },
                        
                        data:{
                        order_id:neworder_id,
                        title:'You recurrent Job',
                        body:'Your recurrent job posted',
                        click_action:'recurrentjob'
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
         
         
                           
                      }else{
                          
                          
                         var gtrecurring = await Recurring_history.findOne({
                                             where:{id:getrecurring[i].id}
                                              });
                                              
                        gtrecurring.status ='Cancel';
                        gtrecurring.save();
                         
                         if(user.fcm_token !=''){
                        
                        //start notification  
                        var message = { 
                        to: user.fcm_token, 
                        collapse_key: '',
                        
                        notification:{
                        title:'You recurrent job has cancelled',
                        body:'Your recurrent job cancelled'
                        },
                        
                        data:{
                        order_id:neworder_id,
                        title:'You recurrent cancelled',
                        body:'Your recurrent job cancelled',
                        click_action:'recurrentjob'
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
                        
                    
                }
               

                
                
                
              
                
    
            
            }
           
          
             
         }
         return res.json("ok")
       
     
     }catch(err){
         console.log(err)
         console.log("errorrrrrrrrrrrrrrrrrrrrrrrrrr cron")
     }
 })


//  get nearby providers

router.post('/get-nearby-providers',accessToken,async(req,res) =>{
    const {lat,lng} =req.body;
    try{
        
        const user = await User.findOne({where:{id:req.user.user_id,is_deleted:0,status:1}})
        if(!user) return res.json({status:false,message:'User not found'})
        
        if(user.is_blocked==1) return res.json({status:false,message:'User is blocked.'});
        
        const providers = await User.findAll({
            where:{role:2,is_deleted:0},
            attributes: ['id','image','fristname','lastname','lat','lng',[Sequelize.literal("6371 * acos(cos(radians("+parseFloat(lat)+")) * cos(radians(lat)) * cos(radians("+parseFloat(lng)+") - radians(lng)) + sin(radians("+parseFloat(lat)+")) * sin(radians(lat)))"),'distance']],
                                 having: Sequelize.literal('distance < 200'),
                                 order: Sequelize.literal('distance ASC'),
                                 logging: console.log
            
        });
        
        return res.json({status:true,data:{providers},message:"Near by service providers."})
    }catch(err){
        console.log(err)
        return res.json({status:false,message:"something is wrong."});
    }
});

// home
router.post('/home',accessToken,async(req,res) =>{
    const {category_id} = req.body;
    if(!category_id) return res.json({status:false,message:'category id is required'});
    try{
        
        
        const user = await User.findOne({where:{id:req.user.user_id,is_deleted:0,status:1}})
        if(!user) return res.json({status:false,message:'User not found'})
        
        if(user.is_blocked==1) return res.json({status:false,message:'User is blocked.'});
        
        
        var subcategory = await Subcategory.findAll({
             where:{category_id,is_deleted:0},
            });
            
        var ondemand_fee = await Setting.findOne({where:{field_key:'on_demand_fee'}})
        var getstripe =  await Admin.findOne();
               
                
        if(category_id==1){
           
            var lawn_height      = await Lawn_height.findAll({where:{is_deleted:0}});
            var lawn_size        = await Lawn_size.findAll({where:{is_deleted:0}});
            var one_time         = await Service_period.findOne({where:{type:1,is_deleted:0}});
            var recurring        = await Service_period.findAll({where:{type:2,is_deleted:0}});
            var fence            = await Fence.findAll({where:{is_deleted:0}});
            var cleanup          = await Cleanup.findAll({where:{is_deleted:0}});
            var corner_lot       = await Corner_lot.findAll({where:{is_deleted:0}});
                
           return res.json({
               status:true,
               data:{
                   category_id,
                   subcategory,
                   lawn_height,
                   lawn_size,
                   one_time,
                   recurring,
                   fence,
                   cleanup,
                   ondemand_fee:ondemand_fee.field_value,
                   corner_lot:corner_lot,
                   public_stripe_key:getstripe.public_stripe_key
                   
               },message:'Home data'}) 
        }
        
        
        if(category_id==2){
            var color = await Color.findAll({where:{is_deleted:0}});
            
            var hsidewalk            = await Sidewalk.findAll({
                where:{type:'HOME',is_deleted:0},
                order:[['name','DESC']]
                
            });
            var hwalkway             = await Walkway.findAll({
                where:{type:'HOME',is_deleted:0},
                order:[['name','DESC']]
                
            });
            
             var bsidewalk            = await Sidewalk.findAll({
                 where:{type:'BUSINESS',is_deleted:0},
                 order:[['name','DESC']]
                 
             });
             var bwalkway             = await Walkway.findAll({
                 where:{type:'BUSINESS',is_deleted:0},
                 order:[['name','DESC']]
                 
             });
            
            var home     = {sidewalk:hsidewalk,walkway:hwalkway};
            var business = {sidewalk:bsidewalk,walkway:bwalkway};
            
            return res.json({status:true,data:{category_id,subcategory,home,business,color,ondemand_fee:ondemand_fee.field_value,public_stripe_key:getstripe.public_stripe_key},message:'Home data'}) 
        }
       
    }catch(err){
        //  return res.json(err)
        return res.json({status:false,message:'Something is wrong.'});
    }
});

//Properties Lists
router.get('/properties-list',accessToken,async(req,res)=>{
 
  try{
        const user = await User.findOne({where:{id:req.user.user_id,is_deleted:0,status:1}})
        if(!user) return res.json({status:false,message:'User not found'})
        
        if(user.is_blocked==1) return res.json({status:false,message:'User is blocked.'});
         
    //   return res.json(user)
    var propertieslist = await Property.findAll({
        where:{user_id:user.id,is_deleted:0},
        order:[['id','desc']]
        
    });
    
     var on_demand_fee    = await Setting.findOne({where:{field_key:'on_demand_fee'}})
    
    
    return res.json({status:true,data:{propertieslist,ondemand_fee:on_demand_fee.field_value},message:"properties list"})
  }catch{
    (err)=>{
      console.log(err)
      return res.json({status:false,message:"something is wrong"})
    }
  }
});

//delete property
router.post('/delete-property',accessToken,async(req,res)=>{
    const {property_id}=req.body
    if(!property_id) return res.json({status:false,message:"property_id is required"})
    try{
    
        const user = await User.findOne({where:{id:req.user.user_id,is_deleted:0,status:1}})
        if(!user) return res.json({status:false,message:'User not found'})
        
        if(user.is_blocked==1) return res.json({status:false,message:'User is blocked.'});
        
        
        
        var deleteproperty = await Property.findOne({where:{id:property_id}})
        deleteproperty.is_deleted=1
        deleteproperty.save()
        
         return res.json({status:true,message:"property is deleted"})
    }catch(err){
        console.log(err)
        return res.json({status:false,meaasge:"something wrong"})
    }
})



// add properties
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // cb(null,'backend/public/documents/')
     cb(null, path.join(__dirname,'../public/properties'))
      },
    filename: function (req, file, cb) {
      cb(null, Date.now()+'.png')
    }
  })
  var upload = multer({ storage: storage })
  
//add-property

router.post('/addproperty',accessToken,upload.single('image'),async(req,res)=>{


  const {address,lat,long} = req.body
  
  if(!address) return res.json({status:false,message:"add address"})
  
  if(!lat) return res.json({status:false,message:"add lat"})
  
  if(!long) return res.json({status:false,message:"add long"})
  try{
        // return res.json("okk")
        const user = await User.findOne({where:{id:req.user.user_id,is_deleted:0,status:1}})
        if(!user) return res.json({status:false,message:'User not found'})
        
        if(user.is_blocked==1) return res.json({status:false,message:'User is blocked.'});
   
        var same_address=await Property.findOne({where:{address:address,lat:lat,lng:long,is_deleted:0}})
        
        if(same_address) return res.json({status:false,message:"Address is same"})
        
        if(!req.file) return res.json({status:false,message:"Please add property image first"})
        
    await Property.create({
      user_id:user.id,
      address,
      image:req.file ? "/properties/"+req.file.filename:'',
      lat,
      lng:long
    })

   return res.json({status:true,message:"add property successfully done"})
  }catch{
    (err)=>{
      console.log(err)
      return res.json({status:false,message:"somthing is wrong"})
    }
  }
});





router.post('/get-estimation-prices',accessToken,async(req,res) =>{
    const {service_type,lawn_size_id,lawn_height_id,fence_id,cleanup_id,corner_lot_id} = req.body;
    
    if(service_type!="Today" && service_type!="Schedule")  return res.json({status:false,message:'service type is required.'});
    if(!lawn_size_id) return res.json({status:false,message:'lawn size is required.'});
    if(!lawn_height_id) return res.json({status:false,message:'lawn height is required.'});
    
    
    try{
       
        const user = await User.findOne({where:{id:req.user.user_id,is_deleted:0,status:1}})
        if(!user) return res.json({status:false,message:'User not found'})
        
        if(user.is_blocked==1) return res.json({status:false,message:'User is blocked.'});
        
        
        var oneTimeEstimation      = [];
        var sevenDaysEstimation    = [];
        var tenDaysEstimation      = [];
        var fourteenDaysEstimation = [];
        
        
        if(service_type=="Today"){
            
            var on_demand_fee    = await Setting.findOne({where:{field_key:'on_demand_fee'}});
            oneTimeEstimation.push(parseFloat(on_demand_fee.field_value)); 
            
        }
       
        
        // return res.json(on_demand_fee)
        
        
        var admin_fee_lawn   = await Setting.findOne({where:{field_key:'admin_feeLawn'}});  
        
        var tax_rate_lawn   = await Setting.findOne({where:{field_key:'tax_rate_lawn'}});  
        
        // return res.json(admin_fee_lawn)
        
        oneTimeEstimation.push(parseFloat(admin_fee_lawn.field_value));
        sevenDaysEstimation.push(parseFloat(admin_fee_lawn.field_value));
        tenDaysEstimation.push(parseFloat(admin_fee_lawn.field_value));
        fourteenDaysEstimation.push(parseFloat(admin_fee_lawn.field_value));
        
        
      
         
       
         
         
        var lawn_height      = await Lawn_height.findOne({where:{id:lawn_height_id,is_deleted:0}});
        if(!lawn_height) return res.json({status:false,message:'invalid lawn height id.'});
        
        
        oneTimeEstimation.push(lawn_height.price);
        //  if(service_type=="Today"){
        //     sevenDaysEstimation.push(lawn_height.seven_days_price);
        //     tenDaysEstimation.push(lawn_height.ten_days_price);
        //     fourteenDaysEstimation.push(lawn_height.fourteen_days_price);
        //  }
           
           
        
        var lawn_size        = await Lawn_size.findOne({where:{id:lawn_size_id,is_deleted:0}});
        if(!lawn_size) return res.json({status:false,message:'invalid lawn size id.'});
        
        
        oneTimeEstimation.push(lawn_size.price);
        sevenDaysEstimation.push(lawn_size.seven_days_price);
        tenDaysEstimation.push(lawn_size.ten_days_price);
        fourteenDaysEstimation.push(lawn_size.fourteen_days_price);
        
         
        
        
        
        if(fence_id){
            
           var fence        = await Fence.findOne({where:{id:fence_id,is_deleted:0}});
           if(!fence) return res.json({status:false,message:'Fence not found.'});
           
           oneTimeEstimation.push(fence.price);
           sevenDaysEstimation.push(fence.seven_days_price);
           tenDaysEstimation.push(fence.ten_days_price);
           fourteenDaysEstimation.push(fence.fourteen_days_price);
        }
        
        
      
        
        if(cleanup_id){
            
           var cleanup      = await Cleanup.findOne({where:{id:cleanup_id,is_deleted:0}});
           if(!cleanup) return res.json({status:false,message:'Cleanup not found.'});
           
          // return res.json(cleanup)
           
            oneTimeEstimation.push(cleanup.price);
            // sevenDaysEstimation.push(parseFloat(cleanup.price));
            // tenDaysEstimation.push(parseFloat(cleanup.price));
            // fourteenDaysEstimation.push(parseFloat(cleanup.price));
        }
        
        if(corner_lot_id){
            
           var corner_lot   = await Corner_lot.findOne({where:{is_deleted:0}});
           if(!corner_lot) return res.json({status:false,message:'Corner lot not found.'});
           
           oneTimeEstimation.push(corner_lot.price);
           sevenDaysEstimation.push(corner_lot.seven_days_price);
           tenDaysEstimation.push(corner_lot.ten_days_price);
           fourteenDaysEstimation.push(corner_lot.fourteen_days_price);
        }
          
        // var one_time    = await Service_period.findOne({where:{type:1,is_deleted:0}});
        var recurring   = await Service_period.findOne({where:{type:2,recommended:'Yes',is_deleted:0}});
        
        var getRecur   = await Service_period.findAll({where:{type:2,is_deleted:0}});
      
        //   var OneTimeCore = oneTimeEstimation.reduce((a,b) => a + b,0)
        //   var OneTimegetTax =  parseFloat(tax_rate_lawn.field_value)/100*parseFloat(OneTimeCore);          
        //   var oneTimeAmount = parseFloat(OneTimeCore)+parseFloat(OneTimegetTax);
        
           var oneTimeAmount = oneTimeEstimation.reduce((a,b) => a + b,0)
           
 
      
        
        
        var recurrent=[];
        for(var i =0; i < getRecur.length; i++){
            
            var price = 0;
            if(getRecur[i].duration=='7'){
                
               var CorePrice =  sevenDaysEstimation.reduce((a,b) => a + b ,0)
               var getTax =  parseFloat(tax_rate_lawn.field_value)/100*parseFloat(CorePrice);               
               
               price = (parseFloat(CorePrice)+parseFloat(getTax)).toFixed(2);
               
            }
            
             if(getRecur[i].duration=='10'){
                 
            //   price = tenDaysEstimation.reduce((a,b) => a + b, 0).toFixed(2);
            //   tenDaysEstimation.push(parseFloat(tax_rate_lawn.field_value));
            
               var CorePrice =  tenDaysEstimation.reduce((a,b) => a + b ,0)
               var getTax =  parseFloat(tax_rate_lawn.field_value)/100*parseFloat(CorePrice);               
               
               price = (parseFloat(CorePrice)+parseFloat(getTax)).toFixed(2);
               
            }
            
            
            if(getRecur[i].duration=='14'){
                
                // price = fourteenDaysEstimation.reduce((a,b) => a + b, 0).toFixed(2);
                // fourteenDaysEstimation.push(parseFloat(tax_rate_lawn.field_value));
                
                var CorePrice =  fourteenDaysEstimation.reduce((a,b) => a + b ,0)
                var getTax =  parseFloat(tax_rate_lawn.field_value)/100*parseFloat(CorePrice);               
                
                price = (parseFloat(CorePrice)+parseFloat(getTax)).toFixed(2);
            }
           
            recurrent.push({
                    id:getRecur[i].id,
                    duration:getRecur[i].duration,
                    duration_type:getRecur[i].duration_type,
                    recommended:getRecur[i].recommended,
                    price:parseFloat(price).toFixed(2),
            });
        }
       
        
  
     
        return res.json({
        status:true,
        data:{
            onetime_price:parseFloat(oneTimeAmount).toFixed(2),//oneTimeEstimation.reduce((a,b) => a + b,0).toFixed(2),
            recurrent:recurrent
           
        },
        message:'Services estimations.'
        });
        
        
        
    }catch(err){
      console.log(err)
      return res.json({status:false,message:err})  
    }
});


// add properties
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // cb(null,'backend/public/documents/')
     cb(null, path.join(__dirname,'../public/order'))
      },
    filename: function (req, file, cb) {
        let r = (Math.random() + 1).toString(36).substring(3);
        
      cb(null, Date.now()+r+'.png')
    }
  })
  
  
var upload = multer({ storage: storage })
 


router.post('/order',accessToken,upload.fields([{name:'before_img1'},{name:'before_img2'},{name:'before_img3'},{name:'before_img4'}]),async(req,res) =>{
    
    // return res.json({status:false,message:"We are working on it"});
    const {
        category_id,
        subcategory_id,
        property_id,
        on_demand,
        date,
        lawn_size_id,
        lawn_height_id,
        service_type,
        recurring_service_id,
        fence_id,
        cleanup_id,
        before_img1,
        before_img2,
        before_img3,
        before_img4,
        instructions,
        color_id,
        service_for,
        car_number,
        driveway,
        sidewalk_id,
        walkway_id,
        gate_code,
        corner_lot_id
    } = req.body;
            
        
        if(!category_id) return res.json({status:false,message:'Category id is required.'});
        if(!property_id) return res.json({status:false,message:'Property id is required.'});
        // return res.json(req.files.before_img3)
    try{
        
         var get_property = await Property.findByPk(property_id);
         if(!get_property) return res.json({status:false,message:'Property not found.'});
         
        //  return res.json(get_property)
        //  const user = await User.findOne({where:{id:req.user.user_id,is_deleted:0}})
        //  if(!user) return res.json({status:false,message:"user is deleted"})
        
         const user = await User.findOne({where:{id:req.user.user_id,is_deleted:0,status:1}})
        if(!user) return res.json({status:false,message:'User not found'})
        
        if(user.is_blocked==1) return res.json({status:false,message:'User is blocked.'});
        
         
        var sale_fee = await Setting.findOne({where:{field_key:'sale_fee'}});
        var service_fee = await Setting.findOne({where:{field_key:'service_fee'}});
      
          
         var order_id =  'ORD'+Math.floor(Math.random() * 100000000000);
         
         var checkOrderIdExist = await Order.findOne({where:{order_id}});
         if(checkOrderIdExist){
            //  let r = (Math.random() + 1).toString(36).substring(7);
             var order_id =  'ORD'+Math.floor(Math.random() * 1000000000000);
         }
          
          
        var admin_commission    = await Setting.findOne({where:{field_key:'admin_commission'}});
        
        if(category_id==1){
            
            
            // return res.json({status:false,message:service_type})
            if(!on_demand) return res.json({status:false,message:'Demand type is required.'});
            
            if(!service_type || service_type=='' || service_type==0) return res.json({status:false,message:'Select service  onetime or recurrent.'});
            
            if(service_type !=1 &&  service_type !=2 ) return res.json({status:false,message:'Select service  onetime or recurrent.'});
            
            
            
            if(!lawn_height_id) return res.json({status:false,message:'Lawn height is required.'});
            if(!lawn_size_id) return res.json({status:false,message:'Lawn size is required.'});
            
            var lawn_height      = await Lawn_height.findOne({where:{id:lawn_height_id,is_deleted:0}});
            if(!lawn_height) return res.json({status:false,message:'Invalid lawn height id.'});
           
            var lawn_size        = await Lawn_size.findOne({where:{id:lawn_size_id,is_deleted:0}});
            if(!lawn_size) return res.json({status:false,message:'Invalid lawn size id.'});
            
        
                      
             
                    var on_demand_fee    = await Setting.findOne({where:{field_key:'on_demand_fee'}});
                    
                  
                    
                    var admin_fee_lawn   = await Setting.findOne({where:{field_key:'admin_feeLawn'}});
                    
                    var tax_rate_lawn    = await Setting.findOne({where:{field_key:'tax_rate_lawn'}})
                   
                    var dmfee            = (on_demand=='Today') ? on_demand_fee.field_value:0;
          
               
             if(service_type == 2){
                 
                 
                   if(!recurring_service_id) return res.json({status:false,message:'Select period of service.'});
                
                   var service_period   = await Service_period.findOne({where:{id:recurring_service_id,is_deleted:0}}); 
                
                   if(!service_period) return res.json({status:false,message:'Invalid recurent service id.'});
                   
               
                   
                   var  lawnHeightPrice= 0;
                   var  lawnSizePrice  = 0;
                   var  fancePrice     = 0;
                   var  cleanupPrice   = 0;
                   var  cornerPrice    = 0;
                   
                   if(service_period.duration == 7){
                       
                       
                    if(fence_id && fence_id !='' && fence_id !=0){
                        
                       var fence        = await Fence.findOne({where:{id:fence_id,is_deleted:0}});
                       if(!fence) return res.json({status:false,message:'Fence not found.'});
                       fancePrice      = fence.seven_days_price;
                    }
                    
                    if(cleanup_id  && cleanup_id !='' && cleanup_id !=0){
                        
                       var cleanup      = await Cleanup.findOne({where:{id:cleanup_id,is_deleted:0}});
                       if(!cleanup) return res.json({status:false,message:'Cleanup not found.'});
                    //   cleanupPrice    = cleanup.seven_days_price;
                       cleanupPrice    = cleanup.price;
                       
                      // return res.json(cleanupPrice)
                    }
                    
                    if(corner_lot_id !=0 && corner_lot_id==1 && corner_lot_id !=''){
                        
                       var corner_lot   = await Corner_lot.findOne({where:{id:1,is_deleted:0}});
                       if(!corner_lot) return res.json({status:false,message:'Corner lot not found.'});
                       cornerPrice     = corner_lot.seven_days_price;
                    }
                    
                     var lawnHeightPrice = lawn_height.seven_days_price;
                     var lawnSizePrice   = lawn_size.seven_days_price;
                      
                   }
                   
                   if(service_period.duration == 10){
                       
                       
                       
                       
                    if(fence_id && fence_id !='' && fence_id !=0){
                        
                       var fence        = await Fence.findOne({where:{id:fence_id,is_deleted:0}});
                       if(!fence) return res.json({status:false,message:'Fence not found.'});
                       fancePrice   = fence.ten_days_price;
                    }
                    
                    if(cleanup_id  && cleanup_id !=0 && cleanup_id !=''){
                        
                       var cleanup      = await Cleanup.findOne({where:{id:cleanup_id,is_deleted:0}});
                       if(!cleanup) return res.json({status:false,message:'Cleanup not found.'});
                       //   cleanupPrice =  cleanup.ten_days_price;
                       cleanupPrice    = cleanup.price;
                    }
                    
                    if(corner_lot_id==1 && corner_lot_id !='' && corner_lot_id!=0){
                        
                       var corner_lot   = await Corner_lot.findOne({where:{id:1,is_deleted:0}});
                       if(!corner_lot) return res.json({status:false,message:'Corner lot not found.'});
                       cornerPrice     = corner_lot.ten_days_price;
                    }
                   
                    var lawnHeightPrice = lawn_height.ten_days_price;
                    var lawnSizePrice = lawn_size.ten_days_price;
                    
                   }
                   
                   if(service_period.duration == 14){
                       
                       
                       
                       
                    if(fence_id && fence_id !='' && fence_id !=0){
                        
                       var fence        = await Fence.findOne({where:{id:fence_id,is_deleted:0}});
                    //   return res.json(fence)
                       if(!fence) return res.json({status:false,message:'Fence not found.'});
                       var fancePrice   = fence.fourteen_days_price;
                    }
                    
                    if(cleanup_id  && cleanup_id !='' && cleanup_id !=0){
                        
                       var cleanup      = await Cleanup.findOne({where:{id:cleanup_id,is_deleted:0}});
                       if(!cleanup) return res.json({status:false,message:'Cleanup not found.'});
                    //   cleanupPrice =  cleanup.fourteen_days_price;
                       cleanupPrice    = cleanup.price;
                    }
                    
                
                    if(corner_lot_id==1 && corner_lot_id !='' && corner_lot_id !=0){
                        
                       var corner_lot   = await Corner_lot.findOne({where:{id:1,is_deleted:0}});
                       if(!corner_lot) return res.json({status:false,message:'Corner lot not found.'});
                       cornerPrice     = corner_lot.fourteen_days_price;
                    }
                    
                    var lawnHeightPrice = lawn_height.fourteen_days_price;
                    var lawnSizePrice = lawn_size.fourteen_days_price;
                    
                   }
                   
                   
                   
                       
                       
                    var adminFeeAmount =  parseFloat(admin_fee_lawn.field_value);//parseFloat(admin_fee_lawn.field_value)/100 * parseFloat(totalServicePrice);
                    
                    var totalServicePrice = [
                                               parseFloat(dmfee),
                                               (lawn_height) ? lawn_height.price:0,
                                               (lawn_size) ? lawn_size.price:0,
                                               (fence) ? fence.price:0,
                                               (cleanup) ? cleanup.price:0,
                                               (corner_lot) ? corner_lot.price:0,
                                               adminFeeAmount
                       ].reduce((a, b) => a + b, 0);
                       
                       
                    var taxFeeAmount   =  parseFloat(tax_rate_lawn.field_value)/100 * parseFloat(totalServicePrice);
                       
                       
                       
                //  return res.json({t:adminFeeAmount,b:taxFeeAmount,s:totalServicePrice});
                    var order = await Order.create({
                                order_id,
                                user_id:user.id,
                                property_id,
                                lat:get_property.lat,
                                lng:get_property.lng,
                                category_id,
                                subcategory_id:subcategory_id ? subcategory_id:0,
                                subcategory_amount:0,
                                service_for:service_for ? service_for:"",
                                on_demand:on_demand,
                                on_demand_fee:parseFloat(dmfee),
                                date:moment(date).format("YYYY-MM-DD"),
                                lawn_size_id:(lawn_size) ? lawn_size.id:0,
                                lawn_size_amount:(lawn_size) ? lawn_size.price:0,
                                
                                lawn_height_id:(lawn_height) ? lawn_height.id:0,
                                lawn_height_amount:(lawn_height) ?lawn_height.price:0,
                                
                                service_type,
                                recurring_service_id:service_period ? service_period.id:0,
                                
                                fence_id:fence         ? fence.id:0,
                                fence_amount:fence     ? fence.price:0,
                                cleanup_id:cleanup     ? cleanup.id:0,
                                cleanup_amount:cleanup ? cleanup.price:0,
                                
                                corner_lot_id:corner_lot  ? corner_lot.id:0,
                                corner_lot_amount:corner_lot  ? corner_lot.price:0,
            
                                
                                color_id:color_id ? color_id:0,
                                car_number:car_number ? car_number:0,
                                driveway:0,
                                driveway_amount:0,
                                sidewalk_id:0,
                                sidewalk_amount:0,
                                walkway_id:0,
                                walkway_amount:0,
                                
                               
                                admin_fee_perc:admin_fee_lawn.field_value,
                                admin_fee:adminFeeAmount,
                                
                                tax_perc:tax_rate_lawn.field_value,
                                tax:taxFeeAmount,
                                
                                
                                provider_amount:0,
                                
                                img1:(req.files.before_img1) ? '/order/'+req.files.before_img1[0].filename:"",
                                img2:(req.files.before_img2) ? '/order/'+req.files.before_img2[0].filename:"",
                                img3:(req.files.before_img3) ? '/order/'+req.files.before_img3[0].filename:"",
                                img4:(req.files.before_img4) ? '/order/'+req.files.before_img4[0].filename:"",
                                gate_code:gate_code ? gate_code:"",
                                instructions:instructions ? instructions:"",
                                total_amount:[adminFeeAmount,parseFloat(dmfee),(lawn_height) ? lawn_height.price:0,(lawn_size) ? lawn_size.price:0,(fence) ? fence.price:0,(cleanup) ? cleanup.price:0,(corner_lot) ? corner_lot.price:0].reduce((a, b) => a + b, 0),
                                grand_total:[adminFeeAmount,taxFeeAmount,parseFloat(dmfee),(lawn_height) ? lawn_height.price:0,(lawn_size) ? lawn_size.price:0,(fence) ? fence.price:0,(cleanup) ? cleanup.price:0,(corner_lot) ? corner_lot.price:0].reduce((a, b) => a + b, 0),
                });
                
                //   return res.json(order);
                
                
               
               
               
                   var RecurringtotalServicePrice = [
                                               (lawn_size) ? parseFloat(lawnSizePrice):0,
                                               (fence) ? parseFloat(fancePrice):0,
                                               (corner_lot) ? parseFloat(cornerPrice):0,
                                            //   (cleanup) ? parseFloat(cleanupPrice):0,
                                               adminFeeAmount
                       ].reduce((a, b) => a + b, 0);
                       
                       
                    var RecurringtaxFeeAmount   =  parseFloat(tax_rate_lawn.field_value)/100 * parseFloat(RecurringtotalServicePrice);
               
            //   return res.json(RecurringtaxFeeAmount)
                //  await Recurring_history.create({
                //         order_id:order.order_id,
                //         user_id:user.id ,
                //         property_id,
                //         category_id,
                //         provider_id:0,
                //         service_for:service_for ? service_for:"",
                //         on_every:service_period.duration,
                //         date:moment(date).add(service_period.duration, 'days'),
                        
                //         lawn_size_id:(lawn_size) ? lawn_size.id:0,
                //         lawn_size_amount:(lawn_size) ? parseFloat(lawnSizePrice):0,
                        
                //         lawn_height_id:0,
                //         lawn_height_amount:0,
                                
                        
                //         fence_id:fence         ? fence.id:0,
                //         fence_amount:fence     ? parseFloat(fancePrice):0,
                //         // cleanup_id:cleanup     ? cleanup.id:0,
                //         // cleanup_amount:cleanup ? cleanupPrice:0,
                //         cleanup_id:0,
                //         cleanup_amount:0,
                //         corner_lot_id:corner_lot  ? corner_lot.id:0,
                //         corner_lot_amount:corner_lot  ? parseFloat(cornerPrice):0,
                        
                       
                //         admin_fee_perc:admin_fee_lawn.field_value,
                //         admin_fee:parseFloat(adminFeeAmount),
                        
                //         tax_perc:tax_rate_lawn.field_value,
                //         tax:parseFloat(RecurringtaxFeeAmount),
                        
                //         total_amount:parseFloat(RecurringtotalServicePrice),
                //         grand_total:[parseFloat(RecurringtaxFeeAmount),parseFloat(RecurringtotalServicePrice)].reduce((a, b) => a + b, 0),
                // });
                
                  var admin_commission   = await Setting.findOne({where:{field_key:'admin_commission'}});  
                  
                 await Recurring_history.create({
                        order_id:order.order_id,
                        user_id:user.id ,
                        provider_id:0,
                        
                        property_id,
                        service_for:service_for ? service_for:"",
                        on_every:service_period.duration,
                        date:moment(date).add(service_period.duration, 'days'),
                        
                        lawn_size_id:(lawn_size) ? lawn_size.id:0,
                        lawn_size_amount:(lawn_size) ? lawnSizePrice:0,

                        category_id,
                        lawn_height_id:0,
                        lawn_height_amount:0,
                                
                        
                        fence_id:fence         ? fence.id:0,
                        fence_amount:fence     ? fancePrice:0,
                        
                        // cleanup_id:cleanup     ? cleanup.id:0,
                        // cleanup_amount:cleanup ? cleanupPrice:0,
                        cleanup_id:cleanup   ? cleanup.id:0,
                        cleanup_amount:0, 
                        corner_lot_id:corner_lot  ? corner_lot.id:0,
                        corner_lot_amount:corner_lot  ? cornerPrice:0,
                        
                       
                        admin_fee_perc:admin_fee_lawn.field_value,
                        admin_fee:adminFeeAmount,
                        
                        tax_perc:tax_rate_lawn.field_value,
                        tax:RecurringtaxFeeAmount,
                        gate_code:gate_code ? gate_code:"",
                        admin_commision:parseFloat(admin_commission.field_value),
                        total_amount:parseFloat(RecurringtotalServicePrice),
                        grand_total:[parseFloat(RecurringtaxFeeAmount),parseFloat(RecurringtotalServicePrice)].reduce((a, b) => a + b, 0),
                });
                
                
                // const stripe = require('stripe')('sk_test_51JUPX2Kgkddq8mOSKBwOLevPtYMKgpyoDx12KOStjQonD3g2NirMIgPwD6jdrffhEeP4JAu0l5vlf0OOBjHgpOgl00q3NMoWZ2');
                    
                    
                  


                
          
             }else{
                 
                
                
            
              
                       
                       
                    if(fence_id && fence_id !='' && fence_id !=0){
                        
                       var fence        = await Fence.findOne({where:{id:fence_id,is_deleted:0}});
                       if(!fence) return res.json({status:false,message:'Fence not found.'});
                    }
                    
                    if(cleanup_id  && cleanup_id !='' && cleanup_id !=0){
                        
                       var cleanup      = await Cleanup.findOne({where:{id:cleanup_id,is_deleted:0}});
                       if(!cleanup) return res.json({status:false,message:'Cleanup not found.'});
                    }
                    
                    if(corner_lot_id==1 && corner_lot_id !='' && corner_lot_id!=0){
                        
                       var corner_lot   = await Corner_lot.findOne({where:{id:1,is_deleted:0}});
                       if(!corner_lot) return res.json({status:false,message:'Corner lot not found.'});
                       
                    }
                    
                   
                
                   
                    var adminFeeAmount    =  parseFloat(admin_fee_lawn.field_value); //parseFloat(admin_fee_lawn.field_value)/100 * parseFloat(totalServicePrice);
                    var totalServicePrice = [parseFloat(dmfee),adminFeeAmount,(lawn_height) ? lawn_height.price:0,(lawn_size) ? lawn_size.price:0,(fence) ? fence.price:0,(cleanup) ? cleanup.price:0,(corner_lot) ? corner_lot.price:0].reduce((a, b) => a + b, 0);
                    var taxFeeAmount      =  parseFloat(tax_rate_lawn.field_value)/100 * parseFloat(totalServicePrice);
                    
                    
                         var order = await Order.create({
                                order_id,
                                user_id:user.id,
                                property_id,
                                lat:get_property.lat,
                                lng:get_property.lng,
                                category_id,
                                subcategory_id:subcategory_id ? subcategory_id:0,
                                subcategory_amount:0,
                                service_for:service_for ? service_for:"",
                                on_demand:on_demand,
                                on_demand_fee:parseFloat(dmfee),
                                date:moment(date).format("YYYY-MM-DD"),
                                lawn_size_id:(lawn_size) ? lawn_size.id:0,
                                lawn_size_amount:(lawn_size) ? lawn_size.price:0,
                                
                                lawn_height_id:(lawn_height) ? lawn_height.id:0,
                                lawn_height_amount:(lawn_height) ?lawn_height.price:0,
                                
                                service_type,
                                recurring_service_id:service_period ? service_period.id:0,
                                
                                fence_id:typeof fence !== 'undefined'         ? fence.id:0,
                                fence_amount:typeof fence !== 'undefined'     ? fence.price:0,
                                cleanup_id:typeof cleanup !== 'undefined'     ? cleanup.id:0,
                                cleanup_amount:typeof cleanup !== 'undefined' ? cleanup.price:0,
                                
                                corner_lot_id:typeof corner_lot !== 'undefined'  ? corner_lot.id:0,
                                corner_lot_amount:corner_lot  ? corner_lot.price:0,
            
                                
                                color_id:color_id ? color_id:0,
                                car_number:car_number ? car_number:0,
                                driveway:0,
                                driveway_amount:0,
                                sidewalk_id:0,
                                sidewalk_amount:0,
                                walkway_id:0,
                                walkway_amount:0,
                                
                                admin_fee_perc:admin_fee_lawn.field_value,
                                admin_fee:adminFeeAmount,
                                
                                tax_perc:tax_rate_lawn.field_value,
                                tax:taxFeeAmount,
                                provider_amount:0,
                                
                                
                                img1:(req.files.before_img1) ? '/order/'+req.files.before_img1[0].filename:"",
                                img2:(req.files.before_img2) ? '/order/'+req.files.before_img2[0].filename:"",
                                img3:(req.files.before_img3) ? '/order/'+req.files.before_img3[0].filename:"",
                                img4:(req.files.before_img4) ? '/order/'+req.files.before_img4[0].filename:"",
                                gate_code:gate_code ? gate_code:"",
                                instructions:instructions ? instructions:"",
                                total_amount:[parseFloat(dmfee),adminFeeAmount,(lawn_height) ? lawn_height.price:0,(lawn_size) ? lawn_size.price:0,(fence) ? fence.price:0,(cleanup) ? cleanup.price:0,(corner_lot) ? corner_lot.price:0].reduce((a, b) => a + b, 0),
                                grand_total:[parseFloat(dmfee),adminFeeAmount,taxFeeAmount,(lawn_height) ? lawn_height.price:0,(lawn_size) ? lawn_size.price:0,(fence) ? fence.price:0,(cleanup) ? cleanup.price:0,(corner_lot) ? corner_lot.price:0].reduce((a, b) => a + b, 0),
                });
                
                
             }
        
        
        
        }
        
        
        
        
        
          if(category_id==2){
              
            // if(service_for!='CAR' || service_for!='HOME' || service_for!='BUSINESS') 
            // return res.json({status:false,message:'Invalid service for CAR,HOME,BUSINESS should be.'})
            
            
            var admin_fee_snow   = await Setting.findOne({where:{field_key:'admin_feeSnow'}});
                    
            var tax_rate_snow    = await Setting.findOne({where:{field_key:'tax_rate_snow'}});
            
          
            
                    
                    
                
            if(!service_for) return res.json({status:false,message:'select service for is required'});
            
            if(service_for=="CAR"){
               if(!subcategory_id) return res.json({status:false,message:'Subcategory_id not found.'});
               
               var subcategory = await Subcategory.findOne({where:{id:subcategory_id,is_deleted:0}});
               if(!subcategory) return res.json({status:false,message:'Subcategory not found.'});
               
               if(!car_number) return res.json({status:false,message:'Car number is required.'});
               
            //   if(!before_img1) return res.json({status:false,message:'first frame image is required.'});
               
               var color = await Color.findOne({where:{id:color_id,is_deleted:0}});
               if(!color) return res.json({status:false,message:'Color not found.'});
               
   
            
                var adminFeeAmount =  parseFloat(admin_fee_snow.field_value); //parseFloat(admin_fee_snow.field_value)/100 * parseFloat(totalServicePrice);
                var totalServicePrice = [subcategory.price,adminFeeAmount].reduce((a, b) => a + b, 0);
                
                var taxFeeAmount   =  parseFloat(tax_rate_snow.field_value)/100 * parseFloat(totalServicePrice);
              
               
                    
          
            var order = await Order.create({
                                order_id,
                                user_id:user.id,
                                property_id,
                                lat:get_property.lat,
                                lng:get_property.lng,
                                category_id,
                                subcategory_id:subcategory_id?subcategory_id:0,
                                subcategory_amount:subcategory.price,
                                service_for,
                                on_demand:'',
                                on_demand_fee:0,
                                date:moment().format("YYYY-MM-DD HH:mm:ss"),
                                lawn_size_id:0,
                                lawn_height_id:0,
                                service_type:0,
                                period:0,
                                period_amount:0,
                                fence_id:0,
                                fence_amount:0,
                                cleanup_id:0,
                                cleanup_amount:0,
                                gate_code:gate_code ? gate_code:"",
                                color_id:color_id,
                                car_number:car_number,
                                driveway:0,
                                driveway_amount:0,
                                sidewalk_id:0,
                                sidewalk_amount:0,
                                walkway_id:0,
                                walkway_amount:0,
        
                                admin_fee_perc:admin_fee_snow.field_value,
                                admin_fee:adminFeeAmount,
                                
                                tax_perc:tax_rate_snow.field_value,
                                tax:taxFeeAmount,
                                provider_amount:0,
                                
                                img1:(req.files.before_img1) ? '/order/'+req.files.before_img1[0].filename:"",
                                img2:(req.files.before_img2) ? '/order/'+req.files.before_img2[0].filename:"",
                                img3:(req.files.before_img3) ? '/order/'+req.files.before_img3[0].filename:"",
                                img4:"",
                                instructions:instructions ? instructions:"",
                                total_amount:[adminFeeAmount,subcategory.price].reduce((a, b) => a + b, 0),
                                grand_total:[adminFeeAmount,taxFeeAmount,subcategory.price].reduce((a, b) => a + b, 0),
                               
                });
        
            //  return res.json(order)
        
            }
            
            if(service_for=="HOME"){
                
               
              if(!driveway)    return res.json({status:false, message:'driveway is required.'});
            //   if(!sidewalk_id) return res.json({status:false, message:'sidewalk is required.'});
            //   if(!walkway_id)  return res.json({status:false, message:'walkway is required.'});
              
              
          
         
              
              var driveway_amount = 0;
               
              if(driveway){
                  const  hdriveways  = await  Driveway.findOne({where:{type:'HOME',is_deleted:0}});
                  if(!hdriveways) return res.json({status:false,message:'Driveway not found.'});
                  
                //   if(driveway == 1){
                //       driveway_amount = hdriveways.on_first_car*parseInt(driveway);
                //   }
                  
                //   if(driveway > 6){
                //     //   driveway_amount = hdriveways.on_first_car*driveway;
                //       var cdriveway = parseInt(driveway)-1;
                //       driveway_amount = (hdriveways.on_first_car*1) + (hdriveways.more_than_one*cdriveway);
                //   }
                
                
                
                  if(driveway <= 6){
                    //   driveway_amount = hdriveways.on_first_car*parseInt(driveway);
                    // six car price will be same for all 6 car 1=6
                       driveway_amount = hdriveways.on_first_car;
                  }
                  
                  if(driveway > 6){
                    //   driveway_amount = hdriveways.on_first_car*driveway;
                       var cdriveway = parseInt(driveway)-6;
                    //   driveway_amount = (hdriveways.on_first_car*6) + (hdriveways.more_than_one*cdriveway);
                      driveway_amount = (hdriveways.on_first_car) + (hdriveways.more_than_one*cdriveway);
                  }
                 
                  
              }
              
              
           
            
              var order = await Order.create({
                        order_id,
                        user_id:user.id,
                        property_id,
                        lat:get_property.lat,
                        lng:get_property.lng,
                        category_id,
                        subcategory_id:subcategory_id ? subcategory_id:0,
                        subcategory_amount:0,
                        service_for,
                        on_demand:'',
                        on_demand_fee:0,
                        date:moment().format("YYYY-MM-DD HH:mm:ss"),
                        lawn_size_id:0,
                        lawn_height_id:0,
                        service_type:0,
                        period:0,
                        period_amount:0,
                        fence_id:0,
                        fence_amount:0,
                        cleanup_id:0,
                        cleanup_amount:0,
                        gate_code:gate_code ? gate_code:"",
                        color_id:color_id ? color_id:0,
                        car_number:car_number ? car_number:'',
                        
                        driveway:driveway,
                        driveway_amount:driveway_amount,
                        
                        sidewalk_id:(sidewalk_id) ? sidewalk_id:0,
                        sidewalk_amount:0,
                        
                        walkway_id:(walkway_id) ? walkway_id:0,
                        walkway_amount:0,
                        
                        admin_fee_perc:"0",
                        admin_fee:0,
                        
                        tax_perc:"0",
                        tax:0,
                        
                        img1:(req.files.before_img1) ? '/order/'+req.files.before_img1[0].filename:"",
                        img2:(req.files.before_img2) ? '/order/'+req.files.before_img2[0].filename:"",
                        img3:(req.files.before_img3) ? '/order/'+req.files.before_img3[0].filename:"",
                        img4:"",
                        instructions:instructions ? instructions:"",
                        // total_amount:[parseFloat(admin_fee.field_value),parseFloat(tax_rate.field_value),driveway_amount].reduce((a, b) => a + b, 0),
                        // grand_total:[parseFloat(admin_fee.field_value),parseFloat(tax_rate.field_value),driveway_amount].reduce((a, b) => a + b, 0),
                        
                        total_amount:driveway_amount,
                        grand_total:driveway_amount,
                  
              });
              
              
              var sidewalkTotal = [];
               if(sidewalk_id){
                  
                var getArraySideWalk = sidewalk_id.split(",");
                
                   for(var i =0; i< getArraySideWalk.length; i++){
                    
                    const  hsidewalk = await Sidewalk.findOne({where:{id:getArraySideWalk[i],type:'HOME',is_deleted:0}});
        
                    if(hsidewalk){
                        await Order_sidewalk.create({
                            order_id:order.order_id,
                            sidewalk_id:hsidewalk.id,
                            amount:hsidewalk.price
                        });
                        
                         sidewalkTotal.push(hsidewalk.price)
                    }
                    
                   }
                   
               }else{
                    sidewalkTotal.push(0)
               }
               
                   
                   
                   
                
                  var walkwayTotal = [];
                   if(walkway_id){
                      
                        var getArrayWalkway = walkway_id.split(",");
                   
                        for(var i =0; i< getArrayWalkway.length; i++){
                        
                        const  hwalkway = await  Walkway.findOne({where:{id:getArrayWalkway[i],type:'HOME',is_deleted:0}});
                        
                        if(hwalkway){
                        await Order_walkway.create({
                        order_id:order.order_id,
                        walkway_id:hwalkway.id,
                        amount:hwalkway.price
                        });
                        
                        
                        walkwayTotal.push(hwalkway.price)
                        }
                    
                      }
                   
                   }else{
                       walkwayTotal.push(0)
                   }
                   
                   
                   
                   
                   var wtotal = walkwayTotal.reduce((a, b) => a + b, 0);
                   var stotal = sidewalkTotal.reduce((a, b) => a + b, 0);
                   
                 
                   var adminFeeAmount =  parseFloat(admin_fee_snow.field_value); ///parseFloat(admin_fee_snow.field_value)/100 * parseFloat(totalServicePrice);
                   
                   var totalServicePrice = [order.total_amount,parseFloat(wtotal),parseFloat(stotal),adminFeeAmount].reduce((a, b) => a + b, 0);
                   var taxFeeAmount   =  parseFloat(tax_rate_snow.field_value)/100 * parseFloat(totalServicePrice);
                   
                   
                   order.sidewalk_amount = parseFloat(stotal);
                   order.walkway_amount  = parseFloat(wtotal);
                   
                    order.admin_fee_perc=admin_fee_snow.field_value;
                    order.admin_fee=adminFeeAmount;
                    
                    order.tax_perc=tax_rate_snow.field_value;
                    order.tax=taxFeeAmount;
                    order.provider_amount=0;//parseFloat(totalServicePrice)-parseFloat(adminFeeAmount),
                        
                   order.total_amount=[adminFeeAmount,order.total_amount,parseFloat(wtotal),parseFloat(stotal)].reduce((a, b) => a + b, 0);
                   order.grand_total=[adminFeeAmount,taxFeeAmount,order.grand_total,parseFloat(wtotal),parseFloat(stotal)].reduce((a, b) => a + b, 0);
                   order.save();
                  
            }
            
            if(service_for=="BUSINESS"){
                
              if(!driveway)    return res.json({status:false, message:'driveway is required.'});
            //   if(!sidewalk_id) return res.json({status:false, message:'sidewalk is required.'});
            //   if(!walkway_id)  return res.json({status:false, message:'walkway is required.'});
              
             
              const  bdriveways  = await  Driveway.findOne({where:{type:'BUSINESS',is_deleted:0}});
              
              
              var driveway_amount = 0;
              
              if(driveway){
                  const  bdriveways  = await  Driveway.findOne({where:{type:'BUSINESS',is_deleted:0}});
                  if(!bdriveways) return res.json({status:false,message:'Driveway not found.'});
                  
                //   if(driveway.length > 1){
                //       driveway_amount = bdriveways.on_first_car*driveway;
                //   }else{
                //       driveway_amount = bdriveways.more_than_one*driveway;
                //   }
                  
                  if(driveway <= 6){
                    //   driveway_amount = bdriveways.on_first_car*driveway;
                     driveway_amount = bdriveways.on_first_car;
                  }
                  
                  if(driveway > 6){
                       var cdriveway = parseInt(driveway)-6;
                       driveway_amount = (bdriveways.on_first_car) + (bdriveways.more_than_one*cdriveway);
                       //driveway_amount = bdriveways.more_than_one*driveway;
                  }
                  
              }
              
             
               var order = await Order.create({
                        order_id,
                        user_id:user.id,
                        property_id,
                        lat:get_property.lat,
                        lng:get_property.lng,
                        category_id,
                        subcategory_id:subcategory_id?subcategory_id:0,
                        subcategory_amount:0,
                        service_for,
                        on_demand:'',
                        on_demand_fee:0,
                        date:moment().format("YYYY-MM-DD HH:mm:ss"),
                        lawn_size_id:0,
                        lawn_height_id:0,
                        service_type:0,
                        period:0,
                        period_amount:0,
                        fence_id:0,
                        fence_amount:0,
                        cleanup_id:0,
                        cleanup_amount:0,
                        gate_code:gate_code ? gate_code:"",
                        color_id:color_id ? color_id:0,
                        car_number:car_number ? car_number:"",
                        
                        driveway:driveway,
                        driveway_amount:driveway_amount,
                        
                        sidewalk_id:(sidewalk_id) ? sidewalk_id:0,
                        sidewalk_amount:0,
                        
                        walkway_id:(walkway_id) ? walkway_id:0,
                        walkway_amount:0,
                        
                        admin_fee_perc:'0',
                        admin_fee:0,
                        
                        tax_perc:'0',
                        tax:0,
                        
                        
                        img1:(req.files.before_img1) ? '/order/'+req.files.before_img1[0].filename:"",
                        img2:(req.files.before_img2) ? '/order/'+req.files.before_img2[0].filename:"",
                        img3:(req.files.before_img3) ? '/order/'+req.files.before_img3[0].filename:"",
                        img4:"",
                        instructions:instructions ? instructions:"" ,
                        total_amount:driveway_amount,
                        grand_total:driveway_amount,
                   });
                   
                 
                 
                  var sidewalkTotal = [];
                  if(sidewalk_id){
                        var getArraySideWalk = sidewalk_id.split(",");
                      
                            for(var i =0; i< getArraySideWalk.length; i++){
                            
                            const  bsidewalk = await Sidewalk.findOne({where:{id:getArraySideWalk[i],type:'BUSINESS',is_deleted:0}});
                            
                            if(bsidewalk){
                            await Order_sidewalk.create({
                            order_id:order.order_id,
                            sidewalk_id:bsidewalk.id,
                            amount:bsidewalk.price
                            });
                            sidewalkTotal.push(bsidewalk.price)
                            }
                        
                        } 
                  }else{
                       sidewalkTotal.push(0)
                  }
                  
                   
                  
                   
                var walkwayTotal = [];  
                if(sidewalk_id){
                   var getArrayWalkway = walkway_id.split(",");
                 
                   for(var i =0; i< getArrayWalkway.length; i++){
                    
                    const  bwalkway = await  Walkway.findOne({where:{id:getArrayWalkway[i],type:'BUSINESS',is_deleted:0}});
        
                    if(bwalkway){
                        await Order_walkway.create({
                            order_id:order.order_id,
                            walkway_id:bwalkway.id,
                            amount:bwalkway.price
                        });
                        
                        walkwayTotal.push(bwalkway.price);
                    }
                    
                   }
                   
                }else{
                   walkwayTotal.push(0);  
                }
                   
                   
                   var wtotal = walkwayTotal.reduce((a, b) => a + b, 0);
                   var stotal = sidewalkTotal.reduce((a, b) => a + b, 0);
                   
                  
                  
                   var adminFeeAmount =  parseFloat(admin_fee_snow.field_value); //parseFloat(admin_fee_snow.field_value)/100 * parseFloat(totalServicePrice);
                   
                   var totalServicePrice = [order.total_amount,parseFloat(wtotal),parseFloat(stotal),adminFeeAmount].reduce((a, b) => a + b, 0);
                   var taxFeeAmount   =  parseFloat(tax_rate_snow.field_value)/100 * parseFloat(totalServicePrice);
                   
                   
                   order.sidewalk_amount = parseFloat(stotal);
                   order.walkway_amount  = parseFloat(wtotal);
                   
                   order.admin_fee_perc=admin_fee_snow.field_value;
                   order.admin_fee=adminFeeAmount;
                    
                   order.tax_perc=tax_rate_snow.field_value;
                   order.tax=taxFeeAmount; 
                   order.provider_amount=0;//parseFloat(totalServicePrice)-parseFloat(adminFeeAmount),
                   
                   order.total_amount=[adminFeeAmount,order.total_amount,parseFloat(wtotal),parseFloat(stotal)].reduce((a, b) => a + b, 0);
                   order.grand_total=[adminFeeAmount,taxFeeAmount,order.grand_total,parseFloat(wtotal),parseFloat(stotal)].reduce((a, b) => a + b, 0);
                   order.save();
             
            }
            
        
        }
    //   payload 
        
        
    //  var payload = {
    //       notification:{

    //           title:'You have a request',
    //           body:'test test test test test test'
    //       }
    //   };
       
       
    //   var options = {
    //         priority: "high",
    //         timeToLive: 60 * 60 * 24,
            
    //   };
        
       
    
    //  var all_provider= await User.findAll({where:{is_deleted:0,is_blocked:0,status:1,role:2}})
    
      
    // for(i=0; i<all_provider.length; i++)
    // {
    //   if(all_provider[i].fcm_token!='')
    //   {
    //   adminpush.messaging().sendToDevice(all_provider[i].fcm_token,payload,options)
    //   }
    // }
     
     
     

     
        return res.json({status:true,data:{order_id:order.order_id},message:"order has been successfully placed."});
    }catch(err){
         console.log(err)
       // return res.json(err)
        return res.json({status:false,message:'Something is wrong.'});
    }
    
    
});




router.post('/order-summary',accessToken,async(req,res) =>{
    
    const {order_id,tip } = req.body;
    
    if(!order_id) return res.json({status:false,message:"Order is required."});
    
    try{
        
        //  const user = await User.findOne({where:{id:req.user.user_id,is_deleted:0}});
        //  if(!user) return res.json({status:false,message:"user is deleted"});
        
        
        const user = await User.findOne({where:{id:req.user.user_id,is_deleted:0,status:1}})
        if(!user) return res.json({status:false,message:'User not found'})
        
        if(user.is_blocked==1) return res.json({status:false,message:'User is blocked.'});
        
          var admin_commission   = await Setting.findOne({where:{field_key:'admin_commission'}});  
      
        var order = await Order.findOne({
            where:{order_id},
            include:[
                     {model:Lawn_height,as:'lawn_height'},
                     {model:Property,as:'property'},
                     {model:Lawn_size, as:'lawn_size'},
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
                     {model:Fence,as:'fence'},
                     {model:Cleanup,as:'cleanup'},
                     {model:Subcategory,as:'subcategory'},
                     {model:Color,as:'color'}
                    ]
            
        });
        
        if(!order) return res.json({status:false,message:'Order id not found.'});
        
         
         
         var finalamount = (parseFloat(order.grand_total) - parseFloat(order.tax));
         var gfinalamount =   parseFloat(finalamount)- parseFloat(order.admin_fee)
     
         var totalAdminCommision =    parseFloat(admin_commission.field_value)/100*parseFloat(gfinalamount);
     
         var provider_amount     = parseFloat(gfinalamount) - parseFloat(totalAdminCommision);
       
        //  return res.json({gtotal:order.grand_totalprovider_amount})
         if(order.category_id==1){
        
            if(tip){
                
                order.grand_total =  parseFloat(order.grand_total)-parseFloat(order.tip);
                order.save();
                
                order.tip         = parseFloat(tip);
                order.grand_total =  parseFloat(order.grand_total)+parseFloat(tip);
               // order.provider_amount = parseFloat(provider_amount);
                order.save();
               
              }
              if(order.provider_amount==0){
                order.provider_amount = parseFloat(provider_amount); 
                order.save();
              }
               
              
              var couponType ="";
              if(order.coupon_type==1){
                   couponType = "Flat";
              }
              
               if(order.coupon_type==2){
                   couponType = "Percentage";
              }
             
            // return res.json(order.on_demand_fee)
         var  orderdata ={
                order_id:order.order_id,
                category_id:(order.category_id) ? order.category_id:0,
                service_for:(order.service_for) ? order.service_for:'',
                address:order.property.address,
                date:moment(order.date).format('MM-DD-YYYY'),
                
                on_demand_fee:order.on_demand_fee,
                
                // lawn_size:(order.lawn_height)        ? order.lawn_height.name:'',
                // lawn_size_price:(order.lawn_height)  ? order.lawn_height.price:0,
                
                // lawn_height:(order.lawn_size)        ? order.lawn_size.name:'',
                // lawn_height_price:(order.lawn_size)  ? order.lawn_size.price:0,
                
                lawn_height:order.lawn_height.name,
                lawn_height_price:order.lawn_height_amount,
                
                
                
                lawn_size    :order.lawn_size.name,
                lawn_size_price:order.lawn_size_amount,
                
                
                fence:(order.fence)                  ? order.fence.name:'',
                fence_price:order.fence_amount,
                yard_cleanup:(order.cleanup)         ? order.cleanup.name:'',
                yard_cleanup_price:order.cleanup_amount,
                corner_lot_amount:(order.corner_lot_amount).toString(),
                admin_fee:order.admin_fee,
                discount_amount:order.discount_amount,
                coupon_code:order.coupon_code,
                discounted_type:couponType,
                coupon_discounted:order.discount_value,
                sub_total:(order.total_amount).toString(),
                tax:order.tax,
                tip:parseFloat((order.tip).toFixed(2)),
                order_total:(order.grand_total).toString(),
                provider_amount:order.provider_amount,
            } 
             
         }
         
         
         
           if(order.category_id==2){
                
                
                if(tip){
                    
                      order.grand_total =  parseFloat(order.grand_total)-parseFloat(order.tip);
                      order.save();
                
                        order.tip         = parseFloat(tip);
                        order.grand_total =   parseFloat(order.grand_total)+parseFloat(tip);
                        order.save();
                       // order.provider_amount = parseFloat(provider_amount);
                       
                }
                
                if(order.provider_amount==0){
                     order.provider_amount = parseFloat(provider_amount);
                     order.save();
                }
             
                
                
                var couponType ="";
                if(order.coupon_type==1){
                couponType = "Flat";
                }
                
                if(order.coupon_type==2){
                couponType = "Percentage";
                }
              
              
               
                //  return res.json(order.driveway_amount);
               var  orderdata ={
                 order_id:order.order_id,
                 category_id:(order.category_id) ? order.category_id:0,
                 service_for:(order.service_for) ? order.service_for:'',
                 subcategory_id:(order.subcategory_id) ? order.subcategory_id:0,
                 subcategory_name:(order.subcategory !=null) ? order.subcategory.name:'',
                 subcategory_amount:order.subcategory_amount,
                 driveway:(order.driveway_amount) ? order.driveway_amount:0,
                 sidewalk:(order.sidewalk_amount) ? order.sidewalk_amount:0,
                 walkway:(order.walkway_amount)  ? order.walkway_amount:0,
                 color_name:(order.color_id) ? order.color.name:'', 
                 car_number:(order.car_number) ? order.car_number:'',
                 address:order.property.address,
                 date:moment(order.date).format('MM-DD-YYYY'),
                 admin_fee:order.admin_fee,
                 discount_amount:order.discount_amount,
                 coupon_code:order.coupon_code,
                 discounted_type:couponType,//(order.coupon_type==1 && order.coupon_type !=0) ? "Flat":"Percentage",
                 coupon_discounted:order.discount_value,
                 sub_total:(order.total_amount).toString(),
                 tax:order.tax,
                //  tip:order.tip,
                 tip:parseFloat((order.tip).toFixed(2)),
                 order_total:(order.grand_total).toString(),
                 provider_amount:order.provider_amount,
            } 
             
         }
         
         
        
        return res.json({status:true,data:{order_summary:orderdata},message:'order summary.'})
    }catch(err){
          console.log(err)
    //   return res.json(err)
       return res.json({status:false,message:'Something is wrong.'}); 
    }
});





// apply for coupon

router.post('/apply-coupon',accessToken,async(req,res) =>{
    
   const {order_id,coupon_code } = req.body;
    
   try{
       
        const user = await User.findOne({where:{id:req.user.user_id,is_deleted:0,status:1}})
        if(!user) return res.json({status:false,message:'User not found'})
        if(user.is_blocked==1) return res.json({status:false,message:'User is blocked.'});
        
        
        var admin_commission   = await Setting.findOne({where:{field_key:'admin_commission'}});  
            
        var order = await Order.findOne({
            where:{order_id}
        });
        
        if(!order) return res.json({status:false,message:'Order not found.'});
        if(order.coupon_id) return res.json({status:false,message:'Coupon already applied.'});
        
        
        var todayDate = moment().format('YYYY-MM-DD');           
       
        
        
         var getcoupon = await  Coupon.findOne({
                                                where:{
                                                    name:coupon_code,
                                                    expiry_date:{
                                                    [Op.gte]:Date.parse(todayDate)
                                                    },
                                                    is_deleted:0
                                                
                                                }
        
        });
        
        
        
        if(!getcoupon) return res.json({status:false,message:'Invalid coupon code.'});
        
        if(getcoupon.service !=3){
            
            if(getcoupon.service != order.category_id) return res.json({status:false,message:'Invalid coupon code.'});
        }
        
               
                       
        // flat =1
        if(getcoupon.type==1){
            
            var camount = parseFloat(order.total_amount) - parseFloat(getcoupon.discount);
            var discount_amount = parseFloat(getcoupon.discount);
        }
                        
        // percentage =2
        if(getcoupon.type==2){
             var discountAmount = parseFloat(getcoupon.discount)/ 100*parseFloat(order.total_amount);
             
            var camount = parseFloat(order.total_amount) - discountAmount;
            var discount_amount = discountAmount;
        }
                        
         
         


     
        //  var finalamount = (parseFloat(order.grand_total) - parseFloat(order.tax));
      
         
         

        if(order.category_id==1){
          
         var tax_rate_lawn    = await Setting.findOne({where:{field_key:'tax_rate_lawn'}})
         var taxFeeAmount   =  parseFloat(tax_rate_lawn.field_value)/100 * parseFloat(camount);
          
        }else{

          var tax_rate_snow    = await Setting.findOne({where:{field_key:'tax_rate_snow'}});
          var taxFeeAmount   =  parseFloat(tax_rate_snow.field_value)/100 * parseFloat(camount);  
          
        }
                   
        order.coupon_id       = getcoupon.id;
        order.coupon_code     = getcoupon.name;
        order.coupon_type     = getcoupon.type;
        order.discount_value  = getcoupon.discount;
        order.discount_amount = discount_amount;
        order.tax             = taxFeeAmount;
        
        
         var total_amountt    = parseFloat(order.total_amount) - parseFloat(discount_amount);
         
         var gfinalamount =   parseFloat(total_amountt)- parseFloat(order.admin_fee)
     
         var totalAdminCommision =    parseFloat(admin_commission.field_value)/100*parseFloat(gfinalamount);
     
         var provider_amount     = parseFloat(gfinalamount) - parseFloat(totalAdminCommision);
         
        // var newSubgtotal = [parseFloat(camount),parseFloat(taxFeeAmount)].reduce((a, b) => a + b, 0); 
        var newgtotal = [parseFloat(camount),parseFloat(taxFeeAmount),parseFloat(order.tip)].reduce((a, b) => a + b, 0); 
        order.total_amount    = total_amountt;// parseFloat(order.total_amount) - parseFloat(discount_amount);
        order.grand_total     = newgtotal;
        order.provider_amount = provider_amount;
        order.save();
                        
                 
        return res.json({status:true,data:{discount_type:(getcoupon.type==1) ? "Flat":"Percentage",discount_value:getcoupon.discount},message:'Coupon applied successfully.'});
        
        
   }catch(err){
       console.log(err)
     return res.json({status:false,message:'something is wrong.'});  
   } 
});
   //transaction

router.post('/transaction',accessToken,async(req,res) =>{
    
     const {order_id} = req.body;
     
     if(!order_id) return res.json({status:false,message:'Order id is required.'});
     
    try{
        
        //  const user = await User.findOne({where:{id:req.user.user_id,is_deleted:0}});
        //  if(!user) return res.json({status:false,message:"user not found."});
        
        
        const user = await User.findOne({where:{id:req.user.user_id,is_deleted:0,status:1}})
        if(!user) return res.json({status:false,message:'User not found'})
        
        if(user.is_blocked==1) return res.json({status:false,message:'User is blocked.'});
         
         var check_transaction = await Transaction.findOne({where:{order_id,payment_status:2}});
         if(check_transaction) return res.json({status:false,message:'Payment has already done.'});
         
         
         
        var order = await Order.findOne({where:{order_id}});
        if(!order) return res.json({status:false,message:'order id not found.'});
        order.payment_status =1;
        order.save();
        
        var transaction = await Transaction.create({
            user_id:user.id,
            provider_id:0,
            order_id:order_id,
            category_id:order.category_id,
            amount:order.grand_total,
            payment_status:1
        });
        
        return res.json({status:true,data:{transaction_table_id:transaction.id},message:'Transaction inserted successfully.'});
    }catch(err){
        return res.json({status:false,message:err});
    }
});


// get appointments


router.post('/appointments',accessToken,async(req,res) =>{
      try{
    //   return res.json("okkk")
          const user = await User.findOne({where:{id:req.user.user_id,role:1,status:1,is_deleted:0}});
          
          if(!user) return res.json({status:false,message:"User not found."});
          if(user.is_blocked==1) return res.json({status:false,message:'User is blocked.'});
        
          var yesterday_date = moment().subtract(1, "days").format('YYYY-MM-DD');
   
//         var current_appointments = await Order.findAll({
//               where:{
//                   status:{
//                       [Op.not]:[3,4]
//                   },
//                 //   status:{
//                 //       [Op.not]:4
//                 //   },
//                  date:{
//                      [Op.gt]:yesterday_date
                     
//                  },
//                   user_id:user.id
                  
//               },
//               include:[
//                      {model:User,as:'provider'},
//                      {model:Lawn_height,as:'lawn_height'},
//                      {model:Property,as:'property'},
//                      {
//                          model:Order_sidewalk,
//                          as:'order_sidewalks',
//                          include:[
//                                   {model:Sidewalk,as:'sidewalk'}
//                                  ]
                         
//                      },
//                      {
//                          model:Order_walkway,
//                          as:'order_walkways',
//                          include:[
//                                   {model:Walkway,as:'walkway'}
//                                  ]
                         
//                      },
//                      {model:Lawn_size, as:'lawn_size'},
//                      {model:Fence,as:'fence'},
//                      {model:Cleanup,as:'cleanup'},
//                      {model:Subcategory,as:'subcategory'},
//                      {model:Color,as:'color'}
//               ],
//               order:[['id','desc']],
              
//           });
          

          
// //   return res.json(current_appointments)
        
          
//           var current_capsule = [];
//           var current_capsule1 =[];
//           for(var i=0; i<current_appointments.length; i++){
              
              
//               var sidewalk_names = [];
                             
//                  if(current_appointments[i].order_sidewalks){
//                  for(var j = 0; j < current_appointments[i].order_sidewalks.length; j++){
//                       sidewalk_names.push({sidewalk:(current_appointments[i].order_sidewalks)[j].sidewalk.name});
//                  }
//                  }
                 
//                  var walkway_names = [];
//                  if(current_appointments[i].order_walkways){
//                      for(var j = 0; j < current_appointments[i].order_walkways.length; j++){
//                          walkway_names.push({walkway:(current_appointments[i].order_walkways)[j].walkway.name});
//                      }
//                  }
                             
                
//               if(current_appointments[i].status==1){
//                   var status = "Pending";
//               }
//               if(current_appointments[i].status==2){
//                   var status = "Ongoing";
//               }
              
//               if(current_appointments[i].status==3){
//                   var status = "Completed";
//               }
//         //   current_capsule1.push(current_appointments[i].order_sidewalks.id)
              
//               var cbefore_order_image = await Order_image.findAll({where:{order_id:current_appointments[i].order_id,type:'before',is_deleted:0}});
//               var cafter_order_image = await Order_image.findAll({where:{order_id:current_appointments[i].order_id,type:'after',is_deleted:0}});
          
          
//             // var sidewalk_names = [];
//             //  for(var j = 0; j < current_appointments[i].order_sidewalks.length; j++){
//             //      sidewalk_names.push((current_appointments[i].order_sidewalks)[j].sidewalk);
//             //  }
//         //   return res.json(current_appointments)
//               current_capsule.push({
//                   order_id:current_appointments[i].order_id,
                  
//                   service_for:current_appointments[i].service_for,
//                   car_color:(current_appointments[i].color) ? current_appointments[i].color.name:'',
//                   car_number:current_appointments[i].car_number,
                  
//                   Service:(current_appointments[i].category_id==1) ? "Lawn Mowing":"Snow Removal",
                  
//                   address:(current_appointments[i].property) ? current_appointments[i].property.address:'',
//                   lat:(current_appointments[i].property) ? current_appointments[i].property.lat:'',
//                   lng:(current_appointments[i].property) ? current_appointments[i].property.lng:'',
                  
//                   date: moment(current_appointments[i].date).format('MM-DD-YYYY'),
                  
//                   property_image:(current_appointments[i].property)?current_appointments[i].property.image:"NA",
                  
//                   service_provider_status:current_appointments[i].assigned_to !=0 ? "Assigned":"Not assigned",
                  
//                   provider_id:(current_appointments[i].provider ) ? current_appointments[i].provider.id:0,
//                   provider_image:(current_appointments[i].provider ) ? current_appointments[i].provider.image:"",
//                   firstname:(current_appointments[i].provider) ? current_appointments[i].provider.fristname+' '+current_appointments[i].provider.lastname:"",
                  
//                   lawn_size:(current_appointments[i].lawn_size) ? current_appointments[i].lawn_size.name:"",
                  
//                   lawn_height:(current_appointments[i].lawn_height)? current_appointments[i].lawn_height.name:"",
                  
//                   fence:(current_appointments[i].fence)? current_appointments[i].fence.name:"",
//                   cleanup:(current_appointments[i].cleanup)? current_appointments[i].cleanup.name:"",
               
//                 //   sidewalk:(current_appointments[i].order_sidewalks)? current_appointments[i].order_sidewalks:"",
//                   sidewalk:sidewalk_names,
//                   total_sidewalk:(current_appointments[i].order_sidewalks)? (current_appointments[i].order_sidewalks).length:0,
//                   sidewalk_price:current_appointments[i].sidewalk_amount,
                  
//                   driveway:current_appointments[i].driveway,
//                   walkway:walkway_names,
//                 //   walkway:(current_appointments[i].order_walkways)? current_appointments[i].order_walkways:"",
//                   total_walkway:(current_appointments[i].order_walkways)? (current_appointments[i].order_walkways).length:0,
//                   walkway_price:current_appointments[i].walkway_amount,
                  
                  
//                   service_type:current_appointments[i].on_demand,
                  
//                   corner_lot_amount:current_appointments[i].corner_lot_amount,
//                   corner_lot_status:(current_appointments[i].corner_lot_id!=null && current_appointments[i].corner_lot_id>0) ? 1:0,
                  
//                   gate_code:current_appointments[i].gate_code,
                  
//                   instructions:current_appointments[i].instructions,
                  
//                   on_the_way:current_appointments[i].on_the_way,
//                   at_location:current_appointments[i].at_location,
//                   started_job:current_appointments[i].started_job,
//                   finished_job:current_appointments[i].finished_job,
//                   car_option_service:(current_appointments[i].subcategory) ? current_appointments[i].subcategory.name:'',
//                   img1:current_appointments[i].img1,
//                   img2:current_appointments[i].img2,
//                   img3:current_appointments[i].img3,
//                   img4:current_appointments[i].img4,
                  
//                   before_image:(cbefore_order_image.length !=0) ? cbefore_order_image:[],
                  
//                   after_image:(cafter_order_image.length!=0)    ? cafter_order_image:[],
                  
//                   total:current_appointments[i].grand_total,
                  
//                   status,
                  
//               })
//           }
          
            
        //   pending
        
          var pending_appointments = await Order.findAll({
              where:{
                  status:1,
                  user_id:user.id,
                  payment_status:2
                  
              },
              include:[
                     {model:User,as:'provider'},
                     {model:Lawn_height,as:'lawn_height'},
                     {model:Property,as:'property'},
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
                     {model:Lawn_size, as:'lawn_size'},
                     {model:Fence,as:'fence'},
                     {model:Cleanup,as:'cleanup'},
                     {model:Subcategory,as:'subcategory'},
                     {model:Color,as:'color'}
              ],
              order:[['id','desc']],
              
          });
          
        
         
      
        
            
          var pending_capsule = [];
          var pending_capsule1 =[];
          //return res.json(pending_appointments)
          
          for(var i=0; i<pending_appointments.length; i++){
              
              
               var psidewalk_names = [];
                             
                 if(pending_appointments[i].order_sidewalks.length > 0 ){
                 for(var j = 0; j < pending_appointments[i].order_sidewalks.length; j++){
                     if((pending_appointments[i].order_sidewalks)[j].sidewalk){
                      psidewalk_names.push({sidewalk:(pending_appointments[i].order_sidewalks)[j].sidewalk.name});
                     }
                 }
                 }
                 
                  var pwalkway_names = [];
                 if(pending_appointments[i].order_walkways.length > 0 ){
                     for(var j = 0; j < pending_appointments[i].order_walkways.length; j++){
                         if((pending_appointments[i].order_walkways)[j].walkway){
                           pwalkway_names.push({walkway:(pending_appointments[i].order_walkways)[j].walkway.name});
                         }
                     }
                 }
                             
                
              if(pending_appointments[i].status==1){
                  var status = "Pending";
              }
              if(pending_appointments[i].status==2){
                  var status = "Ongoing";
              }
              
              if(pending_appointments[i].status==3){
                  var status = "Completed";
              }
        
              
              var pbefore_order_image = await Order_image.findAll({where:{order_id:pending_appointments[i].order_id,type:'before',is_deleted:0}});
              var pafter_order_image = await Order_image.findAll({where:{order_id:pending_appointments[i].order_id,type:'after',is_deleted:0}});
          
         
              pending_capsule.push({
                  order_id:pending_appointments[i].order_id,
                  
                  service_for:pending_appointments[i].service_for,
                  car_color:(pending_appointments[i].color) ? pending_appointments[i].color.name:'',
                  car_number:pending_appointments[i].car_number,
                  
                  Service:(pending_appointments[i].category_id==1) ? "Lawn Mowing":"Snow Removal",
                  
                  address:(pending_appointments[i].property) ? pending_appointments[i].property.address:'',
                  lat:(pending_appointments[i].property) ? pending_appointments[i].property.lat:'',
                  lng:(pending_appointments[i].property) ? pending_appointments[i].property.lng:'',
                  
                  date: moment(pending_appointments[i].date).format('MM-DD-YYYY'),
                  
                  property_image:(pending_appointments[i].property)?pending_appointments[i].property.image:"NA",
                  
                  service_provider_status:pending_appointments[i].assigned_to !=0 ? "Assigned":"Not assigned",
                  
                  provider_id:(pending_appointments[i].provider ) ? pending_appointments[i].provider.id:0,
                  provider_image:(pending_appointments[i].provider ) ? pending_appointments[i].provider.image:"",
                  firstname:(pending_appointments[i].provider) ? pending_appointments[i].provider.fristname+' '+pending_appointments[i].provider.lastname:"",
                  
                  lawn_size:(pending_appointments[i].lawn_size) ? pending_appointments[i].lawn_size.name:"",
                  
                  lawn_height:(pending_appointments[i].lawn_height)? pending_appointments[i].lawn_height.name:"",
                  
                  fence:(pending_appointments[i].fence)? pending_appointments[i].fence.name:"",
                  cleanup:(pending_appointments[i].cleanup)? pending_appointments[i].cleanup.name:"",
               
                //   sidewalk:(current_appointments[i].order_sidewalks)? current_appointments[i].order_sidewalks:"",
                  sidewalk:psidewalk_names,
                  total_sidewalk:(pending_appointments[i].order_sidewalks)? (pending_appointments[i].order_sidewalks).length:0,
                  sidewalk_price:pending_appointments[i].sidewalk_amount,
                  
                  driveway:pending_appointments[i].driveway,
                  walkway:pwalkway_names,
                //   walkway:(current_appointments[i].order_walkways)? current_appointments[i].order_walkways:"",
                  total_walkway:(pending_appointments[i].order_walkways)? (pending_appointments[i].order_walkways).length:0,
                  walkway_price:pending_appointments[i].walkway_amount,
                  
                  
                  service_type:pending_appointments[i].on_demand,
                  
                  corner_lot_amount:pending_appointments[i].corner_lot_amount,
                  corner_lot_status:(pending_appointments[i].corner_lot_id!=null && pending_appointments[i].corner_lot_id>0) ? 1:0,
                  
                  gate_code:pending_appointments[i].gate_code,
                  
                  instructions:pending_appointments[i].instructions,
                  
                  on_the_way:pending_appointments[i].on_the_way,
                  at_location:pending_appointments[i].at_location,
                  started_job:pending_appointments[i].started_job,
                  finished_job:pending_appointments[i].finished_job,
                  car_option_service:(pending_appointments[i].subcategory) ? pending_appointments[i].subcategory.name:'',
                  img1:pending_appointments[i].img1,
                  img2:pending_appointments[i].img2,
                  img3:pending_appointments[i].img3,
                  img4:pending_appointments[i].img4,
                  
                  before_image:(pbefore_order_image.length !=0) ? pbefore_order_image:[],
                  
                  after_image:(pafter_order_image.length!=0)    ? pafter_order_image:[],
                  
                  total:pending_appointments[i].grand_total,
                  
                  status,
                  
              })
          }
          
          
          
         // return res.json(pending_appointments)
          
          
          
        //   ongoing
        
         
          var accept_appointments = await Order.findAll({
              where:{
                  status:2,
                  user_id:user.id,
                  payment_status:2
                  
              },
              include:[
                     {model:User,as:'provider'},
                     {model:Lawn_height,as:'lawn_height'},
                     {model:Property,as:'property'},
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
                     {model:Lawn_size, as:'lawn_size'},
                     {model:Fence,as:'fence'},
                     {model:Cleanup,as:'cleanup'},
                     {model:Subcategory,as:'subcategory'},
                     {model:Color,as:'color'}
              ],
              order:[['id','desc']],
              
          });
          

         
      //return res.json(accept_appointments)
        
        
          var accept_capsule = [];
          var accept_capsule1 =[];
          
          
        
          for(var i=0; i<accept_appointments.length; i++){
              
              
              var asidewalk_names = [];
                             
                 if(accept_appointments[i].order_sidewalks){
                 for(var j = 0; j < accept_appointments[i].order_sidewalks.length; j++){
                     if((accept_appointments[i].order_sidewalks)[j].sidewalk){
                      asidewalk_names.push({sidewalk:(accept_appointments[i].order_sidewalks)[j].sidewalk.name});
                     }
                 }
                 }
                 
                 var awalkway_names = [];
                 if(accept_appointments[i].order_walkways){
                     for(var j = 0; j < accept_appointments[i].order_walkways.length; j++){
                         if((accept_appointments[i].order_walkways)[j].walkway){
                          awalkway_names.push({walkway:(accept_appointments[i].order_walkways)[j].walkway.name});
                         }
                     }
                 }
                              
               
              if(accept_appointments[i].status==1){
                  var status = "Pending";
              }
              if(accept_appointments[i].status==2){
                  var status = "Ongoing";
              }
              
              if(accept_appointments[i].status==3){
                  var status = "Completed";
              }
 
          
              var abefore_order_image = await Order_image.findAll({where:{order_id:accept_appointments[i].order_id,type:'before',is_deleted:0}});
              var aafter_order_image = await Order_image.findAll({where:{order_id:accept_appointments[i].order_id,type:'after',is_deleted:0}});
   
              accept_capsule.push({
                  order_id:accept_appointments[i].order_id,
                  
                  service_for:accept_appointments[i].service_for,
                  car_color:(accept_appointments[i].color) ? accept_appointments[i].color.name:'',
                  car_number:accept_appointments[i].car_number,
                  
                  Service:(accept_appointments[i].category_id==1) ? "Lawn Mowing":"Snow Removal",
                  
                  address:(accept_appointments[i].property) ? accept_appointments[i].property.address:'',
                  lat:(accept_appointments[i].property) ? accept_appointments[i].property.lat:'',
                  lng:(accept_appointments[i].property) ? accept_appointments[i].property.lng:'',
                  
                  date: moment(accept_appointments[i].date).format('MM-DD-YYYY'),
                  
                  property_image:(accept_appointments[i].property)?accept_appointments[i].property.image:"NA",
                  
                  service_provider_status:accept_appointments[i].assigned_to !=0 ? "Assigned":"Not assigned",
                  
                  provider_id:(accept_appointments[i].provider ) ? accept_appointments[i].provider.id:0,
                  provider_image:(accept_appointments[i].provider ) ? accept_appointments[i].provider.image:"",
                  firstname:(accept_appointments[i].provider) ? accept_appointments[i].provider.fristname+' '+accept_appointments[i].provider.lastname:"",
                  
                  lawn_size:(accept_appointments[i].lawn_size) ? accept_appointments[i].lawn_size.name:"",
                  
                  lawn_height:(accept_appointments[i].lawn_height)? accept_appointments[i].lawn_height.name:"",
                  
                  fence:(accept_appointments[i].fence)? accept_appointments[i].fence.name:"",
                  cleanup:(accept_appointments[i].cleanup)? accept_appointments[i].cleanup.name:"",
               
                //   sidewalk:(current_appointments[i].order_sidewalks)? current_appointments[i].order_sidewalks:"",
                  sidewalk:asidewalk_names,
                  total_sidewalk:(accept_appointments[i].order_sidewalks)? (accept_appointments[i].order_sidewalks).length:0,
                  sidewalk_price:accept_appointments[i].sidewalk_amount,
                  
                  driveway:accept_appointments[i].driveway,
                  walkway:awalkway_names,
                //   walkway:(current_appointments[i].order_walkways)? current_appointments[i].order_walkways:"",
                  total_walkway:(accept_appointments[i].order_walkways)? (accept_appointments[i].order_walkways).length:0,
                  walkway_price:accept_appointments[i].walkway_amount,
                  
                  
                  service_type:accept_appointments[i].on_demand,
                  
                  corner_lot_amount:accept_appointments[i].corner_lot_amount,
                  corner_lot_status:(accept_appointments[i].corner_lot_id!=null && accept_appointments[i].corner_lot_id>0) ? 1:0,
                  
                  gate_code:accept_appointments[i].gate_code,
                  
                  instructions:accept_appointments[i].instructions,
                  
                  on_the_way:accept_appointments[i].on_the_way,
                  at_location:accept_appointments[i].at_location,
                  started_job:accept_appointments[i].started_job,
                  finished_job:accept_appointments[i].finished_job,
                  car_option_service:(accept_appointments[i].subcategory) ? accept_appointments[i].subcategory.name:'',
                  img1:accept_appointments[i].img1,
                  img2:accept_appointments[i].img2,
                  img3:accept_appointments[i].img3,
                  img4:accept_appointments[i].img4,
                  
                  before_image:(abefore_order_image.length !=0) ? abefore_order_image:[],
                  
                  after_image:(aafter_order_image.length!=0)    ? aafter_order_image:[],
                  
                  total:accept_appointments[i].grand_total,
                  
                  status,
                  
              })
          }
          
         
          
          
          
         
         
          var oneday_ago_date = moment().add(1, "days").format('YYYY-MM-DD');
            // return res.json(oneday_ago_date)
          var past_appointments = await Order.findAll({
              where:{
              user_id:user.id, 
              date:{[Op.lt]:oneday_ago_date},
              status:3,
              payment_status:2
              },
              include:[
                     {model:User,as:'provider'},
                     {model:Lawn_height,as:'lawn_height'},
                     {model:Property,as:'property'},
                     {model:Lawn_size, as:'lawn_size'},
                     {model:Report, as:'report_table'},
                    //  {model:Order_sidewalk,as:'order_sidewalks'},
                    //  {model:Order_walkway,as:'order_walkways'},
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
                     
                     {model:Fence,as:'fence'},
                     {model:Cleanup,as:'cleanup'},
                     {model:Subcategory,as:'subcategory'},
                     {model:Color,as:'color'},
                     
              ],
              order:[['id','desc']],
          });
              
    //   return res.json(past_appointments)
       
     
     
          var past_capsule = [];
          
          for(var i=0; i<past_appointments.length; i++){
              
               
              if(past_appointments[i].status==1){
                  var status = "Pending";
              }
              if(past_appointments[i].status==2){
                  var status = "Ongoing";
              }
              
              if(past_appointments[i].status==3){
                  var status = "Completed";
              }
              
              
              
               var psidewalk_names = [];
                             
                 if(past_appointments[i].order_sidewalks){
                 for(var j = 0; j < past_appointments[i].order_sidewalks.length; j++){
                     if((past_appointments[i].order_sidewalks)[j].sidewalk){
                      psidewalk_names.push({sidewalk:(past_appointments[i].order_sidewalks)[j].sidewalk.name});
                     }
                 }
                 }
                 
                 var pwalkway_names = [];
                 if(past_appointments[i].order_walkways){
                     for(var j = 0; j < past_appointments[i].order_walkways.length; j++){
                         if((past_appointments[i].order_walkways)[j].walkway){
                         pwalkway_names.push({walkway:(past_appointments[i].order_walkways)[j].walkway.name});
                         }
                         
                     }
                 }
                      
                      
                      
              
              var pbefore_order_image = await Order_image.findAll({where:{order_id:past_appointments[i].order_id,type:'before',is_deleted:0}});
              var pafter_order_image = await Order_image.findAll({where:{order_id:past_appointments[i].order_id,type:'after',is_deleted:0}});
              
              
              var chack_rating= await Review.findOne({where:{order_id:past_appointments[i].order_id,is_deleted:0}})
             
            //   return res.json(chack_rating)
          
              past_capsule.push({
                  order_id:past_appointments[i].order_id,
                  
                  service_for:past_appointments[i].service_for,
                  car_color:(past_appointments[i].color) ? past_appointments[i].color.name:'',
                  car_number:past_appointments[i].car_number,
                  
                  Service:(past_appointments[i].category_id==1) ? "Lawn Mowing":"Snow Removal",
                  date:moment(past_appointments[i].date).format('MM-DD-YYYY'),
                //   total:past_appointments[i].total_amount,
                 
                  report_to_admin:(past_appointments[i].report_table!=null) ? 1:0,//provider report 
                  
                  address:(past_appointments[i].property) ? past_appointments[i].property.address:'',
                  lat:(past_appointments[i].property) ? past_appointments[i].property.lat:'',
                  lng:(past_appointments[i].property) ? past_appointments[i].property.lng:'',
                  
                  
                  
                  property_image:(past_appointments[i].property)?past_appointments[i].property.image:"NA",
                  
                  service_provider_status:past_appointments[i].assigned_to !=0 ? "Assigned":"Not assigned",
                 
                  provider_id:(past_appointments[i].provider)? past_appointments[i].provider.id:0,
                  provider_image:(past_appointments[i].provider) ? past_appointments[i].provider.image:'',
                  firstname:(past_appointments[i].provider) ? past_appointments[i].provider.fristname+' '+past_appointments[i].provider.lastname:'',
                  
                  lawn_size:(past_appointments[i].lawn_size) ? past_appointments[i].lawn_size.name:"",
                  lawn_height:(past_appointments[i].lawn_height)? past_appointments[i].lawn_height.name:"",
                  fence:(past_appointments[i].fence)? past_appointments[i].fence.name:"",
                  cleanup:(past_appointments[i].cleanup)? past_appointments[i].cleanup.name:"",
                  driveway:past_appointments[i].driveway,
                  sidewalk:psidewalk_names,
                //   sidewalk:(past_appointments[i].order_sidewalks)? past_appointments[i].order_sidewalks:"",
                  total_sidewalk:(past_appointments[i].order_sidewalks)? (past_appointments[i].order_sidewalks).length:0,
                  sidewalk_price:past_appointments[i].sidewalk_amount,
                  instructions:past_appointments[i].instructions,
                  walkway:pwalkway_names,
                //   walkway:(past_appointments[i].order_walkways)? past_appointments[i].order_walkways:"",
                  total_walkway:(past_appointments[i].order_walkways)? (past_appointments[i].order_walkways).length:0,
                  walkway_price:past_appointments[i].walkway_amount,
                  
                  on_demand:past_appointments[i].on_demand,
                  gate_code:past_appointments[i].gate_code,
                  
                  corner_lot_amount:past_appointments[i].corner_lot_amount,
                  corner_lot_status:(past_appointments[i].corner_lot_id!=null && past_appointments[i].corner_lot_id > 0) ? 1:0,
                  
                  rating_count:(chack_rating) ?chack_rating.rating:0,
                  rating_desc:(chack_rating) ?chack_rating.comment:'',
                  
                  on_the_way:past_appointments[i].on_the_way,
                  at_location:past_appointments[i].at_location,
                  started_job:past_appointments[i].started_job,
                  finished_job:past_appointments[i].finished_job,
                  
                  
                  car_option_service:(past_appointments[i].subcategory) ? past_appointments[i].subcategory.name:'',
                  
                  img1:(past_appointments[i].img1 !=0) ? past_appointments[i].img1:"",
                  img2:(past_appointments[i].img2 !=0) ? past_appointments[i].img2:"",
                  img3:(past_appointments[i].img3 !=0) ? past_appointments[i].img3:"",
                  img4:(past_appointments[i].img4 !=0) ? past_appointments[i].img4:"",
                  
                  before_image:(pbefore_order_image.length !=0) ? pbefore_order_image:[],
                  after_image:(pafter_order_image.length!=0) ? pafter_order_image:[],
                  total:past_appointments[i].grand_total,
                  status,
                  
                  
                  mark_user_status:past_appointments[i].user_status,
                  rating_status:(chack_rating!=null) ? 1:0,
                  
              })
          }
          
             // return res.json(past_capsule)
          
    
          
          
          
        //   cancel
     
        
        // var oneday_ago_date = moment().add(1, "days").format('YYYY-MM-DD');
            
          var cancel_appointments = await Order.findAll({
              where:{
              user_id:user.id, 
             // date:{[Op.lt]:oneday_ago_date},
              status:4,
              payment_status:2
              },
              include:[
                     {model:User,as:'provider'},
                     {model:Lawn_height,as:'lawn_height'},
                     {model:Property,as:'property'},
                     {model:Lawn_size, as:'lawn_size'},
                    //  {model:Order_sidewalk,as:'order_sidewalks'},
                    //  {model:Order_walkway,as:'order_walkways'},
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
                     
                     {model:Fence,as:'fence'},
                     {model:Cleanup,as:'cleanup'},
                     {model:Subcategory,as:'subcategory'},
                     {model:Color,as:'color'},
                     
              ],
              order:[['id','desc']],
          });
           
          
     // return res.json(cancel_appointments)
          var cancel_capsule = [];
          for(var i=0; i<cancel_appointments.length; i++){
              
               
              if(cancel_appointments[i].status==1){
                  var status = "Pending";
              }
              if(cancel_appointments[i].status==2){
                  var status = "Ongoing";
              }
              
              if(cancel_appointments[i].status==3){
                  var status = "Completed";
              }
          
              
              
               var csidewalk_names = [];
                             
                 if(cancel_appointments[i].order_sidewalks){
                 for(var j = 0; j < cancel_appointments[i].order_sidewalks.length; j++){
                     if((cancel_appointments[i].order_sidewalks)[j].sidewalk){
                     csidewalk_names.push({sidewalk:(cancel_appointments[i].order_sidewalks)[j].sidewalk.name});
                     }
                 }
                 }
                 
                 var cwalkway_names = [];
                 if(cancel_appointments[i].order_walkways){
                     for(var j = 0; j < cancel_appointments[i].order_walkways.length; j++){
                         if((cancel_appointments[i].order_walkways)[j].walkway){
                         cwalkway_names.push({walkway:(cancel_appointments[i].order_walkways)[j].walkway.name});
                         }
                     }
                 }
                      
                      
                      
              
              var cbefore_order_image = await Order_image.findAll({where:{order_id:cancel_appointments[i].order_id,type:'before',is_deleted:0}});
              var cafter_order_image = await Order_image.findAll({where:{order_id:cancel_appointments[i].order_id,type:'after',is_deleted:0}});
              
            //   return res.json(past_appointments)
                  cancel_capsule.push({
                  order_id:cancel_appointments[i].order_id,
                  
                  service_for:cancel_appointments[i].service_for,
                  car_color:(cancel_appointments[i].color) ? cancel_appointments[i].color.name:'',
                  car_number:cancel_appointments[i].car_number,
                  
                  Service:(cancel_appointments[i].category_id==1) ? "Lawn Mowing":"Snow Removal",
                  date:moment(cancel_appointments[i].date).format('MM-DD-YYYY'),
                //   total:cancel_appointments[i].total_amount,
                
                  address:(cancel_appointments[i].property) ? cancel_appointments[i].property.address:'',
                  lat:(cancel_appointments[i].property) ? cancel_appointments[i].property.lat:'',
                  lng:(cancel_appointments[i].property) ? cancel_appointments[i].property.lng:'',
                  
                  service_provider_status:cancel_appointments[i].assigned_to !=0 ? "Assigned":"Not assigned",
                  
                  property_image:(cancel_appointments[i].property)?cancel_appointments[i].property.image:"NA",
                  
                  
                  provider_id:(cancel_appointments[i].provider)? cancel_appointments[i].provider.id:0,
                  provider_image:(cancel_appointments[i].provider) ? cancel_appointments[i].provider.image:'',
                  firstname:(cancel_appointments[i].provider) ? cancel_appointments[i].provider.fristname+' '+cancel_appointments[i].provider.lastname:'',
                  
                  lawn_size:(cancel_appointments[i].lawn_size) ? cancel_appointments[i].lawn_size.name:"",
                  lawn_height:(cancel_appointments[i].lawn_height)? cancel_appointments[i].lawn_height.name:"",
                  fence:(cancel_appointments[i].fence)? cancel_appointments[i].fence.name:"",
                  cleanup:(cancel_appointments[i].cleanup)? cancel_appointments[i].cleanup.name:"",
                  driveway:cancel_appointments[i].driveway,
                  sidewalk:csidewalk_names,
                //   sidewalk:(cancel_appointments[i].order_sidewalks)? cancel_appointments[i].order_sidewalks:"",
                  total_sidewalk:(cancel_appointments[i].order_sidewalks)? (cancel_appointments[i].order_sidewalks).length:0,
                  sidewalk_price:cancel_appointments[i].sidewalk_amount,
                  
                  walkway:cwalkway_names,
                //   walkway:(cancel_appointments[i].order_walkways)? cancel_appointments[i].order_walkways:"",
                  total_walkway:(cancel_appointments[i].order_walkways)? (cancel_appointments[i].order_walkways).length:0,
                  walkway_price:cancel_appointments[i].walkway_amount,
                  
                  on_demand:cancel_appointments[i].on_demand,
                  gate_code:cancel_appointments[i].gate_code,
                  
                  corner_lot_amount:cancel_appointments[i].corner_lot_amount,
                  corner_lot_status:(cancel_appointments[i].corner_lot_id!=null && cancel_appointments[i].corner_lot_id>0) ? 1:0,
                  
                  instructions:cancel_appointments[i].instructions,
                  on_the_way:cancel_appointments[i].on_the_way,
                  at_location:cancel_appointments[i].at_location,
                  started_job:cancel_appointments[i].started_job,
                  finished_job:cancel_appointments[i].finished_job,
                  
                  
                  car_option_service:(cancel_appointments[i].subcategory) ? cancel_appointments[i].subcategory.name:'',
                  
                  img1:(cancel_appointments[i].img1 !=0) ? cancel_appointments[i].img1:"",
                  img2:(cancel_appointments[i].img2 !=0) ? cancel_appointments[i].img2:"",
                  img3:(cancel_appointments[i].img3 !=0) ? cancel_appointments[i].img3:"",
                  img4:(cancel_appointments[i].img4 !=0) ? cancel_appointments[i].img4:"",
                  
                  before_image:(cbefore_order_image.length !=0) ? cbefore_order_image:[],
                  after_image:(cafter_order_image.length!=0) ? cafter_order_image:[],
                  total:cancel_appointments[i].grand_total,
                  status,
                  
              })
          }
          
           
            
     // return res.json(cancel_capsule)
          return res.json({status:true,data:{pending_capsule,ongoing_capsule:accept_capsule,past_capsule,cancel_capsule},message:'Appointments'})
      }catch(err){
         console.log(err)
        // return res.json(err)
          return res.json({status:false,message:'Something is wrong.'});   
      }
});
 
 
//  get profile
router.get('/profile-details',accessToken,async(req,res)=>{
  try{
    const user = await User.findOne({
        where:{id:req.user.user_id,role:1,status:1,is_deleted:0},
        attributes:{exclude:['password','createdAt','updatedAt']}
    })
           if(!user) return res.json({status:false,message:"User not found."});
           if(user.is_blocked==1) return res.json({status:false,message:'User is blocked.'});

    
    return res.json({status:true,data:{user_details:user},message:'service provider profile data'})
   
  }catch(err){
    console.log(err)
    return res.json({status:false,message:"somthing is wrong"})
  }
})





// update profile


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


router.post('/profile-details',upload.single('image'),accessToken,async(req,res)=>{

  const {fname,lname,address,lat,long,oldpassword,newpassword}=req.body
  if(!fname) return res.json({status:false,message:"fname is require"})
  if(!lname) return res.json({status:false,message:"lname is require"})
  if(!address) return res.json({status:false,message:"address is require"})
  if(!lat) return res.json({status:false,message:"lat is require"})
  if(!long) return res.json({status:false,message:"long is require"})

  try{
    const user = await User.findOne({where:{id:req.user.user_id,role:1,status:1,is_deleted:0}})
    
    if(!user) return res.json({status:false,message:"User not found."});
    if(user.is_blocked==1) return res.json({status:false,message:'User is blocked.'});

    // if(oldpassword!="" && newpassword!="")
    // {
    //   const match = await bcrypt.compare(oldpassword,user.password)
    //   if(!match) return res.json({status:false,message:"password is wrong"})
   
    //   const hash = bcrypt.hashSync(newpassword,10)
    //   user.password = hash;
    // } 
    user.fristname = fname;
    user.lastname = lname;
    user.address= address;
    user.lat=lat;
    user.lng =long;
    
    if(req.file){
      user.image="/users/"+req.file.filename;
    }
    user.save();
   
    return res.json({status:true,data:{user_details:user},message:'Profile successfully updated'})
   
  }catch(err){
    console.log(err)
    // return res.json(err)
    return res.json({status:false,message:"somthing is wrong"})
  }
});






// rating post
router.post('/rating',accessToken,async(req,res)=>{
  const {review_to,comment,rating,order_id}= req.body
  
  if(!review_to) return res.json({status:false,message:'review to is required.'});
  if(!comment) return res.json({status:false,message:'comment  is required.'});
  if(!rating) return res.json({status:false,message:'rating  is required.'});
  if(!order_id) return res.json({status:false,message:'order id require'});

  try{

    const user = await User.findOne({where:{id:req.user.user_id,role:1,status:1,is_deleted:0}})
   
    if(!user) return res.json({status:false,message:"User not found."});
    if(user.is_blocked==1) return res.json({status:false,message:'User is blocked.'});
    
    chack_rating= await Review.findOne({where:{order_id,is_deleted:0}})
    if(chack_rating) return res.json({status:false,message:'You have already rated this provider'})
   
    await Review.create({user_id:user.id, provider_id:review_to, review_to, comment, rating ,order_id })
     
    return res.json({status:true,data:{},message:"Your review has been submitted"}) 
  }catch(err){
    // console.log(err)
    // return res.json(err)
    return res.json({status:false,message:"somthing wrong"})
  }
})


// // get rating
// router.post('/get-rating',accessToken,async(req,res)=>{
//   try{
//     const user = await User.findOne({where:{id:req.user.user_id,is_deleted:0}})
//     if(!user) return res.json({status:false,message:"user not found"})

//     const review = await Review.findAll({
//         where:{is_deleted:0},
//         include:[
//                  {model:User,as:'user'}
//                 ]
//     })
//     return res.json({status:true,data:{review},message:"data show"}) 
//   }catch(err){
//     console.log(err)
//     return res.json({status:false,message:"somthing wrong"})
//   }
// })


router.post('/get-recurring',accessToken,async(req,res)=>{
  try{
    const user = await User.findOne({where:{id:req.user.user_id,role:1,status:1,is_deleted:0}})
    
    if(!user) return res.json({status:false,message:"User not found."});
    if(user.is_blocked==1) return res.json({status:false,message:'User is blocked.'});
//show lawn size, corner lot, fence
    const recurringRaw = await Recurring_history.findAll({
                                                    where:{is_deleted:0,
                                                          user_id:req.user.user_id,
                                                           status:{[Op.not]:'Cancel'}
                                                        //   service_type:2, 
                                                        //   status:2
                                                          },
                                                         include:[
                                                             {model:Property,as:'property'},
                                                             {model:Lawn_size,as:'lawn_size_details'},
                                                             {model:Fence,as:'fence_details'},
                                                             {model:Cleanup,as:'cleanup'},
                                                             {model:Corner_lot,as:'corner_details'},
                                                             {model:Order,as:'order_table'}],
                                                             order:[['id','desc']]
                                                  })
                                                  
                          //  return res.json(recurringRaw)
    var recurring_services =[];    
    
    for(var i =0; i<recurringRaw.length; i++){
        
        recurring_services.push({
            order_id:recurringRaw[i].order_id,
            category:"Lawn Mowing",
            
            property_address:(recurringRaw[i].property !=null) ? recurringRaw[i].property.address:"",
            property_lat:(recurringRaw[i].property !=null) ? recurringRaw[i].property.lat:"",
            property_long:(recurringRaw[i].property !=null) ? recurringRaw[i].property.lng:"",
            property_image:(recurringRaw[i].property !=null) ? recurringRaw[i].property.image:"",
            
            next_service:moment(recurringRaw[i].date).format('MM-DD-YYYY'),
            total_amount:recurringRaw[i].grand_total,
            
            lawn_size_id:recurringRaw[i].lawn_size_id,
            lawn_size_amount:recurringRaw[i].lawn_size_amount,
            lawn_size_name:(recurringRaw[i].lawn_size_details!=null) ? recurringRaw[i].lawn_size_details.name:'',
            
            corner_lot:(recurringRaw[i].corner_lot_id) ? 1:0, 
            corner_lot_id:(recurringRaw[i].corner_lot_id) ? recurringRaw[i].corner_lot_id : '',
            corner_lot_amount:recurringRaw[i].corner_lot_amount,
            
            instuction:(recurringRaw[i].order_table) ? recurringRaw[i].order_table.instructions:'',
            
            fence_id:recurringRaw[i].fence_id,
            fence_amount:recurringRaw[i].fence_amount,
            fence_name:(recurringRaw[i].fence_details) ? recurringRaw[i].fence_details.name : '',
            
            gate_code:(recurringRaw[i].gate_code) ? recurringRaw[i].gate_code: '',
            
            
        })
    }
                                                  
     
    return res.json({status:true,data:{recurring_services},message:"data show"}) 
  }catch(err){
    console.log(err)
    // return res.json(err)
    return res.json({status:false,message:"somthing  is wrong"})
  }
});



router.post('/cancel-recurring',accessToken,async(req,res)=>{
    
 const  {order_id} = req.body;
 if(!order_id) return res.json({status:false,message:"order_id is require"})
  try{
    const user = await User.findOne({where:{id:req.user.user_id,role:1,status:1,is_deleted:0}})
    
    if(!user) return res.json({status:false,message:"User not found."});
    if(user.is_blocked==1) return res.json({status:false,message:'User is blocked.'});

    const order  = await Recurring_history.findOne({where:{order_id:order_id}})
    
    // if(order==null) return res.json({satatus:false,message:"Order Not Exist"})
    
    // return res.json(order)
    order.status ='Cancel';
    order.is_deleted=1;
    order.save();
    return res.json({status:true,message:"Order has been cancelled successfully."}) 
  }catch(err){
    console.log(err)
    return res.json({status:false,message:"somthing is wrong"})
  }
})





// router.post('/add-card',accessToken,async(req,res) =>{
//     const {name_on_card,card_number,expire_date,cvv} = req.body;
    
//     if(!name_on_card) return res.json({status:false,message:'name is required.'});
//     if(!card_number)  return res.json({status:false,message:'card number is required.'});
//     if(!expire_date)  return res.json({status:false,message:'expire date is required.'});
//     if(!cvv)          return res.json({status:false,message:'cvv number is required.'}); 
    
//     try{
//       var user = await User.findOne({where:{id:req.user.user_id,status:1,role:1,is_deleted:0}});
     
//      if(!user) return res.json({status:false,message:"User not found."});
//      if(user.is_blocked==1) return res.json({status:false,message:'User is blocked.'});
      
//       var check_card = await Card.findOne({where:{user_id:user.id,card_number,is_deleted:0}});
//      // return res.json(check_card)
//       if(check_card) return res.json({status:false,message:'Card is already added.'});
      
//       var card  = await Card.create({user_id:user.id,name_on_card,card_number,expire_date,cvv});
//       return res.json({status:true,message:'Card added successfully.'})
//     }catch(err){
//       return res.json({status:false,message:"something is wrong"}) 
//     }
// });




router.post('/add-card',accessToken,async(req,res) =>{
    const {source,name_on_card,card_number,exp_month,exp_year,cvv,action} = req.body;
    
    
     if(!source)  return res.json({status:false,message:'source is required.'});
     if(!exp_year)  return res.json({status:false,message:'expire year is required.'});
     if(!exp_month)  return res.json({status:false,message:'expire month is required.'});
     if(!cvv)          return res.json({status:false,message:'cvv number is required.'}); 
     if(!name_on_card)          return res.json({status:false,message:'name on card is required.'}); 
     if(!card_number)          return res.json({status:false,message:'card number is required.'}); 
    
    try{
      var user = await User.findOne({where:{id:req.user.user_id,status:1,role:1,is_deleted:0}});
    //  return res.json(user)
     
     if(!user) return res.json({status:false,message:"User not found."});
     if(user.is_blocked==1) return res.json({status:false,message:'User is blocked.'});
     
      var checkcard = await Card.findOne({where:{user_id:user.id,card_number,is_deleted:0}});
      if(checkcard) return res.json({status:false,message:"Card already exist."});
    
       var getstripe =  await Admin.findOne();
       var stripe = Stripe(getstripe.stripe_key);
         
         if(user.customer_id==null || user.customer_id==''){
             
             const customer = await stripe.customers.create({
                  source:source,
                  email:user.email
              });
              
           
            user.customer_id = customer.id;
            user.save();
           
             
             
            var card = await stripe.customers.createSource(
               customer.id,
              {source:source}
            );

       
            
             await Card.create({
                    user_id: user.id,
                    customer_id: customer.id,
                    card_id: card.id,
                    object: card.object,
                    brand: card.brand,
                    country: card.country,
                    fingerprint: card.fingerprint,
                    funding: card.funding,
                    last4: card.last4,
                    exp_year:exp_year,
                    exp_month: exp_month,
                    is_primary:1,
                    name_on_card: name_on_card,
                    card_number:card_number,
                    cvv:0
            });
            
           
            
         }else{
             
           var card = await stripe.customers.createSource(
               user.customer_id,
              {source:source}
            );
           
         
            var checkcard =   await Card.findAll({where:{user_id:user.id,is_deleted:0}});
            
            if(checkcard.length == 0 ){
                var is_primary = 1;
            }else{
                var is_primary = 0; 
            }
            
            // var getcard =   await Card.findOne({where:{fingerprint:card.fingerprint,user_id:user.id,is_deleted:0}});
            
            //  var getcard =   await Card.findOne({where:{fingerprint:card.fingerprint,user_id:user.id,is_deleted:0}});
            // // return res.json(getcard)
            
            // if(getcard) return res.json({status:false,message:'card is already exist.'});
            
            
            
            await Card.create({
                    user_id: user.id,
                    customer_id: card.customer,
                    card_id: card.id,
                    object: card.object,
                    brand: card.brand,
                    country: card.country,
                    fingerprint: card.fingerprint,
                    funding: card.funding,
                    last4: card.last4,
                    exp_year:exp_year,
                    exp_month: exp_month,
                    is_primary:is_primary,
                    name_on_card: name_on_card,
                    card_number:card_number,
                    cvv:0
            });
            
            
            
            
         }
          
    
    

 
        


    // return res.json(card)
      
    
      return res.json({status:true,message:'Card added successfully.'})
    }catch(err){
    //  console.log(err)
    //  return res.json(err)
    //   return res.json({status:false,message:"something is wrong"}) 
    
    
       switch (err.type) {
          case 'StripeCardError':
            // A declined card error
            // err.message; // => e.g. "Your card's expiration year is invalid."
              return res.json({status:false,message: err.message})
              break;
              case 'StripeRateLimitError':
                // Too many requests made to the API too quickly
                  return res.json({status:false,message:'Too many requests made to the API too quickly.'})
                break;
              case 'StripeInvalidRequestError':
                // Invalid parameters were supplied to Stripe's API
                 return res.json({status:false,message:'Invalid parameters were supplied to Stripe\'s API.'})
                break;
              case 'StripeAPIError':
                // An error occurred internally with Stripe's API
                 return res.json({status:false,message:'An error occurred internally with Stripe\'s API.'})
                break;
              case 'StripeConnectionError':
                // Some kind of error occurred during the HTTPS communication
                return res.json({status:false,message:'Some kind of error occurred during the HTTPS communication.'})
                break;
              case 'StripeAuthenticationError':
                // You probably used an incorrect API key
                 return res.json({status:false,message:'You probably used an incorrect API key.'})
                break;
              default:
            // Handle any other types of unexpected errors
              return res.json({status:false,message:err})
              break;
        }
        
    }
});





router.post('/get-cards',accessToken,async(req,res) =>{
    
    try{
      var user = await User.findOne({where:{id:req.user.user_id,role:1,status:1,is_deleted:0}});
      
     if(!user) return res.json({status:false,message:"User not found."});
     if(user.is_blocked==1) return res.json({status:false,message:'User is blocked.'})
    //  changed by aman 
     if(user.customer_id=='' || user.customer_id==null) return res.json({status:false,message:'No customer exist in stripe.'});
      
      var cards  = await Card.findAll({
          where:{user_id:user.id,is_deleted:0},
          attributes: {exclude: ['customer_id','object','brand','country','fingerprint','funding','cvv']},
          order:[['id','desc']]
      });
      
      
    //   const cards = await stripe.customers.listSources(
    //           'cus_91fz3aebyTniMk',
    //           {object: 'card', limit: 3}
    //         );


      if(cards){
          return res.json({status:true,data:{cards},message:'Card list.'})
      }else{
          return res.json({status:false,message:'No any card.'})
      }
      
     
    }catch(err){
         return res.json({status:false,message:"something is wrong"}) 
    }
});



router.post('/delete-card',accessToken,async(req,res) =>{
    const {card_id } = req.body;
    if(!card_id) return res.json({status:false,message:'card id is required.'});
     
    try{
     var user = await User.findOne({where:{id:req.user.user_id,role:1,status:1,is_deleted:0}});
     
     if(!user) return res.json({status:false,message:"User not found."});
     if(user.is_blocked==1) return res.json({status:false,message:'User is blocked.'})
     
     if(user.customer_id=='' || user.customer_id==null) return res.json({status:false,message:'No customer exist in stripe.'});
       
       
       var getstripe =  await Admin.findOne();
       var stripe = Stripe(getstripe.stripe_key);
                
       var card  = await Card.findOne({
          where:{card_id,user_id:user.id,is_deleted:0}
      });
      
       const deleted = await stripe.customers.deleteSource(
                  user.customer_id,
                  card.card_id
                );

    
      
      card.is_deleted = 1;
      card.save();
     
      return res.json({status:true,message:'Card  deleted successfully.'})
    }catch(err){
        // return res.json(err)
         console.log(err)
        //  return res.json({status:false,message:err.message}) 
          switch (err.type) {
          case 'StripeCardError':
            // A declined card error
            // err.message; // => e.g. "Your card's expiration year is invalid."
              return res.json({status:false,message: err.message})
              break;
              case 'StripeRateLimitError':
                // Too many requests made to the API too quickly
                  return res.json({status:false,message:'Too many requests made to the API too quickly.'})
                break;
              case 'StripeInvalidRequestError':
                // Invalid parameters were supplied to Stripe's API
                 return res.json({status:false,message:'Invalid parameters were supplied to Stripe\'s API.'})
                break;
              case 'StripeAPIError':
                // An error occurred internally with Stripe's API
                 return res.json({status:false,message:'An error occurred internally with Stripe\'s API.'})
                break;
              case 'StripeConnectionError':
                // Some kind of error occurred during the HTTPS communication
                return res.json({status:false,message:'Some kind of error occurred during the HTTPS communication.'})
                break;
              case 'StripeAuthenticationError':
                // You probably used an incorrect API key
                 return res.json({status:false,message:'You probably used an incorrect API key.'})
                break;
              default:
            // Handle any other types of unexpected errors
              return res.json({status:false,message:err})
              break;
        }
    }
})


//order-cancel
router.post('/order-cancel',accessToken,async(req,res)=>{
    const {order_id}=req.body;
    if(!order_id) return res.json({status:false,message:"order_id is require"})
    try{
   
    const user = await User.findOne({where:{id:req.user.user_id,is_deleted:0,status:1}})
    
     if(!user) return res.json({status:false,message:"User not found."});
     if(user.is_blocked==1) return res.json({status:false,message:'User is blocked.'})
     
    const cancel_order= await Order.findOne({where:{order_id,is_deleted:0}})
   
    var date_and_time=moment().format();
   
    cancel_order.status=4;
    cancel_order.cancel_order_date=date_and_time;
    cancel_order.cancel_by=user.id;
    cancel_order.save();
   
    var provider= await User.findOne({where:{id:cancel_order.assigned_to,is_deleted:0}});
    //  return res.json(provider)
    
    if(provider!=null){
        

        
        //  var payload = {
        //     notification:{
        //     title:'Profile Update',
        //     body:'Your job has been cancelled by user'
        //     },
        //       data:{
        //         order_id:order_id,
        //         title:'Profile Update',
        //         body:'Your job has been cancelled by user',
        //         click_action:'cancelled_by_user'
        //     }
        //     };
            
        // var options = {
        //     priority: "high",
        //     timeToLive: 60 * 60 * 24,
        //     };
             
        //      //return res.json(provider.fcm_token)
        //   // var fcm=provider.fcm_token
          
        //     var test = await adminpush.messaging().sendToDevice(provider.fcm_token,payload,options)
        
         if(provider.fcm_token !=''){
                
            //start notification  
            var message = { 
            to: provider.fcm_token, 
            collapse_key: '',
            
            notification:{
                title:'Profile Update',
                body:'Your job has been cancelled by user'
            },
            
            data:{
                order_id:order_id,
                title:'Profile Update',
                body:'Your job has been cancelled by user',
                click_action:'cancelled_by_user'
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
          return res.json({status:true,message:'Your job is cancelled'})
    }
   
    
     return res.json({status:true,message:"order cancelled"})
    }catch(err){
        // console.log(err)
        // return res.json(err)
        return res.json({status:false,message:"something is wrong"})
    }
})


//add faq 

router.post('/add-faq',accessToken,async(req,res)=>{
    const {title,description}=req.body;
    if(!title) return res.json({status:false,message:"title is require"})
    if(!description) return res.json({status:false,message:"description is require"})
    
    try{

    const user = await User.findOne({where:{id:req.user.user_id,is_deleted:0,status:1}})
   
     if(!user) return res.json({status:false,message:"User not found."});
     if(user.is_blocked==1) return res.json({status:false,message:'User is blocked.'})
    
    const addfaq= await Faq.create({
        title,
        description,
    })
     return res.json({status:true,message:"faq added"})
    }catch(err){
        console.log(err)
        return res.json({status:false,message:"something is wrong"})
    }
})

//get faq 

router.post('/get-faq',accessToken,async(req,res)=>{
    try{

    const user = await User.findOne({where:{id:req.user.user_id,is_deleted:0,status:1}})
    
     if(!user) return res.json({status:false,message:"User not found."});
     if(user.is_blocked==1) return res.json({status:false,message:'User is blocked.'})
    
    const getfaq= await Faq.findAll()
    return res.json({status:true,data:{getfaq:getfaq[0]},message:"faq details"})
    }catch(err){
        console.log(err)
        return res.json({status:false,message:"something is wrong"})
    }
})

//add T&C

// router.post('/add-terms-conditions',accessToken,async(req,res)=>{
//     const {description}=req.body;
   
//     if(!description) return res.json({status:false,message:"description is require"})
    
//     try{

//     const user = await User.findOne({where:{id:req.user.user_id,is_deleted:0,status:1}})
    
//      if(!user) return res.json({status:false,message:"User not found."});
//      if(user.is_blocked==1) return res.json({status:false,message:'User is blocked.'})
    
    
    
//     const addterms= await Term.create({
//       description,
//     })
//      return res.json({status:true,message:"terms-conditions added"})
//     }catch(err){
//         console.log(err)
//         return res.json({status:false,message:"something is wrong"})
//     }
// })

//get T&C

router.post('/get-terms-conditions',async(req,res)=>{
    try{
      
    //  var user = await User.findOne({where:{id:req.user.user_id,is_deleted:0,status:1}})
    //   return res.json("okk") 
    //  if(!user) return res.json({status:false,message:"User not found."});
    
    //  if(user.is_blocked==1) return res.json({status:false,message:'User is blocked.'})
    
    const term= await Term.findOne()
    return res.json({status:true,data:{term},message:"terms-conditions details"})
    }catch(err){
        console.log(err)
        return res.json({status:false,message:"something is wrong"})
    }
})





// payment 

router.post('/payment',accessToken,async(req,res) =>{
    
    const {transaction_table_id,source,currency,description,card_id} = req.body;
    
    if(!transaction_table_id) return res.json({status:false,message:'Transaction table id is required.'});
    // if(!source) return res.json({status:false,message:'Source token is required.'});
    if(!card_id) return res.json({status:false,message:'card id  is required.'});
    if(!currency) return res.json({status:false,message:'Currency  is required.'});
    
      
  try{
       
       
        const user = await User.findOne({where:{id:req.user.user_id,is_deleted:0,status:1}})
        
        if(!user) return res.json({status:false,message:"User not found."});
        if(user.is_blocked==1) return res.json({status:false,message:'User is blocked.'})
        // return res.json(user)
        var getstripe =  await Admin.findOne();
        var stripe = Stripe(getstripe.stripe_key);
        
        var transaction = await Transaction.findOne({where:{id:transaction_table_id,user_id:user.id}});
        if(!transaction) return res.json({status:false,message:'transaction table is invalid.'});
        
        
        if(transaction.payment_status==2) return res.json({status:false,message:'payment has already done.'});
        
        var order = await Order.findOne({where:{order_id:transaction.order_id}});
        
        if(!order) return res.json({status:false,message:'Order id not found.'});
        
      
        
       
        
         if(user.customer_id=="" || user.customer_id==null) return res.json({status:false,message:'Customer id not found.'});
      
        var getcard = await Card.findOne({
                    where:{id:card_id,is_deleted:0}
                    });
                    
        if(!getcard) return res.json({status:false,message:'card  not found.'});
      
        const charge = await stripe.charges.create({
                                  amount: parseFloat((transaction.amount*100).toFixed(2)),
                                  currency:currency,
                                //   source: source,
                                  source:getcard.card_id,
                                  description:'payment from '+user.fristname+" "+user.lastname,
                                  metadata:{user_id:user.id},
                                  customer:user.customer_id,
        });
        
     
        if(charge.status=='succeeded'){
            
            // order.payment_status =2;
            order.save();
           
            // transaction.payment_status =2;
            transaction.save();
       
            transaction.transaction_id  = charge.id;
            transaction.stripe_response = JSON.stringify(charge);
            // transaction.payment_status  = 2;
            transaction.save();
             
           var getrecurring =  await Recurring_history.findOne({where:{order_id:order.order_id}});
           if(getrecurring){
              //  getrecurring.status = 'Active';
               getrecurring.save(); 
           }
           
            
            
        //   return res.json("ok")
            
           
            
            
       // var all_provider= await User.findAll({where:{is_deleted:0,is_blocked:0,status:1,role:2}});
        var radius = await Setting.findOne({
        where: {
            field_key: 'radius'
        }
        });
        
        
        var all_provider = await User.findAll({
            where: {
                is_deleted: 0,
                is_blocked: 0,
                status: 1,
                role: 2
            },
            attributes: ['id','fcm_token','lat','lng',
              [Sequelize.literal("6371 * acos(cos(radians(" + parseFloat(order.lat) + ")) * cos(radians(lat)) * cos(radians(" + parseFloat(order.lng) + ") - radians(lng)) + sin(radians(" + parseFloat(order.lat) + ")) * sin(radians(lat)))"), 'distance']
            ],
            having: Sequelize.literal('distance < ' + parseFloat(radius.field_value)),
            logging: console.log,

        });
            // console.log(all_provider);
            // return res.json(all_provider)
           
            for(var i=0; i<all_provider.length; i++)
            {
                if(all_provider[i].fcm_token!='')
                {
                    
                var provider_category = await Provider_equipment.findAll({where:{is_deleted:0,provider_id:all_provider[i].id}})
                 
                let group = provider_category.reduce((r, a) => {
                r[a.category_id] = [...r[a.category_id] || [], a];
                return r;
                }, {});
                
                
                
                var categories = [];
                Object.keys(group).forEach((k,v) => {
                categories.push(k)
                });

                if(categories.indexOf((order.category_id).toString()) !== -1){
               
                if(all_provider[i].fcm_token !=''){
                
            //start notification  
            var message = { 
            to: all_provider[i].fcm_token, 
            collapse_key: '',
            
            notification:{
                title:'New Job',
                body:'(NEW JOB) available in your Area !'
            },
            
            data:{
                order_id:order.order_id,
                title:'New Job',
                body:'(NEW JOB) available in your Area !',
                click_action:'postjob'
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
                
                }
            }
     
            
            var msg = 'Payment has been successfully.';
            return res.json({status:true,message:msg});
            
        }else{
            transaction.transaction_id  = (charge) ? charge.id:0;
            transaction.stripe_response = JSON.stringify(charge);
            transaction.payment_status  = 3;
            transaction.save();
            var msg = 'Payment failed.';
            return res.json({status:false,message:msg});
        }
        
      
        
         
        
        
        
  }catch(err){
      console.log(err)
    //   return res.json(err)
       switch (err.type) {
          case 'StripeCardError':
            // A declined card error
            // err.message; // => e.g. "Your card's expiration year is invalid."
              return res.json({status:false,message: err.message})
              break;
              case 'StripeRateLimitError':
                // Too many requests made to the API too quickly
                  return res.json({status:false,message:'Too many requests made to the API too quickly.'})
                break;
              case 'StripeInvalidRequestError':
                // Invalid parameters were supplied to Stripe's API
                 return res.json({status:false,message:'Invalid parameters were supplied to Stripe\'s API.'})
                break;
              case 'StripeAPIError':
                // An error occurred internally with Stripe's API
                 return res.json({status:false,message:'An error occurred internally with Stripe\'s API.'})
                break;
              case 'StripeConnectionError':
                // Some kind of error occurred during the HTTPS communication
                return res.json({status:false,message:'Some kind of error occurred during the HTTPS communication.'})
                break;
              case 'StripeAuthenticationError':
                // You probably used an incorrect API key
                 return res.json({status:false,message:'You probably used an incorrect API key.'})
                break;
              default:
            // Handle any other types of unexpected errors
              return res.json({status:false,message:err})
              break;
        }
        
        
  }    
});


//change password 

router.post('/change-password',accessToken,async(req,res)=>{
    const {oldpassword,newpassword} = req.body
    
    if(!oldpassword) return res.json({status:false,message:"old_passworld is require"})
    if(!newpassword) return res.json({status:false,message:"new_password is require"})
    try{
        
        const user = await User.findOne({where:{id:req.user.user_id,is_deleted:0,role:1}})
        if(!user) return res.json({status:false,message:"user not found"});
         if(user.is_blocked==1) return res.json({status:false,message:'User is blocked.'})
    
        
      
         const match = await bcrypt.compare(oldpassword,user.password)
         if(!match) return res.json({status:false,message:"password is wrong"})
         
         
         const hash = bcrypt.hashSync(newpassword,10)
             user.password = hash
             user.save();
             
         return res.json({status:true,message:"password change successfully done"})
        
        // const match = await User.findOne({where:{id:provider_id,is_deleted:0,role:0}})
        
    }catch(err){
        console.log(err)
        return res.json({status:false,message:"something is wrong"})
    }
})




router.post('/remove-tip',accessToken,async(req,res) =>{

  const {order_id} = req.body;
  if(!order_id) return res.json({status:false,message:'order id is required.'});
  
  
   try{
       
    const user = await User.findOne({where:{id:req.user.user_id,is_deleted:0,role:1}})
    if(!user) return res.json({status:false,message:"user not found"});
    if(user.is_blocked==1) return res.json({status:false,message:'User is blocked.'});
    
    const order = await Order.findOne({where:{order_id,status:1}});
    if(!order) return res.json({status:false,message:'Order id not found.'});
    
    // return res.json( parseFloat(order.grand_total) - parseFloat(order.tip))
    var getgrandtotal = parseFloat(order.grand_total) - parseFloat(order.tip);
   // return res.json(getgrandtotal)
    order.tip=0;
    order.grand_total =  parseFloat(getgrandtotal);
    order.save();
    
    
    return res.json({status:true,message:'Tip has been removed successfully.'})
    
    
         
   }catch(err){
       return res.json(err)
    return res.json({status:false,message:'Something is wrong.'});   
   } 
});


router.post('/remove-coupon',accessToken,async(req,res) =>{
    const {order_id} = req.body;
    try{
        
        const user = await User.findOne({where:{id:req.user.user_id,is_deleted:0,role:1}})
        if(!user) return res.json({status:false,message:"user not found"});
        if(user.is_blocked==1) return res.json({status:false,message:'User is blocked.'});
        
         
         const order = await Order.findOne({where:{order_id,status:1}});
         if(!order) return res.json({status:false,message:'Order id not found.'});
         
    //   return res.json(order)
         
            var discountedremoved         =  order.total_amount+order.discount_amount;
            var pdiscountedremoved        =  order.grand_total+order.discount_amount;
            
            // return res.json(pdiscountedremoved)
            var newTax = parseFloat(order.tax_perc)/100*discountedremoved;
            
           
            order.tax             = parseFloat(newTax);
            order.total_amount    = parseFloat(discountedremoved);
            order.grand_total     = parseFloat(discountedremoved)+parseFloat(newTax)+parseFloat(order.tip);  //parseFloat(pdiscountedremoved)+parseFloat(newTax);
            order.coupon_id       = 0;
            order.coupon_code     = '';
            order.coupon_type     = 0;
            order.discount_value  = 0;
            order.discount_amount = 0;
            order.save();

         
         return res.json({status:true,data:order,message:'Coupon removed.'});
    }catch(err){
        return res.json({status:false,message:'Something is worng.'});
    }
});





// get cleanup list according to lawn size

router.post('/get-cleanup',accessToken,async(req,res) =>{
    
    const {lawn_size_id} = req.body;
    
    if(!lawn_size_id) return res.json({status:false,message:"lawn size is required."});
    
    try{
         const user = await User.findOne({where:{id:req.user.user_id,is_deleted:0,role:1}})
         if(!user) return res.json({status:false,message:"user not found"});
        
         const cleanup = await Cleanup.findAll({where:{lawn_size_id,is_deleted:0}});
         return res.json({status:true,data:{cleanup},message:'Available clean up list for this lawnsize '+lawn_size_id})
    }catch(err){
        console.log(err)
       return res.json({status:false,message:'Something is wrong.'}); 
    }
});






// router.post('/get-cleanuptest',accessToken,async(req,res) =>{
    
//     // const {lawn_size_id} = req.body;
    
//     // if(!lawn_size_id) return res.json({status:false,message:"lawn size is required."});
    
//     try{
        
//           var headCapsule =[{lawn_size:"Name"}]; 
//           var bodyCapsule =[]; 
          
//           const lawnsize = await Lawn_size.findAll({where:{is_deleted:0}});
          
          
//           for(var i=0; i < lawnsize.length; i++){
              
//              headCapsule.push({
//              lawn_size:lawnsize[i].name   
//              }) 
             
//           }
          
//           var cleanup = await Cleanup.findAll({
//                   where:{is_deleted:0},
//                   attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('name')) ,'name']]
//               });
          
//         //   return res.json(cleanup)
          
//           var bodyCapsule =[];
//           var datalist    = [];
//           for(var i=0; i < cleanup.length; i++){
              
//              var cleanupRaw = await Cleanup.findAll({
//                   where:{name:cleanup[i].name,is_deleted:0},
//                   attributes:['id','name','price','lawn_size_id']
                  
//               });
              
              
//               var groupBy = function(xs, key) {
//                   return xs.reduce(function(rv, x) {
//                     (rv[x[key]] = rv[x[key]] || []).push(x);
//                     return rv;
//                   }, {});
//                 };

             

//             //   bodyCapsule.push(cleanup[i].name)
//               bodyCapsule.push( groupBy(cleanupRaw, 'name'));
              
          
//             //  bodyCapsule.push({
//             //      name:cleanup[i].name,
//             //      lawn_size:cleanupRaw
             
//             //  }) 
//           }
         
          
//       return res.json({headCapsule,bodyCapsule})
        
        
//          return res.json({status:true,data:{cleanup},message:'Available clean up list for this lawnsize '+lawn_size_id})
//     }catch(err){
//         console.log(err)
//       return res.json({status:false,message:'Something is wrong.'}); 
//     }
// })




router.post('/get-cleanuptest',async(req,res) =>{
    
    // const {lawn_size_id} = req.body;
    
    // if(!lawn_size_id) return res.json({status:false,message:"lawn size is required."});
    
    try{
            
         const user = await User.findOne({where:{id:req.user.user_id,is_deleted:0,role:1}})
         if(!user) return res.json({status:false,message:"user not found"});
        
          var cleanup = await Cleanup.findAll({
                  where:{is_deleted:0},
                  attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('name')) ,'name']]
              });
              
            //   return res.json(cleanup)
          
          var datalist    = [];
         
          for(var i=0; i < cleanup.length; i++){
              
              var cleanupRaw = await Cleanup.findAll({
                  where:{name:cleanup[i].name,is_deleted:0},
                  
              });
             
              var obj ={};
              obj["name"] =cleanup[i].name;
             
              for(var j=0; j<cleanupRaw.length; j++){
                 obj[`col_${j+1}`] =cleanupRaw[j].price
              }
              datalist.push(obj)
               
              
          
           
          }
         
          
    //   return res.json({datalist})
        
        
         return res.json({status:true,data:{datalist},message:'Available clean up list for this lawnsize'})
    }catch(err){
        console.log(err)
      return res.json({status:false,message:'Something is wrong.'}); 
    }
})







// stripe connect
// router.post('/create-acc',async(req,res) =>{
//     try{
        
//         //  const user = await User.findOne({where:{id:req.user.user_id,is_deleted:0,role:1}})
//         //  if(!user) return res.json({status:false,message:"user not found"});
//     const account = await stripe.accounts.create({
//                     type: 'custom',
//                     country: 'US',
//                     email: 'kavita@mailinator.com',
//                     business_type: 'individual',
//                     capabilities: {
//                     card_payments: {requested: true},
//                     transfers: {requested: true},
//                     },
//                     tos_acceptance: {
//                     date: Math.floor(Date.now() / 1000),
//                     ip: req.connection.remoteAddress,
//                     },
//                     company: {
//                         address: {
//                         city: 'Dallas',
//                         country: "US",
//                         line1: 'address_full_match',
//                         line2: '825 Baker Avenue',
//                         postal_code: 75202,
//                         state: 'Texas'
//                         }
//                     },
//                     individual: {
//                         first_name:'kavita',
//                         last_name:'kag',
//                         email:'kavita@mailinator.com',
//                         phone:'0000000000',
//                         dob:{day:01,month:01,year:1901},
//                         address: {
//                         city: 'Dallas',
//                         country: "US",
//                         line1: 'address_full_match',
//                         line2: '825 Baker Avenue',
//                         postal_code: 75202,
//                         state: 'Texas'
//                         },
//                         ssn_last_4:'0000'
//                     },
//                     external_account:{
//                         object:'bank_account',
//                         country:'US',
//                         currency:'usd',
//                         routing_number:'110000000',
//                         account_number:'000123456789'
//                     },
//                     business_profile:{
//                         mcc:'1520',
//                         url:'facebook.com'
//                     }
                    
//     });
    
    
//     var time = moment.utc().valueOf();
//     // tos_acceptance.date = Math.floor(time / 1000);
    
//         // const account = await stripe.accounts.update(
//         // 'acct_1Jja324EviQrr3H0',
//         //     {
//         //         tos_acceptance: {
//         //         date: Math.floor(Date.now() / 1000),
//         //         ip: req.connection.remoteAddress, // Assumes you're not using a proxy
//         //         },
//         //     }
//         // );
        
        
//         //   const account = await stripe.accounts.update(
//         //  'acct_1JjkvAQTY6z9ROCI',
//         //     {
//         //      individual: {
//         //                 first_name:'raju',
//         //                 last_name:'sharma',
//         //                 email:'raju@mailinator.com',
//         //                 phone:'0000000000',
//         //                 dob:{day:01,month:01,year:1901},
//         //                 address: {
//         //                 city: 'Dallas',
//         //                 country: "US",
//         //                 line1: 'address_full_match',
//         //                 line2: '825 Baker Avenue',
//         //                 postal_code: 75202,
//         //                 state: 'Texas'
//         //                 },
//         //                 ssn_last_4:'0000'
//         //             },
//         //     }
//         // );
        
        
//         //   const charge = await stripe.charges.create({
//         //                           amount: 2*100,
//         //                           currency:'US',
//         //                           source: 'tok_mastercard',
//         //                           description:'this is connect',
//         // });
        
        
//         // const account = await stripe.transfers.create({
//         //   amount: 20*100,
//         //   currency: "usd",
//         //   source_transaction: "ch_3JjMeOKgkddq8mOS0jTxEghp",
//         //   destination: "acct_1JjlB34GjZryZCgR",
//         // });
        
        
//     //     const account = await stripe.accounts.create({
//     //           country: 'US',
//     //           type: 'express',
//     //           capabilities: {
//     //             card_payments: {
//     //               requested: true,
//     //             },
//     //             transfers: {
//     //               requested: true,
//     //             },
//     //           },
//     //           business_type: 'individual',
//     //           business_profile: {
//     //             url: 'https://example.com'
//     //           },
//     //   });



//   // return res.json(account)

//     }catch(err){
//         console.log(err)
//         return res.json(err)
//     }
// })




// add report

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // cb(null,'backend/public/documents/')
     cb(null, path.join(__dirname,'../public/report_images'))
      },
    filename: function (req, file, cb) {
      cb(null, Date.now()+'.png')
    }
  })
  var upload = multer({ storage: storage })

router.post('/add-report',accessToken,upload.fields([{name:'img_1'},{name:'img_2'},{name:'img_3'}]),async(req,res) =>{
    
    const {
        report,
        reportee,
        img_1,
        img_2,
        img_3,
        question_id,
        order_id
      } = req.body;
    if(!order_id) return res.json({status:false,message:"Order id is required."});
    if(!report) return res.json({status:false,message:"Report is required."});
    if(!reportee) return res.json({status:false,message:"Reportee is required."});
    try{
        
         const reporters = await User.findOne({where:{id:req.user.user_id,is_deleted:0,role:1}})
         if(!reporters) return res.json({status:false,message:"user not found"});
        
        //  return res.json(reporter)
         if(reporters.role==1)
         {
              var type="user"
         }else{
             var type="provider"
         }
        await Report.create({
             type:type,
             report:report,
             reporter:reporters.id,
             reportee:reportee,  
             question_id:question_id,
             order_id:order_id,
             img_1:(req.files.img_1) ? '/report_images/'+req.files.img_1[0].filename:"",
             img_2:(req.files.img_2) ? '/report_images/'+req.files.img_2[0].filename:"",
             img_3:(req.files.img_3) ? '/report_images/'+req.files.img_3[0].filename:"",
         })
        return res.json({status:true,message:"Report Done"})
    }catch(err){
        console.log(err)
       return res.json({status:false,message:'Something is wrong.'}); 
    }
})




//get question

router.post('/get-question',accessToken,async(req,res) =>{
   try{
         const user = await User.findOne({where:{id:req.user.user_id,is_deleted:0,role:1}})
         if(!user) return res.json({status:false,message:"user not found"});
        
         const question = await Question.findAll({where:{type:2,is_deleted:0}});
         return res.json({status:true,data:{question},message:'Available report questions list'})
    }catch(err){
        console.log(err)
       return res.json({status:false,message:'Something is wrong.'}); 
    }
})



//user side job confirmetion

router.post('/user_status',accessToken,async(req,res)=>{
    const {order_id} = req.body
    if(!order_id) return res.json({status:false,messge:'Order id require'})
    try{
        // return res.json("okk")25
        const user = await User.findOne({where:{id:req.user.user_id,is_deleted:0,role:1}})
        if(!user) return res.json({status:false,message:'User not found'});
       
        var order_confirm= await Order.findOne({where:{order_id,is_deleted:0}})
        if(order_confirm==null) return res.json({status:false,message:"Order id wrong"})
        
        if(order_confirm.status==4){
            
            return res.json({status:false,message:'Your job is already cancelled'})
        }
            
        if(order_confirm.status==3)
        {
            order_confirm.user_status=1;
            order_confirm.save();
        var provider = await User.findOne({where:{id:order_confirm.assigned_to}})//25
            var name= user.fristname+' '+user.lastname;  
            // return res.json(name)
        //  var payload = {
        //     notification:{
        //     title:'Profile Update',
        //     body:'Your job has been mark as completed by '+name,
        //     },
        //         data:{
        //             order_id:order_id,
        //         title:'Profile Update',
        //         body:'Your job has been mark as completed by '+name,
        //         click_action:'user_completed_the_order'
        //     }
        //     };
            
        // var options = {
        //     priority: "high",
        //     timeToLive: 60 * 60 * 24,
        //     };
        //     var token=provider.fcm_token;
            
        //     var test = await adminpush.messaging().sendToDevice(provider.fcm_token,payload,options)
             
             
             
              if(provider.fcm_token !=''){
                
            //start notification  
            var message = { 
            to: provider.fcm_token, 
            collapse_key: '',
            
            notification:{
                title:'Profile Update',
                body:'Your job has been mark as completed by '+name,
            },
            
            data:{
                order_id:order_id,
                title:'Profile Update',
                body:'Your job has been mark as completed by '+name,
                click_action:'user_completed_the_order'
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
            return res.json({status:true,message:'Your job done'})
        }
        
        
        return res.json({status:false,message:'Your job not complete by provider side'})
    }catch(err){
        // return res.json(err)
        console.log(err)
        return res.json({status:false,message:'Something is wrong'})
        
    }
})











router.post('/add-stripe-account',async(req,res) =>{
    const {user_id} = req.body;
    try{
        
    //     const user = await User.findOne({where:{id:user_id,is_deleted:0,role:2}})
    //     if(!user) return res.json({status:false,message:"user not found"});
    //     if(user.is_blocked==1) return res.json({status:false,message:'User is blocked.'});
        
    //      var bank_detail         =  await Bank_detail.findOne({where:{provider_id:user.id}}); 
    //     //  return res.json(bank_detail)
    //     // return res.json(user.dob.split("-"));
    //      const account = await stripe.accounts.create({
    //                 type: 'custom',
    //                 country: 'US',
    //                 email: user.email,
    //                 business_type: 'individual',
    //                 capabilities: {
    //                 card_payments: {requested: true},
    //                 transfers: {requested: true},
    //                 },
    //                 tos_acceptance: {
    //                 date: Math.floor(Date.now() / 1000),
    //                 ip: req.connection.remoteAddress,
    //                 },
    //                 company: {
    //                     address: {
    //                     city: user.city,//'Dallas',
    //                     country: "US",
    //                     line1: user.street,//'address_full_match',
    //                     line2: user.street,//'825 Baker Avenue',
    //                     postal_code:parseInt(user.zip_code), //75202,
    //                     state:user.state
    //                     }
    //                 },
    //                 individual: {
    //                     first_name:user.fristname,
    //                     last_name:user.lastname,
    //                     email:user.email,
    //                     phone:user.mobile,
    //                     // dob:{day:01,month:01,year:1901},
    //                     dob:{day:parseInt(user.dob.split("-")[0]),month:parseInt(user.dob.split("-")[1]),year:parseInt(user.dob.split("-")[2])},
    //                     address: {
    //                     city: user.city,//'Dallas',
    //                     country: "US",
    //                     line1: user.street,//'address_full_match',
    //                     line2: user.street,//'825 Baker Avenue',
    //                     postal_code:parseInt(user.zip_code), 
    //                     state:user.state
    //                     },
    //                     ssn_last_4:user.ssn.substr(user.ssn.length -4)
    //                 },
    //                 external_account:{

    //                     object:'bank_account',
    //                     country:'US',
    //                     currency:'usd',
    //                     routing_number:bank_detail.routing_number,
    //                     account_number:bank_detail.account_number,
    //                 },
    //                 business_profile:{

    //                     mcc:'1520',
    //                     url:'facebook.com'
    //                 }
                    
    // });
    
    
    // user.account_id = account.id;
    // user.save();
    
    //  const account = await stripe.accounts.create({
    //                 type: 'custom',
    //                 country: 'US',
    //                 email: 'kavita@mailinator.com',
    //                 business_type: 'individual',
    //                 capabilities: {
    //                 card_payments: {requested: true},
    //                 transfers: {requested: true},
    //                 },
    //                 tos_acceptance: {
    //                 date: Math.floor(Date.now() / 1000),
    //                 ip: req.connection.remoteAddress,
    //                 },
    //                 company: {
    //                     address: {
    //                     city: 'Dallas',
    //                     country: "US",
    //                     line1: 'address_full_match',
    //                     line2: '825 Baker Avenue',
    //                     postal_code: 75202,
    //                     state: 'Texas'
    //                     }
    //                 },
    //                 individual: {
    //                     first_name:'kavita',
    //                     last_name:'kag',
    //                     email:'rvi@mailinator.com',
    //                     phone:'9753244000',
    //                     dob:{day:01,month:01,year:1901},
    //                     address: {
    //                     city: 'Dallas',
    //                     country: "US",
    //                     line1: 'address_full_match',
    //                     line2: '825 Baker Avenue',
    //                     postal_code: 75202,
    //                     state: 'Texas'
    //                     },
    //                     ssn_last_4:'0000'
    //                 },
    //                 external_account:{

    //                     object:'bank_account',
    //                     country:'US',
    //                     currency:'usd',
    //                     routing_number:'110000000',
    //                     account_number:'000123456789'
    //                 },
    //                 business_profile:{

    //                     mcc:'1520',
    //                     url:'facebook.com'
    //                 }
                    
    // });
    
    
    // return res.json(account)
    //   if(user){
    //       return res.json({status:true,'message':'Account has been created successfully.'}) 
    //   }else{
    //       return res.json({status:false,'message':'something is wrong.'})
    //   }
    
    }catch(err){
        // return res.json(err)
        return res.json({status:false,message:'something is wrong.'});
    }
})




// router.post('/sendnoti',async(req,res)=>{
//     try{
      
//          var payload = {
//           notification:{

//               title:'You have a request',
//               body:'test test test test test test'
//           }
//       };
       
       
//       var options = {
//             priority: "high",
//             timeToLive: 60 * 60 * 24,
            
//       };
      
//         var reslt = adminpush.messaging().sendToDevice("fEG0Eav-Tp2bNh1qncuFxh:APA91bE-kb-e-r6u-qV-SE_ahg5JmatQI-e-y_3sxYVs__rEg0KDA1NRzNPAWpCpxlkCFzKCvtcQ0wTdTSO5h2yN9kf68PbmxE_M6DgUE9V8fUzyK6-4S__SSwRswH4NRx5-wMoOTu5F",payload,options)
//         return res.json(reslt)
//     }catch(err){
//         console.log(err)
//         return res.json(err)
//     }
// })





router.post('/test',async(req,res) =>{
    try{
                
        //  const account = await stripe.transfers.create({
        //   amount: 20*100,
        //   currency: "usd",
        //   source_transaction: "ch_3JjMeOKgkddq8mOS0jTxEghp",
        //   destination: "acct_1JjlB34GjZryZCgR",
        //  });
        
          var getstripe =  await Admin.findOne();
          var stripe = Stripe(getstripe.stripe_key);
        
          const product = await stripe.products.create({
                      name:"ORD44542545645",
                    });


            const plan = await stripe.plans.create({
              amount: 10*100,//[parseFloat(RecurringtaxFeeAmount),parseFloat(RecurringtotalServicePrice)].reduce((a, b) => a + b, 0),
              currency: 'usd',
              interval: 'day',
              interval_count:7,
              product: product.id,
            });
            
            var getuser = await User.findOne({where:{id:1,is_deleted:0}});
            if(!getuser.customer_id){
                return res.json("no")
            }
            const subscription = await stripe.subscriptions.create({
              customer:getuser.customer_id,
              items: [
                {price:plan.id},
              ],
            });

            
            return res.json(subscription)
         
    }catch(err){
        console.log(err)
        return res.json({status:false,message:'Something is wrong'})
    }
})


// // test for notification
// router.post('/noti',async(req,res) =>{
    
//     try{
//          var payload = {
//             notification:{
            
//             title:'New Job',
//             body:'New job has been posted',
           
//             },
//             data:{
//                 order_id:'jjhgj' ,
//                 title:'New Job',
//                 body:'New job has been posted',
//                 click_action:'postjob',
//             }
//             };
            
            
//             var options = {
//             priority: "high",
//             timeToLive: 60 * 60 * 24,
            
//             };
            
           
//           var test = await  adminpush.messaging().sendToDevice('csxjTOiHTva1PU7fsVgHiU:APA91bFJCt64R34f2Sf3CdMpJvBmj0ao0eEKJszq-t66EPZ-brrolhEPS72gZkpkabfTN9Q_KM_uBOOsUwd56oCv4SlTmZlNaKIELI2wdacZ5QojUsXE2qSbDtiQbJ1Hc3PySo_cj3AX',payload,options)
//             return res.json(test);
            
//     }catch(err){
//      return res.json(err)   
//     }
     
          
            
    
// });



// subscription


router.post('/subtest',async(req,res) =>{
    try{
        
        // const product = await stripe.products.create({
        //   name: 'Lawnmowing',
        // });

        // const price = await stripe.prices.create({
        //   unit_amount: 20*100,
        //   currency: 'usd',
        //   recurring: {interval: 'day',interval_count:1},
        //   product: product.id,
        // });
        
      
        
        // const subscription = await stripe.subscriptions.create({
        //     customer: 'cus_KYv4DBfdPMWast',
        //     items: [
        //         {price:price.id},
        //         ],
        // });


    //  const charge = await stripe.charges.create({
    //                                   amount: 14*100,
    //                                   currency:'usd',
    //                                   source: 'tok_visa',
    //                                   description:"testing",
    //                                   metadata:{user_id:1},
    //                                   customer:'cus_KYv4DBfdPMWast',
    //         });
        
        return res.json(charge)
    }catch(err){
      return res.json(err);   
    }
});



router.post('/logout',accessToken,async(req,res)=>{
    
    try{
        const user = await User.findOne({where:{id:req.user.user_id,is_deleted:0,role:1}})
        if(!user) return res.json({status:false,message:'User not found'});
        
        user.fcm_token ="";
        user.save();
        return res.json({status:true,message:"User logout"})
        
        
    }catch(err){
        console.log(err)
        return res.json({status:false,message:"Something is wrong"})
    }
 });
 
 
 
 
// test function
// router.post('/test123', async (req, res) => {
//     try {
//         var order = await Order.findOne({
//             where: {
//                 order_id: 'ORD51593135325'
//             }
//         });
//         var radius = await Setting.findOne({
//             where: {
//                 field_key: 'radius'
//             }
//         });
//         var all_provider = await User.findAll({
//             where: {
//                 is_deleted: 0,
//                 is_blocked: 0,
//                 status: 1,
//                 role: 2
//             },
//             attributes: ['id','fcm_token','lat','lng',
//                 [Sequelize.literal("6371 * acos(cos(radians(" + parseFloat(order.lat) + ")) * cos(radians(lat)) * cos(radians(" + parseFloat(order.lng) + ") - radians(lng)) + sin(radians(" + parseFloat(order.lat) + ")) * sin(radians(lat)))"), 'distance']
//             ],
//             having: Sequelize.literal('distance < ' + parseFloat(radius.field_value)),
//             logging: console.log,

//         });
        
//         //  return res.json(all_provider)

//         var neapp = [];
//         for (var i=0; i<all_provider.length; i++) {
//             if (all_provider[i].fcm_token != '') {

//                 var provider_category = await Provider_equipment.findAll({
//                     where: {
//                         is_deleted: 0,
//                         provider_id: all_provider[i].id
//                     }
//                 })
                
//                 // neapp.push(all_provider[i].id)
//                 let group = provider_category.reduce((r, a) => {
//                     r[a.category_id] = [...r[a.category_id] || [], a];
//                     return r;
//                 }, {});

//                 // return res.json(group)

//                 var categories = [];
//                 Object.keys(group).forEach((k, v) => {
//                     categories.push(k)
//                 });

//                 if (categories.indexOf((order.category_id).toString()) !== -1) {

//                     if (all_provider[i].fcm_token != '') {
                     
//                         //start notification  
//                         // var message = {
//                         //     to: all_provider[i].fcm_token,
//                         //     collapse_key: '',

//                         //     notification: {
//                         //         title: 'New Job',
//                         //         body: '(NEW JOB) available in your Area !'
//                         //     },

//                         //     data: {
//                         //         order_id: order.order_id,
//                         //         title: 'New Job',
//                         //         body: '(NEW JOB) available in your Area !',
//                         //         click_action: 'postjob'
//                         //     }
//                         // };

//                       //  neapp.push(all_provider[i].fcm_token)
//                         // fcm.send(message, function(err, response) {
//                         //     if (err) {
//                         //         console.log("errrrr notification");
//                         //     } else {
//                         //         console.log("notification done");
//                         //     }
//                         // });
//                         //end notification
//                     }
//                 }

//             }
//         }
      
//     } catch (err) {
//         return res.json({
//             status: false,
//             message: 'something is wrong.'
//         });
//     }
// })
 
 
 
 
 
 
 
// //  stripe key 
// router.post('/update-stripe-key',accessToken,async(req,res) =>{
//     const {stripe_public_key,stripe_private_key} = req.body;
    
//     if(!stripe_public_key) return res.json({status:false,message:'stripe public key is required.'});
//     if(!stripe_private_key) return res.json({status:false,message:'stripe private key is required.'});
//     try{
        
//     const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
//     if(!admin) return res.json({status:false,message:"admin is deleted"})
      
//      admin.stripe_key = stripe_private_key;  
//      admin.public_stripe_key = stripe_public_key;  
//      if(admin.save()){
//       return res.json({status:true,message:"Updated successfully."});   
//      }else{
//       return res.json({status:false,message:"Not updating try again."});
//      }
     
        
//     }catch(err){
//         return res.json(err);
//         return res.json({status:false,message:'something is wrong.'});
//     }
// });





var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null,'backend/public/documents/')
   cb(null, path.join(__dirname,'../public/support_img'))
    },
  filename: function (req, file, cb) {
    var rdmstring = Math.floor(Math.random() * 100);
    cb(null, Date.now()+rdmstring+'.png')
  }
})
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
        user_type:'User',
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




 //CHANGE RECURRING DAYS
router.post('/change-recurring',accessToken,async(req,res)=>{
  const {order_id,days}=req.body
  if(!order_id) return res.json({status:false,message:"Order id is require"})
  if(!days) return res.json({status:false,message:"Days is require"})
  try{
    
   
    const users = await User.findOne({where:{id:req.user.user_id,is_deleted:0,role:1}})
    if(!users) return res.json({status:false,message:'User not found'});
     
      const recurring_user = await Recurring_history.findOne({
          where:{order_id:order_id,is_deleted:0},
          include:[
              {
               model:User,as:'userdata'
              }
          ]
          })
          if(!recurring_user) return res.json({status:false,message:"order not match"})
         
           recurring_user.on_every= days;
           recurring_user.save();
          
       var last_date_details=await Order.findOne({
             where:{is_deleted:0,parent_recurrent_order_id:order_id},
             order:[['id','desc']]})
           
             if(last_date_details!=null)
             {
                 var start_date=last_date_details.createdAt;
                 var new_date = moment(start_date, "YYYY-MM-DD").add(recurring_user.on_every, 'days');
                
                  recurring_user.date=new_date.format('YYYY-MM-DD');
                  // return res.json(recurring_user.date)
                 recurring_user.save();
             }else{
                 
                 var start_date=moment(new Date()).format("YYYY-MM-DD")
              //   return res.json(start_date)
                 var new_date = moment(start_date, "YYYY-MM-DD").add(recurring_user.on_every, 'days');
                 recurring_user.date=new_date.format('YYYY-MM-DD');
                 recurring_user.save();
             }
             
             
             
      // return res.json(recurring_user)
     
      if(recurring_user.lawn_size_id !=0 && recurring_user.lawn_size_id!=null)
      {
          var lawn_id=recurring_user.lawn_size_id;
          var on_every=recurring_user.on_every;
          
          var lawn= await Lawn_size.findOne({where:{id:lawn_id,is_deleted:0}})
          
          if(on_every==7){
          recurring_user.lawn_size_amount=lawn.seven_days_price;
          recurring_user.save();
          }
          
          if(on_every==14){
          recurring_user.lawn_size_amount=lawn.fourteen_days_price;
          recurring_user.save();
          }
          
          if(on_every==10){
          recurring_user.lawn_size_amount=lawn.ten_days_price;
          recurring_user.save();
          }
      }
     
      //  return res.json(recurring_user.fence_id)
     if(recurring_user.fence_id!= 0 && recurring_user.fence_id !=null)
      {
          
          
          var fence_id= recurring_user.fence_id;
          var on_every=recurring_user.on_every;
          
          var fence = await Fence.findOne({where:{id:fence_id,is_deleted:0}})
          
          if(on_every==7){
          recurring_user.fence_amount=fence.seven_days_price;
          recurring_user.save();
          }
          
          if(on_every==14){
          recurring_user.fence_amount=fence.fourteen_days_price;
          recurring_user.save();
          }
          
          if(on_every==10){
          recurring_user.fence_amount=fence.ten_days_price;
          recurring_user.save();
          }
      }
     
        if(recurring_user.corner_lot_id!= 0 && recurring_user.corner_lot_id !=null)
      {
          
          
          var corner_lot_id= recurring_user.corner_lot_id;
          var on_every=recurring_user.on_every;
          
          var corner_lot = await Corner_lot.findOne({where:{id:corner_lot_id,is_deleted:0}})
          
          if(on_every==7){
          recurring_user.corner_lot_amount=corner_lot.seven_days_price;
          recurring_user.save();
          }
          
          if(on_every==14){
          recurring_user.corner_lot_amount=corner_lot.fourteen_days_price;
          recurring_user.save();
          }
          
          if(on_every==10){
          recurring_user.corner_lot_amount=corner_lot.ten_days_price;
          recurring_user.save();
          }
      }
      
      var total_price =( 
          parseFloat(recurring_user.lawn_size_amount) +
         
          parseFloat(recurring_user.fence_amount) +
          parseFloat(recurring_user.corner_lot_amount) +
          parseFloat(recurring_user.admin_fee) )
          
      recurring_user.tax=total_price*recurring_user.tax_perc/100;
      recurring_user.total_amount=total_price; 
      recurring_user.grand_total =total_price + parseFloat(recurring_user.tax)
      recurring_user.save()
      
      
      
     
      var user = await User.findOne({where:{is_deleted:0,id:recurring_user.user_id}})
     
      if(user.fcm_token !=''){
        
          //start notification  
          var message = { 
          to: user.fcm_token, 
          collapse_key: '',
          
          notification:{
              title:'Order Update',
              body:'Your recurring service timing has been changed'
          },
          
           data:{
              order_id:order_id,
              title:'Order Update',
              body:'Your recurring service timing has been changed',
              click_action:'service_change'
            }
          };
          
          
          fcm.send(message, function(err, response){
          if (err) {
          console.log("errrrr notification");
          } else {
          console.log("notification done");
          }
          });
        
          } 
      // return res.json(user.mobile)
          else { 
            
              var reslt = await client.messages.create({ 
                  body: `Your recurring service timing has been changed`,
                  from: "+17075874531",
                  to:"+1"+user.mobile,
                  // to:"+917447070365"
                });
              //end notification
              }
             
             
 
    return res.json({status:true,message:"Recurring job timing has changed"})  
  }catch(err){
      console.log(err)
      return res.json({status:false,message:"Something is wrong"})
  }
})

//change Day of the week 

router.post('/change-recurring-day',accessToken,async(req,res)=>{
    const {order_id,change_date} = req.body;
    if(!order_id) return res.json({status:false,message:"Order_id is require"});
    if(!change_date) return res.json({status:false,message:"Chaneg date is require"})
    
    try{
      const users = await User.findOne({where:{id:req.user.user_id,is_deleted:0,role:1}})
      if(!users) return res.json({status:false,message:'User not found'});

      // return res.json(users)

           var order = await Order.findOne({
               where:{order_id,is_deleted:0},
               include:[
                   {
                       model:User,as:'user_details'
                   },
                   {
                    model:User,as:'provider'
                },
               ]
            }) 
        // return res.json(order.user_details.fcm_token);

            if(order==null) return res.json({status:false,message:"Order not found."})
            if(order.on_the_way==1) return res.json({status:false,message:"Order not cancel because your provider is on the way."})
            order.date=change_date,
            order.save();


            if(order.user_details.fcm_token !=''){
                
                //start notification  
                var message = { 
                to: order.user_details.fcm_token, 
                collapse_key: '',
                
                notification:{
                    title:'Order Update',
                    body:'Your service date&time change.'
                },
                
                 data:{
                    title:'Order Update',
                    body:'Your service date&time change.',
                    click_action:'order update'
                  }
                };
                
                
                fcm1.send(message, function(err, response){
                if (err) {
                console.log("errrrr notification");
                } else {
                console.log("notification done");
                }
                });
                //end notification
                }
                else{ 
                    var reslt = await client.messages.create({ 
                        body: `Your service date&time change.`,
                        from: "+17075874531",
                        to: "+1"+order.user_details.mobile,
                        // to:"+917447070365"
                      });
                    //end notification 
                    } 
            //    return res.json(order.provider.fcm_token)
        if(order.provider.fcm_token !=''){
    
            //start notification  
            var message = { 
            to: order.provider.fcm_token, 
            collapse_key: '',
            
            notification:{
                title:'Order Update',
                body:'Yor Service date&time change by user.'
            },
            
                data:{
                title:'Order Update',
                body:'Yor Service date&time change by user.',
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
            }
            else{ 
                var reslt = await client.messages.create({ 
                    body: `Yor Service date&time change by user.`,
                    from: "+17075874531",
                    to: "+1"+order.provider.mobile,
                    // to:"+917447070365"
                    });
                //end notification 
                } 
           
            return res.json({status:true,message:"Service has been updated."})

    }catch(err)
    { 
        return res.json({status:false,message:"somthing is wrong..."})
    }
})



//change instruction  job note
router.post('/change-instruction',accessToken,async(req,res)=>{
  
  const {order_id,instruction} = req.body;
  if(!instruction) return res.json({status:false,message:"Instruction is require"})
  if(!order_id) return res.json({status:false,message:"Order id is require"})

  try{

    const users = await User.findOne({where:{id:req.user.user_id,is_deleted:0,role:1}})
    if(!users) return res.json({status:false,message:'User not found'});

      var order = await Order.findOne({
          where:{order_id,is_deleted:0},
          include:[
              {
                  model:User,as:'user_details'
              }
          ]
      })
    // return res.json(order)
      order.instructions=instruction;
      order.save();
      if(order.user_details.fcm_token!="")
      {
           //start notification  
           var message = { 
              to: order.user_details.fcm_token, 
              collapse_key: '',
              
              notification:{
                  title:'Order Update',
                  body:'Your job notes have been updated.'
              },
              
                  data:{
                  title:'Order Update',
                  body:'Your job notes have been updated.',
                  click_action:'order update'
                  }
              };
              
              
              fcm1.send(message, function(err, response){
              if (err) {
              console.log("errrrr notification");
              } else {
              console.log("notification done");
              }
              });
              //end notification
      }else{ 
          var reslt = await client.messages.create({ 
              body: `Your job notes have been updated.`,
              from: "+17075874531",
              to: "+1"+order.user_details.mobile,
              // to:"+917447070365"
              });
          //end notification 
          } 
      
      return res.json({status:true,message:"Your job notes have been updated."})
  }catch(err)
  {
      return res.json(err)
  }
})


module.exports = router;
