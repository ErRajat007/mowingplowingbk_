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
// moment().format('YYYY-MM-DD hh:mm:ss');

const multiparty = require("multiparty");


var admin = require("firebase-admin");

var serviceAccount = require("../elevate-21f51-firebase-adminsdk-oudvo-de1ab8547d .json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
    
    
const accessToken = require('../middleware/accessToken');
const {Sequelize, sequelize,User,Category,Appointment,Review,Transaction,Bank_detail,Notification} = require('../models');


const Op = Sequelize.Op;

router.get('/home',accessToken,async(req,res)=>{
    
    try{
    
    const user = await User.findOne({
      where:{id:req.user.user_id},
      
      include:[
        {
            model:Appointment,
            as:'appointments',
            attributes: [[Sequelize.fn('SUM', Sequelize.col('appointments.amount')), 'total_earning']],
            where:{admin_transfer:1}
            
        }
        ]
     });
     
     
     

     const upcomming_appointments = await Appointment.findAll({
       where:{coach_id:req.user.user_id},
       attributes: [
        [Sequelize.fn('count', Sequelize.col('coach_id')), 'tappointments']
       ],
      // raw: true,
      });
      
      



      const appointments_req = await Appointment.findAll({
        where:{coach_id:req.user.user_id,payment_status:1},
        attributes: [
         [Sequelize.fn('count', Sequelize.col('coach_id')), 'appointment_req']
        ]
       // raw: true,
       });
       
       
       
       const TODAY_START = new Date().setHours(0, 0, 0, 0);
       const NOW = new Date();


       const todayapp = await Appointment.findAll({
        where: {
          coach_id:req.user.user_id,
          payment_status:1,
          createdAt: { 
            [Op.gt]: TODAY_START,
            [Op.lt]: NOW
          },
        },
         attributes: [
         [Sequelize.fn('count', Sequelize.col('coach_id')), 'today_app']
        ]
     });
     
     
     
      const todayAppointments = await Appointment.findAll({
        where: {
          coach_id:req.user.user_id,
          payment_status:1,
          createdAt: { 
            [Op.gt]: TODAY_START,
            [Op.lt]: NOW
          },
        },
         include:[
           {model:User, as:'user'},
           {model:Category, as:'category'}
          ]
        //  attributes: [
        //  [Sequelize.fn('count', Sequelize.col('coach_id')), 'today_app']
        // ]
     });
     
     
     
     var appList = [];
      for(var i = 0 ; i < todayAppointments.length; i++ ){
    
              var bmsg_status ="";
              var show_chatbox='';
    
              if(todayAppointments[i].status==1){
              bmsg_status ="Booking pending";
              show_chatbox=0;
              }
    
              if(todayAppointments[i].status==2){
                bmsg_status ="Booking Accepted";
                show_cshow_chatboxhat=1;
              }
    
              if(todayAppointments[i].status==3){
                bmsg_status ="Session Ended";
                show_chatbox=0;
              }
    
    
        appList.push({
          appointment_id:todayAppointments[i].id,
          user_id:todayAppointments[i].user.id,
          image:todayAppointments[i].user.image,
          name:todayAppointments[i].user.name,
          rating:4,
          booking_status:bmsg_status,
          booking_date:moment(todayAppointments[i].booking_date).format("ddd,DD MMM h:mm a"),
          duration:todayAppointments[i].duration,
          price:todayAppointments[i].amount,
          category:todayAppointments[i].category.category
        })
      }
  
     
    //  return res.json(appList)
       
    //  return res.json(todayapp)

    var basicdetails = {
        name:user.name,
        location:(user.location) ? user.location:'',
        available_status:user.is_available
    };
    
    
   
     
     
    var x = (user.appointments[0]) ? JSON.parse(JSON.stringify(user.appointments[0])):0;
    var x1 =(upcomming_appointments[0]) ? JSON.parse(JSON.stringify(upcomming_appointments[0])):0;
    var x2 =(appointments_req[0]) ? JSON.parse(JSON.stringify(appointments_req[0])):0;
    var x3 =(todayapp[0]) ? JSON.parse(JSON.stringify(todayapp[0])):0;
   

    var my_earning            = (user.appointments[0]) ? x.total_earning:0;
    
  

    var upcoming_appointments = (upcomming_appointments[0]) ? x1.tappointments:0;

    var today_appontments     = (todayapp[0]) ? x3.today_app:0;

    var appontments_request   = (appointments_req[0]) ? x2.appointment_req:0;
    
    
    // var my_earning            = "0.00";

    // var upcoming_appointments = "0.00";

    // var today_appontments     = "0.00";

    // var appontments_request   = "0.00";
    
     
    var is_approved = user.status==2 ? "Yes":"No"; 
    return res.json({
        status:true,
        data:{
            basicdetails,
            my_earning,
            upcoming_appointments,
            today_appontments,
            appontments_request,
            is_approved:is_approved,
            today_appointment_list:appList
        },
        message:'home page data'});
        
        
        
    }catch(err){
    //   console.log(err)
    //   return res.json(err)
     return res.json({status:false,message:"something is wrong."});
    }
});




router.get('/requests-list',accessToken,async(req,res) =>{
  
  try{
    // console.log(req.user.user_id)
   const appoint = await Appointment.findAll({
     where:{coach_id:req.user.user_id,payment_status:1},
     include:[
       {model:User, as:'user'},
       {model:Category, as:'category'}
      ]
   });
  //  return res.json(appointappointtransaction

  var appList = [];
  for(var i = 0 ; i < appoint.length; i++ ){

          var bmsg_status ="";
          var show_chatbox='';

          if(appoint[i].status==1){
          bmsg_status ="Booking pending";
          show_chatbox=0;
          }

          if(appoint[i].status==2){
            bmsg_status ="Booking Accepted";
            show_cshow_chatboxhat=1;
          }

          if(appoint[i].status==3){
            bmsg_status ="Session Ended";
            show_chatbox=0;
          }


    appList.push({
      appointment_id:appoint[i].id,
      user_id:appoint[i].user.id,
      image:appoint[i].user.image,
      name:appoint[i].user.name,
      rating:4,
      booking_status:bmsg_status,
      booking_date:moment(appoint[i].booking_date).format("ddd,DD MMM h:mm a"),
      duration:appoint[i].duration,
      price:appoint[i].amount,
      category:appoint[i].category.category
    })
  }

  return res.json({status:true,data:{appointment:appList},message:'appointment list.'});
  }catch(err){
    console.log(err)
    return res.json({status:false,message:"something is transactionwrong."});
  }
});


router.post('/action-on-request',accessToken,async(req,res) =>{
   const { appointment_id,status } = req.body;
  try{
      
    var coach = await User.findOne({
        where:{id:req.user.user_id,is_deleted:0}
        
    });  
    if(!coach) return res.json({status:false,message:"coach not found."});
    
    var appoint = await Appointment.findOne({where:{id:appointment_id}});
    appoint.status = status;
    appoint.save();
    
    var getuser = await  User.findOne({where:{id:appoint.user_id}});
    
    // push notification 
    
    // var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    //     to: getuser.fcm_token, 
    //     collapse_key: 'Elevate',
        
    //     notification: {
    //         title: 'Appointment accepted', 
    //         body: 'Your Appointment has been accepted successfully.' 
    //     },
        
    //     // data: {  //you can send only notification or only data(or include both)
    //     //     my_key: 'my value',
    //     //     my_another_key: 'my another value'
    //     // }
    // };
    
    //  var rslt = await fcm.send(message);
    //  return res.json(rslt)
    
    if(status==2){
        
       var notification = await Notification.create({
           coach_id:coach.id,
           user_id:getuser.id,
           title:"Your Appointment accepted",
           message:"test test test test test test",
           type:1
       }); 
       
       
       var payload = {
          notification:{
              title:'Your Appointment accepted',
              body:'test test test test test test'
          }
      };
      
      
    
    }else{
        
      var notification = await Notification.create({
           coach_id:coach.id,
           user_id:getuser.id,
           title:"Your Appointment has rejected",
           message:"test test test test test test",
           type:1
       });    
       
       
       
       
       var payload = {
          notification:{
              title:'Your Appointment has rejected',
              body:'test test test test test test'
          }
      };
      
    }
    
    
    
      
       
       
      var options = {
            priority: "high",
          timeToLive: 60 * 60 * 24
      };
        
        
        
    
       
    //   if(user.id=='156'){
         admin.messaging().sendToDevice(getuser.fcm_token, payload, options)
    
    
    
    return res.json({status:true,message:'Status has been changed successfully.'})
  }catch(err){
    console.log(err)
    // return res.json(err)
    return res.json({status:false,message:"something is wrong."});
  }
});



//  status:{
//         [Sequelize.Op.not]: 4
//       },
      
      
router.post('/appointments',accessToken,async(req,res) =>{
   const { filter_by } = req.body;
 try{
   var appoint = await Appointment.findAll({
     where:{coach_id:req.user.user_id,payment_status:1},
     include:[
      {model:User, as:'user'},
      {model:Category, as:'category'}
     ]
    });

   var appList = [];
   for(var i = 0 ; i < appoint.length; i++ ){
 
           var bmsg_status ="";
           var show_chatbox='';
 
         
 
          //  if(appoint[i].status==2){
          //    bmsg_status ="Booking Accepted";
          //    show_cshow_chatboxhat=1;
          //  }
 
          
     if(filter_by=="ALL"){
         
           if(appoint[i].status==1){
           bmsg_status ="Booking pending";
           show_chatbox=0;
           }
           
          if(appoint[i].status==2){
              bmsg_status ="Job In Process";
              show_chatbox=0;
          }
          
           if(appoint[i].status==3){
             bmsg_status ="Session Ended";
             show_chatbox=0;
           }
           
            if(appoint[i].status==4){
             bmsg_status ="CANCELED";
             show_chatbox=0;
           }
           
           
         appList.push({
           appointment_id:appoint[i].id,
           user_id:appoint[i].user.id,
           image:appoint[i].user.image,
           name:appoint[i].user.name,
           rating:4,
           booking_status:bmsg_status,
           booking_date:moment(appoint[i].booking_date).format("ddd,DD MMM h:mm a"),
           duration:appoint[i].duration,
           price:appoint[i].amount,
           category:appoint[i].category.category,
           allow_chat:appoint.status==2 ?   "YES":"NO",
           allow_rating:appoint.status==3 ? "YES":"NO"
         })
     }
     
     
     
          
 
     
     if(filter_by=="PENDING" && appoint[i].status==1){
         
           if(appoint[i].status==1){
           bmsg_status ="Booking pending";
           show_chatbox=0;
           }
           
           
         appList.push({
           appointment_id:appoint[i].id,
           user_id:appoint[i].user.id,
           image:appoint[i].user.image,
           name:appoint[i].user.name,
           rating:4,
           booking_status:bmsg_status,
           booking_date:moment(appoint[i].booking_date).format("ddd,DD MMM h:mm a"),
           duration:appoint[i].duration,
           price:appoint[i].amount,
           category:appoint[i].category.category,
           allow_chat:appoint.status==2 ?   "YES":"NO",
           allow_rating:appoint.status==3 ? "YES":"NO"
         })
     }
     
     
     
      if(filter_by=="PROCESS" && appoint[i].status==2){
          
          
           if(appoint[i].status==2){
              bmsg_status ="Job In Process";
              show_chatbox=0;
          }
        
          
         appList.push({
           appointment_id:appoint[i].id,
           user_id:appoint[i].user.id,
           image:appoint[i].user.image,
           name:appoint[i].user.name,
           rating:4,
           booking_status:bmsg_status,
           booking_date:moment(appoint[i].booking_date).format("ddd,DD MMM h:mm a"),
           duration:appoint[i].duration,
           price:appoint[i].amount,
           category:appoint[i].category.category,
           allow_chat:appoint.status==2 ?   "YES":"NO",
           allow_rating:appoint.status==3 ? "YES":"NO"
         })
     }
     
     
     
     
     
      if(filter_by=="COMPLETED" && appoint[i].status==3){
            // return res.json("ok");
           if(appoint[i].status==3){
             bmsg_status ="Session Ended";
             show_chatbox=0;
           }
           
           
         appList.push({
           appointment_id:appoint[i].id,
           user_id:appoint[i].user.id,
           image:appoint[i].user.image,
           name:appoint[i].user.name,
           rating:4,
           booking_status:bmsg_status,
           booking_date:moment(appoint[i].booking_date).format("ddd,DD MMM h:mm a"),
           duration:appoint[i].duration,
           price:appoint[i].amount,
           category:appoint[i].category.category,
           allow_chat:appoint.status==2 ?   "YES":"NO",
           allow_rating:appoint.status==3 ? "YES":"NO"
         })
     }
     
     
     
    if(filter_by=="CANCELED" && appoint[i].status==4){
            // return res.json("ok");
           if(appoint[i].status==4){
             bmsg_status ="CANCELED";
             show_chatbox=0;
           }
           
           
         appList.push({
           appointment_id:appoint[i].id,
           user_id:appoint[i].user.id,
           image:appoint[i].user.image,
           name:appoint[i].user.name,
           rating:4,
           booking_status:bmsg_status,
           booking_date:moment(appoint[i].booking_date).format("ddd,DD MMM h:mm a"),
           duration:appoint[i].duration,
           price:appoint[i].amount,
           category:appoint[i].category.category,
           allow_chat:appoint.status==2 ?   "YES":"NO",
           allow_rating:appoint.status==3 ? "YES":"NO"
         })
     }
     
     
     
   }


   return res.json({status:true,data:{appointments:appList},message:'Accept appointment list.'})
 }catch(err){
   console.log(err)
   return res.json({status:false,message:"something is wrong."});
 }
});



 // review
 router.post('/add-review',accessToken,async(req,res) =>{
  const { rating,user_id,comment}  = req.body;
  if(!rating) return res.json({status:false,message:"rating is required."});
  if(!user_id) return res.json({status:false,message:"user id is required."});
  // if(!comment) return res.json({status:false,message:"comment is required."});
   try{
       
    const revieww = await Review.create({
          user_id,
          coach_id:req.user.user_id,
          review_to:1
    });
    
    
    if(revieww) return res.json({status:false,message:'Rating is already given.'});
    const review = await Review.create({
          user_id,
          coach_id:req.user.user_id,
          rating,
          comment,
          review_to:1
    });

    return res.json({status:true,message:"Review added successfully."});
   }catch(err){
    console.log(err)
    return res.json({status:false,message:'Something is wrong.'});
   }
});






// get review
router.post('/get-reviews',accessToken,async(req,res) =>{
  const { coach_id }  = req.body;
  if(!coach_id) return res.json({status:false,message:"coach id is required."});
   try{
    const review = await Review.findAll({
      where:{coach_id},
      include:{
        model:User,
        as:'user'
      } 
    });
    
    var reviews = [];
    // review.forEach(element => {
comment_type

    for(var i=0; i < review.length; i++){

    // var fav = await Favourite.findOne({where:{coach_id:coach_id,user_id:req.user.user_id}});



   
    reviews.push({

        id:review[i].user.id,
        image:review[i].user.image,
        name:review[i].user.name,
        rating:review[i].rating,
        comment:review[i].comment,
        // favourite_status:(fav) ? 1:0

      });
    }

    // });

    return res.json({status:true,data:{reviews:reviews},message:"Reviews list"})
   }catch(err){
    console.log(err)
    return res.json({status:false,message:'Something is wrong.'});
   }
});




// earning
router.get('/earning',accessToken,async(req,res) =>{

  try{
    //   return res.json(req.user.user_id);
   var transaction = await Transaction.findAll({
       where:{paid_to:req.user.user_id,status:2}
       });
        // return res.json(transaction);
       var arrd= [];
       transaction.forEach(element=>{
           arrd.push({
               transaction_id:element.transaction_id,
               amount:element.amount,
               comment_type:element.comment_type,
               created_at:(element.createdAt).toLocaleString()
           });
       })
    
   return res.json({status:true,data:{transaction:arrd},message:"Transaction  details"});
  }catch(err){
     return res.json(err);
   return res.json({status:false,message:"something is wrong."});
  }
});


router.get('/profile',accessToken,async(req,res) =>{

    try{
     var user = await User.findOne({
         where:{id:req.user.user_id},
         attributes:{exclude:['otp','password','fcm_token','is_deleted','device_token','role','status','createdAt','updatedAt']}
         });
     return res.json({status:true,data:{user},message:"Profile details"});
    }catch(err){
     return res.json({status:false,message:"something is wrong."});
    }
});




var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // cb(null,'backend/public/documents/')
     cb(null, path.join(__dirname,'../backend/public/images/user/'))
      },
    filename: function (req, file, cb) {
      cb(null, Date.now()+'.png')
    }
  })
  
  
  var upload = multer({ storage: storage })
  
router.post('/profile-update',accessToken,upload.single('image'),async(req,res) =>{
    const {name,phone,bio,experience} = req.body;

    if(!name) return res.json({status:false,message:"name is required."});
    if(!phone) return res.json({status:false,message:"phone is required."});
    if(!bio) return res.json({status:false,message:"bio is required."});
    if(!experience) return res.json({status:false,message:"experience is required."});
    // if(!req.file.filename) return res.json({status:false,message:"image is required."});



    try{
       
     var user = await User.findOne({where:{id:req.user.user_id}});
     user.name       = name;
     user.phone      = phone;
     user.bio        = bio;
     user.experience = experience;
     if(req.file){
      user.image      = "/public/images/user/"+req.file.filename;
     }
     user.save();

     return res.json({status:true,message:"Profile details updated succesfully."});
    }catch(err){
     return res.json({status:false,message:"something is wrong."});
    }
});



router.post('/change-password',accessToken,async(req,res) => {
    const {old_password,new_password} = req.body;

    if(!old_password) return res.json({status:false,message:'old password is required.'});
    if(!new_password) return res.json({status:false,message:'new password is required.'});

    try{
     var user = await User.findOne({where:{id:req.user.user_id}});

     const match = await bcrypt.compare(old_password, user.password);
     if(match){
        user.password = bcrypt.hashSync(new_password, 10);;
        user.save();

        return res.json({status:true,message:"password has been changed."});
     }
     return res.json({status:false,message:"old password not match."});
    }catch(err){
        console.log(err)
    return res.json({status:false,message:"something is wrong."});
    }
});






var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // cb(null,'backend/public/documents/')
      cb(null, path.join(__dirname,'../backend/public/images/documents/'))
      },
    filename: function (req, file, cb) {
      cb(null, Date.now()+'.png')
    }
  })
  
  
  var upload = multer({ storage: storage })


router.post('/upload-id',accessToken,upload.single('document'),async(req,res) => {
    // const {} = req.body;
     console.log('okkkkk');
    if(!req.file.filename) return res.json({status:false,message:'image is required.'});
   

    try{
     var user = await User.findOne({where:{id:req.user.user_id}});
     user.document = "/backend/public/images/documents/"+req.file.filename;
     user.save();

      return res.json({status:true,message:"Document uploaded successfully."});
    
   
    }catch(err){
        console.log(err)
    return res.json({status:false,message:"something is wrong."});
    }
});


// coach status

router.get('/coach-available-status',accessToken,async(req,res) => {
  

    try{
     var user = await User.findOne({where:{id:req.user.user_id}});
     var msg ='';
     if(user.is_available==1){
         user.is_available = 0;
         msg='You are offline';
         
     }else{
         user.is_available = 1;
          msg='You are online';
     }
     user.save();


     return res.json({status:true,message:msg});
    }catch(err){
    // console.log(err)
    return res.json({status:false,message:"something is wrong."});
    }
});





router.post('/bank-account-details',accessToken,async(req,res) => {
     const {bank_name,account_number} = req.body;
     
     if(!bank_name) return res.json({status:false,message:'Bank name is required.'});
     if(!account_number) return res.json({status:false,message:'Account_number is required.'});
     
    try{
     var user = await User.findOne({where:{id:req.user.user_id}});
     
     var bank_details = await Bank_detail.create({
         coach_id:user.id,
         bank_name,
         account_number
     });
    


     return res.json({status:true,message:"Bank details has submitted successfully."});
    }catch(err){
    return res.json(err)
    return res.json({status:false,message:"something is wrong."});
    }
});



router.get('/get-bank-account-details',accessToken,async(req,res) => {

    try{
     var user = await User.findOne({where:{id:req.user.user_id}});
     
     var bank_details = await Bank_detail.findOne({
       where:{coach_id:user.id}
     });
    


     return res.json({status:true,data:{bank_details:bank_details},message:"Bank details."});
    }catch(err){
    // return res.json(err)
    return res.json({status:false,message:"something is wrong."});
    }
});





router.get('/get-notification-list',accessToken,async(req,res)=>{
       
      try{
          var user = await User.findOne({where:{id:req.user.user_id,is_deleted:0}});
          if(!user) return res.json({status:false,message:"user not found."});
          
          var notification = await Notification.findAll({where:{user_id:user.id,type:2}});
          return res.json({status:true,data:{notification:notification},message:"coach notification data."});
      }catch(err){
        //   return res.json(err)
         return res.json({status:false,message:'Something is wrong.'});
      }
});






module.exports = router;
