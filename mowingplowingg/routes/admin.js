var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const transporter = require('../middleware/emailSend');
const accessToken = require('../middleware/accessToken');
const multer = require('multer');
const saltRounds = 10;
const Stripe = require('stripe');
var cron = require('cron');
var providerpush = require("firebase-admin");
var serviceAccount = require("../mowing-plowing-sp-firebase-adminsdk-v93sq-82906ee7ec.json");
const client = require('twilio')("ACa7971b7881e2db94aff914f7efb68c81", "20326a88cc3feca1af3a5df461e340eb");
var FCM = require("fcm-node");
// user
var serverKey = 'AAAADZ2BjMc:APA91bH24Rkt38jTtRMiKfi1ewcCH1NMz6b356a7rI6IDyZojVfxns5nUhS_WDs7uxF8E6wRb8waaiJsbQU-gok1nel-drpmjTAE69x69F0sZHeuqsar3pRMW3Hjkf7vIHlV4D_U-9to'; 
// provider 
var serverKey1 = 'AAAAPuQLOzM:APA91bH9_mEd6oSMV5eSB9SILCslz8sq564yPQoT0sTdmZ4yOCHv4DZWF8khDMf0i2P6jrvVBuOe0YLFHDdX1ml2v3-iiWMHA11eydRjtz98oleiE0JBdedvEDO3vvftxAgbmv1yQpTR'; 
var fcm = new FCM(serverKey);

var fcm1 = new FCM(serverKey1);



router.post("/s",async(req,res) =>{
    try{
      var reslt = await client.messages.create({ 
          body: "hi check form nodejs",
          from: "+17075874531",
          to: "+917447070365"
      });
     
     return res.json(reslt)
    }catch(err){
        return res.json(err)
    }    
});

// if (!providerpush.apps.length) {
    
    providerpush.initializeApp({
     credential: providerpush.credential.cert(serviceAccount)
    });
// }

const {
            sequelize,
            Sequelize, 
            User, 
            Lawn_size,
            Lawn_height,
            Bank_detail,
            Setting,
            Order,
            Service_period,
            Subcategory,
            Question,
            Cleanup,
            Fence,
            Admin,
            Transaction,
            Coupon,
            Equipment,
            Provider_equipment,
            Privacy_policy,
            Term,Faq,
            User_detail,
            Order_image,
            Color,
            Driveway,
            Sidewalk,
            Walkway,
            Corner_lot,
            Report,
            Reason,
            Option,
            Sidewals,
            Property,
            Review,
            Order_sidewalk,
            Order_walkway,
            Recurring_history,
            Tech_support,
            Declined_order,
            Refund_history,
           
                
} = require('../models');

const { json } = require('body-parser');
const category = require('../models/property');
const user = require('../models/user');
const image = require('../models/product_images');
const moment = require('moment');  
const product = require('../models/product');
const admin = require('../models/admin');
const { response } = require('express');
//const { where } = require('sequelize/types');

const Op = Sequelize.Op;

router.post('/login',async(req,res)=>{
    const {email,password,role}= req.body
    
    if(!email) return res.json({status:false,message:"Email is require"})
    if(!password) return res.json ({status:false,message:"Password is required"})
   

    try{
    
      const admin = await Admin.findOne({where:{email}})
   
      if(!admin) return res.json({status:false,message:"Email is wrong"});
      
      const match = await bcrypt.compare(password,admin.password)
      if(!match) return res.json({status:false,message:"password is wrong"})
  
      const token = jwt.sign({admin_id:admin.id},"aabbcc")
      return res.json({status:true,data:{token:token,admin_id:admin.id,name:admin.fristname+' '+admin.lastname,image:admin.image,address:admin.address,city:admin.city},message:"Login successfuly"})
  
    }catch(err){
      
       
        return res.json({status:false,message:"somthing is wrong"})
      
      }
  })





    

// add Lawn size

router.post('/lawn-size',accessToken,async(req,res)=>{
  const {name,price,seven_days_price,ten_days_price,fourteen_days_price}=req.body
 if(!name) return res.json({status:false,message:"name is require"})
 if(!price) return res.json({status:false,message:"price is require"})
 if(!seven_days_price) return res.json({status:false,message:"7 days price is require"})
 if(!ten_days_price) return res.json({status:false,message:"10 days price is require"})
 if(!fourteen_days_price) return res.json({status:false,message:"14 days price is require"})
  try{
      const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
      if(!admin) return res.json({status:false,message:"admin not found"})
      
        const match = await Lawn_size.findOne({where:{name:name,is_deleted:0}})
        if(match) return res.json({status:"false", message:"this lawn size name is already exist"})
        
      const lawnsize = await Lawn_size.create({
      name:name,
      price:price,
      seven_days_price,
      ten_days_price,
      fourteen_days_price
      });
     return res.json({status:true,message:"Lawn Size Added successfuly."})
    }catch(err){
      
        return res.json({status:false,message:"Something is wrong"});
    }
})


//update lawn size
  router.post('/update-lawn-size',accessToken,async(req,res)=>{
      
  const {size_id,name,price,seven_days_price,ten_days_price,fourteen_days_price}=req.body
  if(!size_id) return rtes.json({status:false,message:"size_id is require"})
  if(!name) return rtes.json({status:false,message:"name is require"})
//   if(!price) return rtes.json({status:false,message:"price is require"})
 try{
      const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
      if(!admin) return res.json({status:false,message:"admin not found"})
        
      const match = await Lawn_size.findOne({where:{name:name,id:{[Op.not]:size_id,is_deleted:0} }})
      if(match) return res.json({status:"false", message:"this lawn size name is already exist"})
      
      const lawnsize = await Lawn_size.findOne({where:{id:size_id}});
      lawnsize.name=name;
      lawnsize.price=price;
      lawnsize.fourteen_days_price=fourteen_days_price;
      lawnsize.seven_days_price=seven_days_price;
      lawnsize.ten_days_price=ten_days_price;
      lawnsize.save();
     return res.json({status:true,message:"Lawn Size Update successfuly."})
    }catch(err){
       
        return res.json({status:false,message:"Something is wrong"});
    }
})


// get-Lawn-size                  
  router.post('/getlawn-size',accessToken,async(req,res)=>{
 try{
      const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
      if(!admin) return res.json({status:false,message:"admin is deleted"})

      const lawnsize = await Lawn_size.findAll({where:{is_deleted:0}})
     return res.json({status:true,data:{lawnsize},message:"Show Lawn Size."})
    }catch(err){
        
        return res.json({status:false,message:"Something is wrong"});
    }
})


// ADD LAWN_HEIGHT


router.post('/lawn-height',accessToken,async(req,res)=>{
  const {name,price,seven_days_price,ten_days_price,fourteen_days_price}=req.body
  if(!name) return res.json({status:false,message:"name is require"})
  if(!price) return res.json({status:false,message:"price is require"})
//   if(!seven_days_price) return res.json({status:false,message:"seven_days_price is require"})
//   if(!ten_days_price) return res.json({status:false,message:"ten_days_price is require"})
//   if(!fourteen_days_price) return res.json({status:false,message:"fourteen_days_price is require"})
  try{
      
    const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
    if(!admin) return res.json({status:false,message:"admin is deleted"})
    
    const match = await Lawn_height.findOne({where:{name:name,is_deleted:0}})
    if(match) return res.json({status:"false", message:"this Lawn_height name is already exist"})
    
    const lawnheight= await Lawn_height.create({
    name:name,
    price:price,
    seven_days_price:0,
    ten_days_price:0,
    fourteen_days_price:0
    });
    return res.json({status:true,message:"Lawn Added successfuly."})
  }catch(err){
     
      return res.json({status:false,message:"Something is wrong"})
  }
})



//UPDATE LAWN_HEIGHT


router.post('/update-lawn-height',accessToken,async(req,res)=>{
//   const {lawn_id,name,price,seven_days_price,ten_days_price,fourteen_days_price}=req.body

const {lawn_id,name,price}=req.body  
  try{
      
    const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
    if(!admin) return res.json({status:false,message:"admin is deleted"})
    
       
     const match = await Lawn_height.findOne({where:{name:name,id:{[Op.not]:lawn_id,is_deleted:0} }})
     if(match) return res.json({status:"false", message:"this lawn height name is already exist"})
    
    const lawnheight = await Lawn_height.findOne({where:{id:lawn_id}});
    lawnheight.name=name;
    lawnheight.seven_days_price=0;
    lawnheight.ten_days_price=0;
    lawnheight.fourteen_days_price=0;
    lawnheight.price=price;
    lawnheight.save();
    
    return res.json({status:true,message:"Lawnheight Update successfuly."})
  }catch(err){
 
      return res.json({status:false,message:"Something is wrong"})
  }
})



//GET LAWN_HEIGHT


router.post('/getlawn-height',accessToken,async(req,res)=>{
 
  try{
      
    const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
    if(!admin) return res.json({status:false,message:"admin is deleted"})

    const lawnheight= await Lawn_height.findAll({where:{is_deleted:0}});
    return res.json({status:true,data:{lawnheight},message:"Lawn Height Show successfuly"})
  }catch(err){
      
      return res.json({status:false,message:"Something is wrong"})
  }
})


//add fences


router.post('/add-fences',accessToken,async(req, res)=> {
    const {name,price,seven_days_price,ten_days_price,fourteen_days_price}=req.body
    if(!name) return res.json({status:false,message:"fences height is require"})
    if(!price) return res.json({status:false,message:"price is require"})
    if(!seven_days_price) return res.json({status:false,message:"seven_days_price is require"})
    if(!ten_days_price) return res.json({status:false,message:"ten_days_price is require"})
    if(!fourteen_days_price) return res.json({status:false,message:"fourteen_days_price is require"})
    
    try{ 
      const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
      if(!admin) return res.json({status:false,message:"admin is deleted"})
        
      const match = await Fence.findOne({where:{name:name,is_deleted:0}})
      if(match) return res.json({status:"false", message:"this Fence name is already exist"})
      
      var fence = await Fence.create({
        name,
        price,
        ten_days_price,
        seven_days_price,
        fourteen_days_price,
       });
       // return res.json(fence)
       return res.json({status:true,message:'Fences Added successfuly.'});
     }catch(err){
        
    return res.json({status:false,message:'Something is wrong.'});
     }
   });
   
   
//get fences


router.post('/get-fences',accessToken,async(req, res)=> {
    
    try{ 
      const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
      if(!admin) return res.json({status:false,message:"admin is deleted"})

      var fence = await Fence.findAll({where:{is_deleted:0}});
      
       return res.json({status:true,data:{fence},message:'Fences Show successfuly.'});
     }catch(err){
        
    return res.json({status:false,message:'Something is wrong.'});
     }
   });
   
   
//  UPDATE fences

router.post('/update-fence',accessToken,async(req, res)=> {
        const {fence_id,name,price,seven_days_price,ten_days_price,fourteen_days_price}=req.body
        if(!fence_id) return res.json({status:false,message:"fence id is require"})
    try{ 
      const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
      if(!admin) return res.json({status:false,message:"admin is deleted"})
        
      const match = await Fence.findOne({where:{name:name, id:{[Op.not]:fence_id,is_deleted:0} }})
     if(match) return res.json({status:"false", message:"this fence name is already exist"})
      
      var fence = await Fence.findOne({where:{id:fence_id}});
        fence.name=name;
        fence.price=price;
        fence.seven_days_price=seven_days_price;
        fence.ten_days_price=ten_days_price;
        fence.fourteen_days_price=fourteen_days_price;
        fence.save();
      
       return res.json({status:true,message:'Update Fence successfuly.'});
     }catch(err){
        
    return res.json({status:false,message:'Something is wrong.'});
     }
   });



 //add COUPON


router.post('/add-coupon',accessToken,async(req, res)=> {
  const {name,type,discount,service,description,expiry_date}=req.body
  if(!name) return res.json({status:false,message:"name is require"})
  if(!type || type==0) return res.json({status:false,message:"type is require"})
  if(!discount) return res.json({status:false,message:"discount is require"})
  if(!service || service==0) return res.json({status:false,message:"service is require"})
  if(!description) return res.json({status:false,message:"description is require"})
  if(!expiry_date) return res.json({status:false,message:"expiry date is require "})
  try{
        //return res.json(req.user)
    const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
    if(!admin) return res.json({status:false,message:"admin not found"})
    
   
    const match = await Coupon.findOne({where:{name:name,is_deleted:0}})
    if(match) return res.json({status:"false", message:"this coupon name is already exist"})
    
    
     var coupon = await Coupon.create({
      name,
      type,
      discount,
      service,
      expiry_date,
      description
     });
           // return res.json(fence)
     return res.json({status:true,message:'Coupon Added .'});
   }catch(err){
      
  return res.json({status:false,message:'Something is wrong.'});
   }
 });



//GET COUPON

router.post('/show-coupon',accessToken,async(req,res)=> {
 try{

    const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
    if(!admin) return res.json({status:false,message:"admin not found."})

    const coupons = await Coupon.findAll({where:{is_deleted:0},order:[['id','desc']]})
//   return res.json(coupons)
    const coupon=[];
   
    
    for(var i=0; i<coupons.length; i++)
    {
        // if(coupons[i].type==1)
        // {type="Flat"}
        
        // if(coupons[i].type==2)
        // {type="Percent"}
       // var type = (coupons[i].type==1) ? "Flat": "Percent";
        
        // if(coupons[i].service==1)
        // {service="Lawn Mowing"}
        
        // if(coupons[i].service==2)
        // {service="Snow Plowing"}
       
        // if(coupons[i].service==3)
        // {service="Both"}
         
        coupon.push({
             id:coupons[i].id,
             name:coupons[i].name,
             type:coupons[i].type,
             service:coupons[i].service,
             discount:coupons[i].discount,
             expiry_date:coupons[i].expiry_date,
             description:coupons[i].description,
             is_deleted:coupons[i].is_deleted,
             createdAt:coupons[i].createdAt,
             updatedAt:coupons[i].updatedAt
        })
    }
      //return res.json(coupons)
    return res.json({status:true,data:{coupon},message:'Coupon List'});
   }catch(err){
      
     return res.json({status:false,message:'Something is wrong.'});
   }
 });


   //ADD SUB ADMIN




//   router.post('/add_subadmin',accessToken,async(req, res)=> {
//     const {firstname,lastname,brithday,contact,city,state,country}=req.body
//     if(!firstname) return res.json({status:false,message:"Enter your firstname"})
//     if(!lastname) return res.json({status:false,message:"Enter your Lastname"})
//     if(!brithday) return res.json({status:false,message:"Enter your brith date is require"})
//     if(!contact) return res.json({status:false,message:"Enter your contact number"})
//     if(!city) return res.json({status:false,message:"Enter your city"})
//     if(!state) return res.json({status:false,message:"Enter your state"})
//     if(!country) return res.json({status:false,message:"Select your country"})
  
//   try{
//       const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
//       if(!admin) return res.json({status:false,message:"admin is deleted"})

//       var subadmin = await Subadmin.create({
//       firstname,
//       lastname,
//       brithday,
//       contact,
//       city,
//       state,
//       country
//       });
//   // return res.json(fence)
//      return res.json({status:true,data:{subadmin},'message':'add successful'});
//   }catch(err){
//       
//   return res.json({status:false,message:'something is wrong.'});
//   }
//  });


 //transaction

//  router.post('/transaction',accessToken,async(req,res)=>{
//   // const{transaction_id,amount,admin_commision,payment_date,provider_amount,payment_status}=req.body

   
//   try{
//     const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
//     if(!admin) return res.json({status:false,message:"admin is deleted"})

//     const transaction = await Transaction.findAll()
//     return res.json({status:true,data:{transaction},message:"transactions data has been show"})

//       }catch(err){
//          
//         return res.json({status:false,message:"somthing is wrong"})
//         }
//  })


 //update admin details
 router.post('/update',accessToken,async(req,res)=>{
  const {fristname,lastname,gender,birthdate,address,city,state,country,email}=req.body
  try{
       const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
     if(!admin) return res.json({status:false,message:"admin not found"})
    
    

    if(!admin) return res.json({status:false,message:"user is deleted"})
      admin.fristname = fristname;
      admin.lastname=lastname;
      admin.gender=gender,
      admin.birthdate=birthdate,
      admin.address=address,
      admin.city=city,
    //admin.email=email,
      admin.state=state,
      admin.country=country
      admin.save()
   
  
  return res.json({status:true,message:"Data Updated"})
    
  }catch(err){
 
return res.json({status:false,message:"Something is wrong"})
}
})

//change-password ADMIN

router.post('/change-password',accessToken,async(req,res)=>{
    const {oldpassword,newpassword}=req.body
    if(!oldpassword) return res.json({status:false,message:"plz enter old password"})
    if(!newpassword) return res.json({status:false,message:"plz enter new password"})
    
            try{
            const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
            if(!admin) return res.json({status:false,message:"admin not found"})
            
            const match = await bcrypt.compare(oldpassword,admin.password)
            if(!match) return res.json({status:false,message:"password is wrong"})
            
            const hash = bcrypt.hashSync(newpassword,10)
            
            admin.password=hash
            admin.save()
        
             return res.json({status:true,message:"Password Has Been Change successful"})
        }catch(err){
            
            return res.json({status:false,message:"Something is wrongs"})
     
        }
  });





//terms and condition post

router.post('/terms',accessToken,async(req,res)=>{
  const {description}=req.body
  try{
    const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
    if(!admin)  return res.json({status:false,message:"admin not found"})
    
    var term = await Term.findOne({where:{id:1}});
    
    term.description = description;
    
    term.save();
   
    return res.json({status:true,message:"Term Added successfuly."})
  }catch(err){
     
    // return res.json(err)
    return res.json({status:false,message:"Something is wrong"})
  }
});


//terms and condition get

router.get('/terms',accessToken,async(req,res)=>{
  
  try{
    const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
    if(!admin)  return res.json({status:false,message:"admin is deleted"})
   
    const terms = await Term.findOne({where:{is_deleted:0}})
    return res.json({status:true,data:{terms},message:"Terms & Condition Show"})
  }catch(err){
     
    return res.json({status:false,message:"Something is wrong"})
  }
})


// FAQ post

router.post('/faq',accessToken,async(req,res)=>{
  const {title,description}=req.body
  try{
    const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
    if(!admin) return res.json({status:false,message:"amin is deleted"})


    var faq = await Faq.findOne({where:{id:1}});
    faq.title       = title;
    faq.description = description;
    faq.save();
    
    return res.json({status:true,message:"Faq Updated successfuly."})
  }catch(err){
     
    return res.json({status:false,message:"Something is wrong"})
  }
});



// FAQ get

router.get('/faq',accessToken,async(req,res)=>{
  try{
    const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
    if(!admin) return res.json({status:false,message:"Admin not found."})

    const faq = await Faq.findOne({where:{is_deleted:0}})
    return res.json({status:true,data:{faq},message:"Faq Data Show"})
  }catch(err){
     
    return res.json({status:false,message:"Something is wrong"})
  }
});


//privacy_policy post

router.post('/privacy-policy',accessToken,async(req,res)=>{
  const {description} =req.body 
  if(!description) return res.json({status:false,message:"description is required"})
  
  try{
    const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
    if(!admin) return res.json({status:false,message:"admin is deleted"})
    
    var pp = await Privacy_policy.findOne({where:{id:1}});
    pp.description = description;
    pp.save();
    
    return res.json({status:true,message:"Privacy Added successfuly."})
  }catch(err){
//    
  return res.json({status:false,message:"Something is wrong"})
}
});



//privacy_policy get
router.get('/privacy-policy',accessToken,async(req,res)=>{
  try{
    const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
    if(!admin) return res.json({status:false,message:"admin not found."})

    const privacy_policy = await Privacy_policy.findOne({where:{is_deleted:0}})
    return res.json({status:true,message:"Privacy-Policy Show",data:{privacy_policy}})
    
  }catch(err){
     
    return res.json({status:false,message:"Something is wrong"})
  }
});


//service-provider-details

router.post('/service-provider-details',accessToken,async(req,res)=>{
    const {provider_id}=req.body
    if(!provider_id) return res.json({status:false,message:"provider_id is require"})
    try{
    
        var admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:'admin not found.'});
             
        //   return res.json("okkd")
        const user = await User.findOne({
            where:{id:provider_id,role:2,is_deleted:0},
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
//   return res.json(user)
        if(!user) return res.json({statu:false,message:"Provider not found"})
 
         
         var equipment_data = [];
         var commercial   = [];
         var residential  = [];
         var snow_plowing = [];
         var lawnmowing="0";
         var snowplowing="0";
        //  return res.json(provider_equipment)
              
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
                
            
          
            for(var i=0; i<user.provider_equipment.length; i++)
            {
             equipment_data.push({
                 id:user.provider_equipment[i].equipment.id,
                 name:user.provider_equipment[i].equipment.name
              })
            // }
            //  return res.json(user.provider_equipment)
            
             
          
        // for(var i=0; i<user.provider_equipment.length; i++){
            
            if(user.provider_equipment[i].equipment.type==1){
                commercial.push({
                    id:user.provider_equipment[i].equipment.id,
                    name:user.provider_equipment[i].equipment.name
                });
            }
            
            if(user.provider_equipment[i].equipment.type==2){
                residential.push({
                     id:user.provider_equipment[i].equipment.id,
                     name:user.provider_equipment[i].equipment.name
                })
            }
            
            if(user.provider_equipment[i].equipment.type==0){
                snow_plowing.push({
                    id:user.provider_equipment[i].equipment.id,
                    name:user.provider_equipment[i].equipment.name  
                })
            }
        }
           
            
    //   return res.json("okk")
        // return res.json(equipment_data)
          
        // var equipment = equipment_data.map(function(item)
        // {
        // return item['name'];
        // });
         
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
            order_id:user.job_status[i].order_id,
            total_amount:user.job_status[i].provider_amount,
            job_done:service,
            details:status
          })
        }
      }
        
     
      
        var bank = await Bank_detail.findOne({where:{provider_id:provider_id,is_deleted:0}})
        
    //   return res.json(bank)
         var capsule = {
            firstname:user.fristname,
            lastname:user.lastname,
            bio:user.bio,
            dob:user.dob,
            image:user.image,
            email:user.email,
            mobile:user.mobile,
            address:user.address,
            status:user.status,
            document:(user.user_documents) ? user.user_documents:"",
            jobs:jobs,
            bank_name:(bank!=null) ? bank.bank_name :'' ,
            account_id:(user.account_id) ? user.account_id :"",//strip id
            strip_status:(user.account_id ==null) ? 0:1,
            account_number:(bank!=null) ? bank.account_number :"",
            routing_number:(bank!=null) ? bank.routing_number :"",
            ssn:(user.ssn) ? user.ssn:'' ,
            equipment_data: equipment_data,
            lawnmowing,
            snowplowing,
            commercial,
            residential,
            snow_plowing,
            street:user.street,
            city:user.city,
            zipcode:user.zip_code,
            state:user.state,

        }
        //  return res.json("skddsssd")
        
        return res.json({status:true,data:{capsule},message:"User Data Show"})
    }catch(err){
        // return res.json(err)
         
        return res.json({status:false,message:"Something is wrong"})
    }
})

    
//service provider list

router.post('/service-provider',accessToken,async(req, res)=> {
     try{

      const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
      if(!admin) return res.json({status:false,message:"admin not found"})
        
        // var pageAsNumber= Number.parseInt(req.query.page)
        // var sizeAsNumber= Number.parseInt(req.query.size)
        
         
          
        // var page=1
        // if(!Number.isNaN(pageAsNumber)&& pageAsNumber>1)
        // {
        //     page = pageAsNumber;
        // }
        
        // var size=10
        // if(!Number.isNaN(sizeAsNumber)&& sizeAsNumber>0 && sizeAsNumber<10)
        // {
        //     size=sizeAsNumber;
        // }

        // var provide = await User.findAndCountAll({
        //     where:{role:2,is_deleted:0,admin_approved:1,is_blocked:0},
        //     order:[['id','desc']],
        //     limit:size,
        //     offset:(page-1)*size,
          
        // });
        
        var providerRaw = await User.findAll({
            where:{role:2,is_deleted:0,admin_approved:1,is_blocked:0},
            order:[['id','desc']]
         });
       
        var provider = [];
        // var providerRaw=provide.rows;
        
        // return res.json(providerRaw)
        
        for(var i=0; i<providerRaw.length;i++)
        {
          
            provider.push({
                
                 id:providerRaw[i].id,
                 fristname:providerRaw[i].fristname,
                 lastname:providerRaw[i].lastname,
                 image:providerRaw[i].image,
                 email:providerRaw[i].email,
                 mobile:providerRaw[i].mobile,
                 role:providerRaw[i].role,
                 admin_approved:providerRaw[i].admin_approved,
                 city:providerRaw[i].city,
                 state:providerRaw[i].state,
                 zipcode:providerRaw[i].zip_code
               
            })
           
        }
        return res.json({status:true,data:{provider:provider},'message':'Provider List'});
        
        // return res.json({status:true,data:{provider:provider,total_page:Math.ceil(provide.count/size)},'message':'provider list'});
        
      }catch(err){
           
      return res.json({status:false,message:'Something is wrong.'});
      }
    });
    


    
//Transactions table

router.post('/transactions',accessToken,async(req,res)=>{
    try{
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
        
        
        // var pageAsNumber = Number.parseInt(req.query.page)
        // var sizeAsNumber = Number.parseInt(req.query.size)
        
        // var page =1;
        // if(!Number.isNaN(pageAsNumber) && pageAsNumber>1)
        // {
        //     page= pageAsNumber;
        // }
        // var size=10;
        // if(!Number.isNaN(sizeAsNumber) && sizeAsNumber>0 && sizeAsNumber<10)
        // {
        //     size=sizeAsNumber;
        // }
        // const transactionRoww = await Transaction.findAndCountAll({
        //         include:[
        //              {
        //                  model:User,
        //                  as:'user_details',
        //              }
                     
        //             ],
        //             order:[['id','desc']],
        //             limit:size,
        //             offset:(page-1)*size
        // })
        
        const transactionRow = await Transaction.findAll({
                where:{is_deleted:0},
                include:[
                     {
                         model:User,
                         as:'user_details',
                     },
                     {
                         model:Order,
                         as:'order',
                     }
                    ],
                    order:[['id','desc']]
            })
        
    //   return res.json(transactionRow)
     var transaction_details = [];
      
     for(let i=0 ; i<transactionRow.length ; i++)
     {
         
         
      if(transactionRow[i].payment_status==1)
      {transaction='Pending'}
     
      if(transactionRow[i].payment_status==2)
      {transaction='Success'} 
    //   return res.json('okk')
    //   var admin_commision = await Setting.findOne({where:{fild_key:'admin_commision',is_deleted:0}})
          transaction_details.push({
                    
                 id:transactionRow[i].id,
                 order_id:transactionRow[i].order_id,
                 transaction_id:(transactionRow[i].transaction_id)?transactionRow[i].transaction_id:"",
                 user_id:(transactionRow[i].user_details) ?transactionRow[i].user_details.id:'',
                 amount:transactionRow[i].amount,
                 payment_status:transaction,
                 name:(transactionRow[i].user_details) ? transactionRow[i].user_details.fristname+" "+transactionRow[i].user_details.lastname :'',
                 admin_commision:(transactionRow[i].admin_commision)?transactionRow[i].admin_commision:"0.00",
                //  provider_amount:120,//manualy add kiya h
                 payment_date:moment(transactionRow[i].createdAt).format('DD/MMM/YYYY'),
                 provider_amount:(transactionRow[i].order)? (transactionRow[i].order.total_amount - transactionRow[i].order.admin_fee + transactionRow[i].order.tip).toFixed(2):'00',
                 
            })
         
     }
        return res.json({status:true,data:{transaction_details},message:"Transactions Datas Show"})
        
        // return res.json({status:true,data:{transaction_details,total_page:Math.ceil(transactionRoww.count/size)}})
        
    }catch(err){
         
        return res.json({ststus:false,message:"Something wrong"})
    }
})

//GET PROFILE ADMIN

router.post('/get-profile',accessToken,async(req,res)=>{
    try{
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
        
        const admin_details= await Admin.findOne({where:{id:req.user.admin_id}})
        const admin_commissions= await Setting.findOne({where:{field_key:'admin_commission',is_deleted:0}})

        return res.json({status:true,data:{admin_details,admin_commissions},message:"Admin Profile Data"})
    }catch(err){
         
        return res.json({status:false,message:"Somethin wrong"})
    }
})

//GET ORDERS

router.post('/order',accessToken,async(req,res)=>{
    try{
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
            
        // var pageAsNumber = Number.parseInt(req.query.page)
        // var sizeAsNumber = Number.parseInt(req.query.size)
        
        // var page = 1;
        
        // if(!Number.isNaN(pageAsNumber) && pageAsNumber>1)
        // {
        //     page= pageAsNumber;
        // }
        
        // var size =10;
        
        // if(!Number.isNaN(sizeAsNumber) &&sizeAsNumber>0 && sizeAsNumber<10)
        // {
        //     size= sizeAsNumber;
        // }
        
        //      const order_detailsRaw = await Order.findAndCountAll({
        //       include:[
        //              {model:User,as:'user_details'},
        //              {model:User,as:'provider'}
        //             ],
        //             order:[['id','desc']],
        //             limit:size,
        //             offset:(page-1)*size
        //  })
        const order_details = await Order.findAll({
              where:{is_deleted:0,payment_status:2},    
              include:[
                     {model:User,as:'user_details'},
                     {model:User,as:'provider'}
                    ],
                    order:[['id','desc']]
                   
         })
    //   return res.json(order_details)
        var user_details = [];
        // var order_details=order_detailsRaw.rows;
        
        //  return res.json(order_details)  
        
        for(let i=0; i<order_details.length; i++)
        {
            
            if(order_details[i].status==1){
              var status = 'Pending';                
            }
            
            if(order_details[i].status==2){
                var status ='Accepted'
            }
            
             if(order_details[i].on_the_way==1 && order_details[i].on_the_way!='' && order_details[i].on_the_way!=null){
              var status='On The Way'    
            }
            
            if(order_details[i].at_location==1 && order_details[i].at_location!='' && order_details[i].at_location!=null){
              var status='Location Reached'    
            }
             if(order_details[i].started_job==1 && order_details[i].started_job!='' && order_details[i].started_job!=null){
              var status='Job Started'    
            }
            if(order_details[i].finished_job==1 && order_details[i].finished_job!=''&& order_details[i].finished_job!=null){
              var status='Job End'    
            }
           
            if(order_details[i].status==3){
                var status='Completed'
            }
            if(order_details[i].status==4){
                var status='Cancel'
            }
             var report = await Report.findOne({where:{order_id:order_details[i].order_id,is_deleted:0}})
              if(report!=null){
                 var status='Complete & Report'
             }
            
            
            
            if(order_details[i].service_type==1)
            {var service_type='One Time'}
            
            if(order_details[i].service_type==2)
            {var service_type='Recurring'}
            
            if(order_details[i].service_type==0)
            {var service_type='NA'}
            
            
            if(order_details[i].category_id==1)
            {var serviced='Lawn Mowing'}
            
            if(order_details[i].category_id==2)
            {var serviced='Snow plowing'}
            
            if(order_details[i].category_id==null)
            {var serviced='NA'}
            user_details.push({
                id:order_details[i].id,
                 order_id:order_details[i].order_id,
                 user_id:order_details[i].user_details==null ? '' : order_details[i].user_details.id,
                 service_types:service_type,
                 name:(order_details[i].user_details !=null) ? order_details[i].user_details.fristname+" "+order_details[i].user_details.lastname:'',
                 provider:order_details[i].provider==null ? 'Not Assigned' : order_details[i].provider.fristname+" "+order_details[i].provider.lastname,
                //service : order.service_type==1 ? "one time":"recurring",
                //  service:order_details[i].category_id==1 ? 'Lawn Mowing':'Snow plowing',
                 service:serviced,
                 total:order_details[i].grand_total==null ? "0.00": order_details[i].grand_total,
                 status,
                 order_date:moment(order_details[i].createdAt).format('MM/DD/YYYY'),
                
            })
        }
         
       //return res.json({status:true,data:{user_details,total_page:Math.ceil(order_detailsRaw.count/size)},message:"order-details"})
       
        return res.json({status:true,data:{user_details},message:"Order Details"})
        
    }catch(err){
         
        // return res.json(err)
        return res.json({status:false,message:"Somethin wrong"})
    }
})
 
//GET PENDING ORDERS

router.post('/past-due-jobs',accessToken,async(req,res)=>{
    try{
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
        
        var todayDate = moment().format('YYYY-MM-DD');
        //return res.json(todayDate)
        const order_details = await Order.findAll({
              where:{
                  is_deleted:0,
                  status:2,
                  payment_status:2,
                  at_location:1,
                  started_job:0,
                  finished_job:0,
                  [Op.and]:sequelize.where(sequelize.fn('date', sequelize.col('date')), '<', todayDate),
              },    
              include:[
                     {model:User,as:'user_details'},
                     {model:User,as:'provider'}
                    ],
                    order:[['id','desc']]
                   
         })
    //   return res.json(order_details)
        var user_details = [];
         
        
        for(let i=0; i<order_details.length; i++)
        {
            
            if(order_details[i].status==1){
              var status = 'Pending';                
            }
            
            if(order_details[i].status==2){
                var status ='Accepted'
            }
            
             if(order_details[i].on_the_way==1 && order_details[i].on_the_way!='' && order_details[i].on_the_way!=null){
              var status='On The Way'    
            }
            
            if(order_details[i].at_location==1 && order_details[i].at_location!='' && order_details[i].at_location!=null){
              var status='Location Reached'    
            }
             if(order_details[i].started_job==1 && order_details[i].started_job!='' && order_details[i].started_job!=null){
              var status='Job Started'    
            }
            if(order_details[i].finished_job==1 && order_details[i].finished_job!=''&& order_details[i].finished_job!=null){
              var status='Job End'    
            }
           
            if(order_details[i].status==3){
                var status='Completed'
            }
            if(order_details[i].status==4){
                var status='Cancel'
            }
             var report = await Report.findOne({where:{order_id:order_details[i].order_id,is_deleted:0}})
              if(report!=null){
                 var status='Complete & Report'
             }
            
            
            
            if(order_details[i].service_type==1)
            {var service_type='One Time'}
            
            if(order_details[i].service_type==2)
            {var service_type='Recurring'}
            
            if(order_details[i].service_type==0)
            {var service_type='NA'}
            
            
            if(order_details[i].category_id==1)
            {var serviced='Lawn Mowing'}
            
            if(order_details[i].category_id==2)
            {var serviced='Snow plowing'}
            
            if(order_details[i].category_id==null)
            {var serviced='NA'}
            user_details.push({
                id:order_details[i].id,
                 order_id:order_details[i].order_id,
                 user_id:order_details[i].user_details==null ? '' : order_details[i].user_details.id,
                 service_types:service_type,
                 name:(order_details[i].user_details !=null) ? order_details[i].user_details.fristname+" "+order_details[i].user_details.lastname:'',
                 provider:order_details[i].provider==null ? 'Not Assigned' : order_details[i].provider.fristname+" "+order_details[i].provider.lastname,
                //service : order.service_type==1 ? "one time":"recurring",
                //  service:order_details[i].category_id==1 ? 'Lawn Mowing':'Snow plowing',
                 service:serviced,
                 total:order_details[i].grand_total==null ? "0.00": order_details[i].grand_total,
                 status,
                 order_date:moment(order_details[i].createdAt).format('MM/DD/YYYY'),
                
            })
        }
         
       
       
        return res.json({status:true,data:{user_details},message:"Order Details"})
        
    }catch(err){
        console.log(err)
        // return res.json(err)
        return res.json({status:false,message:"Somethin wrong"})
    }
});


// Past Open Jobs

router.post('/past-open-jobs',accessToken,async(req,res)=>{
    try{
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
        
        var todayDate = moment().format('YYYY-MM-DD');
        //return res.json(todayDate)
        var order_details = await Order.findAll({
              where:{
                  is_deleted:0,
                  status:1,
                  assigned_to:0,
                  payment_status:2,
                  at_location:0,
                  started_job:0,
                  finished_job:0,
                  [Op.and]:sequelize.where(sequelize.fn('date', sequelize.col('date')), '<', todayDate),
              },    
              include:[
                     {model:User,as:'user_details'},
                     {model:User,as:'provider'}
                    ],
                    order:[['id','desc']]
                   
         })
    //   return res.json(order_details)
        var user_details = [];
         
        
        for(let i=0; i<order_details.length; i++)
        {
            
            if(order_details[i].status==1){
              var status = 'Pending';                
            }
            
            if(order_details[i].status==2){
                var status ='Accepted'
            }
            
             if(order_details[i].on_the_way==1 && order_details[i].on_the_way!='' && order_details[i].on_the_way!=null){
              var status='On The Way'    
            }
            
            if(order_details[i].at_location==1 && order_details[i].at_location!='' && order_details[i].at_location!=null){
              var status='Location Reached'    
            }
             if(order_details[i].started_job==1 && order_details[i].started_job!='' && order_details[i].started_job!=null){
              var status='Job Started'    
            }
            if(order_details[i].finished_job==1 && order_details[i].finished_job!=''&& order_details[i].finished_job!=null){
              var status='Job End'    
            }
           
            if(order_details[i].status==3){
                var status='Completed'
            }
            if(order_details[i].status==4){
                var status='Cancel'
            }
             var report = await Report.findOne({where:{order_id:order_details[i].order_id,is_deleted:0}})
              if(report!=null){
                 var status='Complete & Report'
             }
            
            
            
            if(order_details[i].service_type==1)
            {var service_type='One Time'}
            
            if(order_details[i].service_type==2)
            {var service_type='Recurring'}
            
            if(order_details[i].service_type==0)
            {var service_type='NA'}
            
            
            if(order_details[i].category_id==1)
            {var serviced='Lawn Mowing'}
            
            if(order_details[i].category_id==2)
            {var serviced='Snow plowing'}
            
            if(order_details[i].category_id==null)
            {var serviced='NA'}
            user_details.push({
                id:order_details[i].id,
                 order_id:order_details[i].order_id,
                 user_id:order_details[i].user_details==null ? '' : order_details[i].user_details.id,
                 service_types:service_type,
                 name:(order_details[i].user_details !=null) ? order_details[i].user_details.fristname+" "+order_details[i].user_details.lastname:'',
                 provider:order_details[i].provider==null ? 'Not Assigned' : order_details[i].provider.fristname+" "+order_details[i].provider.lastname,
                //service : order.service_type==1 ? "one time":"recurring",
                //  service:order_details[i].category_id==1 ? 'Lawn Mowing':'Snow plowing',
                 service:serviced,
                 total:order_details[i].grand_total==null ? "0.00": order_details[i].grand_total,
                 status,
                 order_date:moment(order_details[i].createdAt).format('MM/DD/YYYY'),
                
            })
        }
         
       
       
        return res.json({status:true,data:{user_details},message:"Order Details"})
        
    }catch(err){
        console.log(err)
        // return res.json(err)
        return res.json({status:false,message:"Somethin wrong"})
    }
});
 
 
//  //GET USERS

router.post('/users',accessToken,async(req,res)=>{
    try{
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
        
        //  //pagination
        //  var pageAsNumber = Number.parseInt(req.query.page);
        //  var sizeAsNumber = Number.parseInt(req.query.size);
       
        //   var page = 0;
          
        //   if(!Number.isNaN(pageAsNumber) && pageAsNumber > 0 ){
        //      page = pageAsNumber; 
        //   }
          
        //   var size = 10;
        //   if(!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 10){
        //       size = sizeAsNumber;
        //   }
          
        //   const userRaw = await User.findAndCountAll({
        //     where:{role:1,is_deleted:0,is_blocked:0},
        //     order:[['id','desc']],
        //     limit:size,
        //     offset:page*size,
            
        // })
        
        
         const user = await User.findAll({
            where:{role:1,is_deleted:0,status:1,is_blocked:0},
            order:[['id','desc']]
            
        })
       
        // return res.json(user)
        var user_details=[];
        //var user = userRaw.rows;
        for(var i=0; i<user.length; i++)
        {
            user_details.push({
                
             id:user[i].id,
             name:user[i].fristname+" "+user[i].lastname,
             email:user[i].email,
             mobile:user[i].mobile,
             status:user[i].status,
             city:user[i].city,
             state:user[i].state,
             is_blocked:user[i].is_blocked,
             
            })
        }
        // return res.json({status:true,data:{user_details,total_page:Math.ceil(userRaw.count/size)},message:"users-details"})
        return res.json({status:true,data:{user_details},message:"Users Details"})
    }catch(err){
         
        return res.json({status:false,message:"Somethin wrong"})
    }
})


//user profile 
router.post('/user-profile',accessToken,async(req,res)=>{
   
    const {user_id}= req.body;
    if(!user_id) return res.json({status:false,message:"enter user_id"})
    
    try{
        
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
        
        const user = await User.findOne({where:{id:user_id,is_deleted:0}})
        const order = await Order.findAll({
            where:{user_id:user_id,payment_status:2},
            order:[['id','desc']]
            
        })
        
        var orders =[];
        
        for(let i=0;i<order.length;i++)
        {
            
            if(order[i].status==1){
              var status = 'Pending';                
            }
            
            if(order[i].status==2){
                var status ='Accepted'
            }
            
            if(order[i].status==3){
                var status='Completed'
            }
            
            
            
           orders.push({
                         id:order[i].order_id,
                         order_date:moment(order[i].date).format('DD/MMM/YYYY'),  
                         status:status,
                        })
        }
        
        const property = await Property.findAll({where:{user_id:user_id,is_deleted:0}})
        // return res.json(property)
        return res.json({status:true,data:{user,property,orders},message:"User Profile And Orders Data Show"})
    }catch(err){
         
        return res.json({status:false,message:"Something is wrong"})
    }
})
    

//after order complete order details
    
router.post('/user-order-details',accessToken,async(req,res)=>{
    const { order_id }=req.body
    //if(!user_id) return res.json({status:false,message:"user_id is require"})
      if(!order_id) return res.json({status:false,message:"Order_id is require"})
    
    try{
        
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"Admin not found"})
         
         
         const order = await Order.findOne({
            where:{order_id,payment_status:2},
          include:[
                      {model:User,as:'provider'},
                      {model:Lawn_size ,as:'lawn_size'},
                      {model:Lawn_height,as:'lawn_height'},
                      {model:User,as:'user_details'},
                      {model:Fence,as:'fence'},
                      {model:Cleanup,as:'cleanup'},
                      {
                          model:Order_sidewalk,as:'order_sidewalks',
                          include:[{model:Sidewalk,as:"sidewalk"}],
                        //   where:{is_deleted:0}
                      },
                      {
                          model:Order_walkway,as:'order_walkways',
                          include:[
                              {
                                  model:Walkway,as:'walkway'
                              }],
                      },
                      {
                          model:Recurring_history,as:'recurring_view'
                      },
                       
                      {model:Subcategory,as:"subcategory"},
                      {model:Color,as:"color"},
                      {model:Transaction,as:'transaction_details'},
                      {model:Refund_history,as:'refund_histories'},
                     ]
          })
// return res.json(order)
   if(!order) return res.json({status:false,message:"Order id not exist"})
   
         
            if(order.status==1){
              var status = 'Pending';                
            }
            if(order.provider_assigned_date!=null)
            {
                var status='Provider Assigned'
            }
            if(order.status==2){
                var status ='Accepted'
            }
           
            if(order.on_the_way==1 && order.on_the_way!='' && order.on_the_way!=null){
              var status='On The Way'    
            }
            
            if(order.at_location==1 && order.at_location!='' && order.at_location!=null){
              var status='Location Reached'    
            }
             if(order.started_job==1 && order.started_job!='' && order.started_job!=null){
              var status='Job Started'    
            }
            if(order.finished_job==1 && order.finished_job!=''&& order.finished_job!=null){
              var status='Job End'    
            }
            
            if(order.status==3){
                var status='Completed'
            }
             if(order.paid_to_provider==1){
                var status='Provider amount paid'
            }
            
            if(order.status==4){
               var status='Cancel'
              }
           
            
           
            if(order.category_id==1)
            {var services="Lawn Mowing"}
            
            if(order.category_id==2)
            {var services="Snow Plowing"}
            
            if(order.category_id=='')
            {var services="NA"}
            
            
            
            if(order.service_type==1)
            {var serviced="One Time"}
            if(order.service_type==2)
            {var serviced="Recurring"}
            if(order.service_type==0)
            {var serviced=""}
          
             var amountRefund_status=0;
            if(order.refund_histories!=null && order.refund_histories.status=='succeeded')
               {
                var amountRefund_status=1;
               }
            
         
             var before_order_image = await Order_image.findAll({where:{order_id:order.order_id,type:'before',is_deleted:0}});
             var after_order_image = await Order_image.findAll({where:{order_id:order.order_id,type:'after',is_deleted:0}});
             var fences_price= await Service_period.findOne({where:{type:order.service_type,is_deleted:0}});
             
             var reviews= await Review.findOne({where:{user_id:order.user_id,provider_id:order.assigned_to,order_id:order.order_id,is_deleted:0}});
             if(reviews!=null){
             var review=reviews.rating;
             var comment=reviews.comment;
             
             }
              
            
             
               var report = await Report.findOne({where:{order_id,is_deleted:0}})
             
             if(report!=null){
                 var status='Reported'
             var reason_id= report.question_id.split(",")
             var reasons=[]
            // //var res = await Reason.findOne({where:{is_deleted:0,id:reason_id[0]}})
            //  return res.json(reason_id)
              
             for(var i=0; i<reason_id.length; i++)
             {
                var ress = await Reason.findOne({where:{is_deleted:0,id:reason_id[i]}})
                   
                   if(ress){
                    reasons.push({
                     reason_id:ress.id,
                     reason:ress.reason,
                 })
                   }
                  
             }
             }
            
              
             var property_image= await Property.findOne({where:{id:order.property_id,is_deleted:0}});
           
            //  var commission= await Setting.findOne({where:{field_key:"admin_commission",is_deleted:0}});
            
            //  var commision_value= parseFloat(commission.field_value)/100*order.total_amount
             
          
             
             const side=[];
             for(let j=0; j<order.order_sidewalks.length ; j++)
             {
                 side.push({
                     amount:order.order_sidewalks[j].amount,
                     size:order.order_sidewalks[j].sidewalk.name
                 })
             }
             
             const walk=[]
             if(order.order_walkways!=null){
             for(let i=0; i<order.order_walkways.length; i++)
             {
                 walk.push({
                     amount:order.order_walkways[i].amount,
                     size:order.order_walkways[i].walkway.name
                 })
             }
             }
             
             var discounts='';
             if(order.coupon_type==1)
             { discounts="Flat"}
             if(order.coupon_type==2)
             { discounts="Percentage"}
            //  const sidewalks_name=[]
            // if(order.order_sidewalks!=null){
            //      for(i=0;i<order.order_sidewalks.length;i++){
            //          sidewalks_name.push({
            //              sidewalk_size:order.order_sidewalks[i].sidewalk.name
            //          })
            //      }
            //   }
            //  return res.json(property_image)
            
            
           
               
      
        if(order.transaction_details!==null)
        {
            var commision_per = (order.transaction_details.admin_commision / order.transaction_details.amount) *100
        
        }
            
          var order_details ={
              order_id:order.order_id,
            //   date:moment(order.date).format('MM/DD/YYYY'),
            //   time:moment(order.date).format('ha z'),
              status:status,
              service:services,
              sub_total:order.total_amount,
              grand_total:order.grand_total,
              
              provider_id:(order.provider) ? order.provider.id:'',
              provider_name:(order.provider) ? order.provider.fristname+" "+order.provider.lastname:'',
              
              user_id:(order.user_details) ? order.user_details.id : '',
              user_name:(order.user_details) ? order.user_details.fristname+" "+order.user_details.lastname:'',
              mobile:(order.provider) ? order.provider.mobile:'',
              address:(order.provider) ? order.provider.address:'',
              service_delivery:serviced,
              
              user_rating:(review) ? review :"0",
              user_comment:(comment) ? comment: '',
              
              
              report_status:(report!=null) ? 1:0,
              report_date:(report!=null) ? moment(report.createdAt).format('MM/DD/YYYY'):'',
              report_time:(report!=null) ? moment(report.createdAt).format('LT'):'',
              report_comment:(report) ? report.report:'',
              report_reason:(reasons) ? reasons :[],
              
              report_img1:(report) ? report.img_1:'',
              report_img2:(report) ? report.img_2:'',
              report_img3:(report) ? report.img_3:'',
              
             
              
              lawnsizeid:(order.lawn_size !=null) ? order.lawn_size.id :0.00,
              lawnsize:(order.lawn_size!=null) ? order.lawn_size.name :'',
              lawnheightid:(order.lawn_height!=null) ? order.lawn_height.id :0.00,
              lawnheight:(order.lawn_height!=null) ? order.lawn_height.name :'',
              
              img1:(order.img1) ? order.img1:'',
              img2:(order.img2) ? order.img2:'',
              img3:(order.img3) ? order.img3:'',
              img4:(order.img4) ? order.img4:'', 
              
              property_image:(property_image) ? property_image.image:'',
              property_address:(property_image) ? property_image.address:'',
              before_image:(before_order_image.length> 0) ? before_order_image:[],
              after_image:(after_order_image.length > 0) ? after_order_image:[],
              
            // fence_price:(fences_price) ? fences_price.price:"0.00",
            
              fence_price:(order.fence_amount)?(order.fence_amount):0,
              fencesize:(order.fence!=null) ? order.fence.name :'NA',
              
              cleanup_price:(order.cleanup_amount) ? order.cleanup_amount:"0.00",
              corner_lot_price:(order.corner_lot_amount)?order.corner_lot_amount:"0.00",
              
              admin_fee:(order.admin_fee)?order.admin_fee:"0.00",
              tax_price:(order.tax)?order.tax:"0.00",
              
              yardname:(order.cleanup!=null) ? order.cleanup.name :'NA',
              carnumber:(order.car_number) ? order.car_number:'NA',
              driveway_price:(order.driveway_amount) ? order.driveway_amount:"0.00",
              
             //walkway_price:(order.walkway_amount) ? order.walkway_amount:"0",
             
             
              sideway_amount_size:(side.length>0)? side:[],
              walkway_amount_size:(walk.length>0)? walk:[],
              lawnsize_price:(order.lawn_size_amount)?order.lawn_size_amount:"0.00",
              lawnheight_price:(order.lawn_height_amount)?order.lawn_height_amount:"0.00",
              
            //cornerlot_price:(order.corner_lot_amount) ? order.corner_lot_amount:"0",
              car_type:(order.subcategory)? order.subcategory.name :"NA",
              car_price:(order.subcategory)? order.subcategory.price :"0",
              car_color:(order.color)?order.color.name:"NA",
              category:(order.service_for)?order.service_for:"NA",
              
              discount_type:discounts,
              discount:(order.discount_value)?order.discount_value:0.00,
              discount_rs:(order.discount_amount)?order.discount_amount:0.00,
              tax_rate:(order.tax_perc>0)?order.tax_perc:0.00,
              
              tip:(order.tip)?order.tip:0.00,
              amountRefund_status:amountRefund_status,
                
             
              on_the_way:(order.on_the_way)?order.on_the_way:0,
              location_reached:(order.at_location)?order.at_location:0,
              started_job:(order.started_job)?order.started_job:0,
              end_job:(order.finished_job)?order.finished_job:0,
              job_completed:(order.status==3)?1:0,
              
              customer_instruction:(order.instructions)?order.instructions:'NA',
              
            //   admin_commission:(commission.field_value)?commission.field_value:0, 
            //   admin_commission_price:(commision_value)?commision_value.toFixed(1):0,
            
             admin_commission:(commision_per) ? commision_per:0,//% he 
             admin_commission_price:(order.transaction_details!==null)?order.transaction_details.admin_commision.toFixed(1):0,//rs. he 
              
             on_demand_fee:(order.on_demand_fee)?order.on_demand_fee:0,
              
             schedule_date:moment(order.date).format('MM/DD/YYYY'),//order date he
            //   time:moment(order.createdAt).format('LT'),//order time 
            
              provider_assigned:(order.assigned_to) ? 1:0,
              paid_to_provider_status:(order.paid_to_provider==1) ? 1:0,
              
            //   provider_assigned:(order.provider.)
              
              gate_code:(order.gate_code) ? order.gate_code: '',
              
              payment_successful:(order.payment_status==2) ? 1:0,
              coupon_code:(order.coupon_code) ? order.coupon_code:'NA',
              
              recurring_days:(order.recurring_view) ? order.recurring_view.on_every+' '+"Days":"NA",
         
              
            //   provider_amount:(provider_am) ? provider_am.toFixed(1):'', 
              provider_amount:(order.provider_amount) ? order.provider_amount:0,
              provider_assigned_date:(order.provider_assigned_date!=null) ? moment(order.provider_assigned_date).format('MM/DD/YYYY'):'',
              provider_assigned_time:(order.provider_assigned_date!=null) ? moment(order.provider_assigned_date).format('LT'):'',
              
              transaction_id:(order.transaction_details!=null) ? order.transaction_details.transaction_id:'',
              payment_date:(order.transaction_details!=null) ? moment(order.transaction_details.updatedAt).format('MM/DD/YYYY'):'',
              payment_time:(order.transaction_details!=null) ? moment(order.transaction_details.updatedAt).format('LT'):'',
              
              on_the_way_date:(order.on_the_way_date!=null) ? moment(order.on_the_way_date).format('MM/DD/YYYY'):'',
              on_the_way_time:(order.on_the_way_date!=null) ? moment(order.on_the_way_date).format('LT'):'',
              
              at_location_date:(order.at_location_date!=null) ? moment(order.at_location_date).format('MM/DD/YYYY'):'',
              at_location_time:(order.at_location_date!=null) ? moment(order.at_location_date).format('LT'):'',
              
              started_job_date:(order.started_job_date!=null) ? moment(order.started_job_date).format('MM/DD/YYYY'):'',
              started_job_time:(order.started_job_date!=null) ? moment(order.started_job_date).format('LT'):'',
              
              
              finished_job_date:(order.finished_job_date!=null) ? moment(order.finished_job_date).format('MM/DD/YYYY'):'',
              finished_job_time:(order.finished_job_date!=null) ? moment(order.finished_job_date).format('LT'):'',
              
              cancel_order_date:(order.cancel_order_date!=null) ? moment(order.cancel_order_date).format('MM/DD/YYYY'):'',
              cancel_order_time:(order.cancel_order_date!=null) ? moment(order.cancel_order_date).format('LT'):'',
              
              
              completed_date:(order.status==3) ? moment(order.updatedAt).format('MM/DD/YYYY'):'',
              completed_time:(order.status==3) ? moment(order.updatedAt).format('LT'):'',
              
              provider_change_status: (order.change_provider_assigned_date!=null) ? 1:0,
              change_provider_assigned_date:(order.change_provider_assigned_date!=null) ? moment(order.change_provider_assigned_date).format('MM/DD/YYYY'):'',
              change_provider_assigned_time:(order.change_provider_assigned_date!=null) ? moment(order.change_provider_assigned_date).format('LT'):'',
            }
       
        // return res.json(data)
        
        return res.json({status:true,data:{order_details},message:"Order Details"})
       
    }catch(err){
         
         return res.json(err)
        return res.json({status:false,message:"something is wrong"})
    }
})
//delete user
router.post('/delete-user',accessToken,async(req,res)=>{
  const {user_id}=req.body
  if(!user_id) return res.json({stats:false,message:"user_id is required"})
  try{
       const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
      if(!admin) return res.json({status:false,message:"admin not found"})
      
      var delete_user = await User.findOne({where:{id:user_id}})
      delete_user.is_deleted=1
      delete_user.save()
     
      // return res.json(delete_user)
       return res.json({status:true,message:"User Is Deleted"})
  }catch(err){
       
      return res.json({status:false,meaasge:"Something wrong"})
  }
})


//delete provider
router.post('/delete-provider',accessToken,async(req,res)=>{
  const {provider_id}=req.body
  
  if(!provider_id) return res.json({stats:false,message:"provider_id is required"})
  try{
       const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
      if(!admin) return res.json({status:false,message:"admin not found"})
      
      var delete_provider = await User.findOne({where:{id:provider_id}})
      delete_provider.is_deleted=1
      delete_provider.save()
     
      
       return res.json({status:true,message:"Provider Is Deleted"})
  }catch(err){
       
      return res.json({status:false,meaasge:"Something wrong"})
  }
})

//delete lawnsize

router.post('/delete-lawnsize',accessToken,async(req,res)=>{
  const {lawnsize_id}=req.body
  
  if(!lawnsize_id) return res.json({stats:false,message:"lawnsize_id is required"})
  try{
       const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
      if(!admin) return res.json({status:false,message:"admin not found"})
    
      var delete_lawnsize = await Lawn_size.findOne({where:{id:lawnsize_id}})
      delete_lawnsize.is_deleted=1
      delete_lawnsize.save()
      
     await Cleanup.update({is_deleted:1},{where:{lawn_size_id:lawnsize_id}});
         
      
       return res.json({status:true,message:"Lawnsize Is Deleted"})
  }catch(err){
       
      return res.json({status:false,meaasge:"Something wrong"})
  }
})

//delete lawn height

router.post('/delete-lawnheight',accessToken,async(req,res)=>{
    const {lawnheight_id}=req.body
    if(!lawnheight_id) return res.json({status:false,message:"lawnheight_id is require"})
    try{
         const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
        
        var  delete_lawnheight=await Lawn_height.findOne({where:{id:lawnheight_id}})
        
        delete_lawnheight.is_deleted=1
        
        delete_lawnheight.save()
        
        
          return res.json({status:true,message:"Lawn height Is Deleted"})
        
    }catch(err){
         
        return res.json({status:false,message:"Something is wrong"})
    }
})

//add yard cleanup

  router.post('/yard-cleanup',accessToken,async(req,res)=>{
  const {capsule}=req.body
//   return res.json(capsule)
    
//   if(!name) return res.json({status:false,message:"Name is require"})
 
  try{
      
      
      const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
      if(!admin) return res.json({status:false,message:"admin not found"})
    
    
     var data = (capsule[0].name);
     var check = await Cleanup.findOne({where:{name:data,is_deleted:0}});
    //   return res.json(check)
    
    // function isLetter(c) {
    //  return c.toLowerCase() != c.toUpperCase();
    //   }
    if(check!=null){
     if(data==check.name) return res.json({status:false,message:"This cleanup type is already exist"})
    }
    //   return res.json('okk')
     for(var i=0; i<capsule.length; i++)
     {
      var lsize = await Lawn_size.findOne({where:{is_deleted:0,id:capsule[i].lawn_size_id}})
     // if(!lsize) return res.json({status:false,message:'Lawn size id not match'})
      
          if(lsize){
                await Cleanup.create({
                 
                lawn_size_id:capsule[i].lawn_size_id,
                price:parseFloat(capsule[i].price),
                name:capsule[i].name
            
              });    
          }
       
     }
    
     return res.json({status:true,message:" Yard Cleanup Added successfuly."})
     
    }catch(err){
         
        return res.json({status:false,message:"Something is wrong"});
    }
  })

// get yard cleanup     

  router.post('/getyard-cleanup',accessToken,async(req,res)=>{
      
 try{
      const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
      if(!admin) return res.json({status:false,message:"admin is deleted"})

    //   const yard_clean = await Cleanup.findAll({
    //       where:{is_deleted:0},
    //       order:[['id','desc']]
          
    //   })
    //   var yard_cleanup=[];
    //   return res.json(yard_clean)
    
    //   for(i=0; i<yard_clean.length; i++)
    //   {  
    //         yard_cleanup.push({
    //         name:yard_clean[i].name,
    //         })
    //   }
     
     var lawn = await Lawn_size.findAll({where:{is_deleted:0},order:[['id','asc']]});
    //  var cleanup=await Cleanup.findAll({where:{is_deleted:0}});
    // return res.json({cleanup,lawn})
    //  var pricebox=[];
     var lawn_size=[{size:'Cleanup Type'}];
     
     for(var i=0; i<lawn.length; i++)
     {
         
         lawn_size.push({
            
             size:lawn[i].name,
             id:lawn[i].id
            
         })
         
        //  for(j=0; j<cleanup.length; j++)
        //  {
        //      if(lawn[i].id==cleanup[j].lawn_size_id)
        //     {
                
        //         pricebox.push({
        //             price:cleanup[j].price,
        //         })
        //         // return res.json("okk")
                
        //     }
        //     else{
        //         pricebox.push({
        //             price:0.00,
        //         })
        //     }
           
        //     }
         
         
         
     }
     
     
     
     return res.json({status:true,data:{lawn_size},message:"Show Yard Cleanup"})
    }catch(err){
         
        return res.json({status:false,message:"Something is wrong"});
    }
})


//update yard cleanup
  router.post('/update-yardcleanup',accessToken,async(req,res)=>{
  
  const {cleanup_id,name,price,seven_days_price,ten_days_price,fourteen_days_price}=req.body
 if(!cleanup_id) return res.json({status:false,message:"cleanup id is require"})
 if(!name) return res.json({status:false,message:"name id is require"})
 if(!price) return res.json({status:false,message:"price id is require"})
 try{
      const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
      if(!admin) return res.json({status:false,message:"admin not found"})
        
        
     const match = await Cleanup.findOne({where:{name:name,id:{[Op.not]:cleanup_id,is_deleted:0}}})
     if(match) return res.json({status:"false", message:"This cleanup name is already exist"})
     
      const yard_cleanup = await Cleanup.findOne({where:{id:cleanup_id}});
       //return res.json(yard_cleanup)
       yard_cleanup.name=name;
       yard_cleanup.price=price;
       yard_cleanup.seven_days_price=seven_days_price;
       yard_cleanup.ten_days_price=ten_days_price;
       yard_cleanup.fourteen_days_price=fourteen_days_price;
       yard_cleanup.save();
      
     return res.json({status:true,message:"Yard Cleanup Update successfuly."})
    }catch(err){
         
        return res.json({status:false,message:"Something is wrong"});
    }
})



//delete YARD 
router.post('/delete-yardcleanup',accessToken,async(req,res)=>{
  const {cleanup_id}=req.body
  
  if(!cleanup_id) return res.json({stats:false,message:"cleanup_id is required"})
  
  try{
       const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
      if(!admin) return res.json({status:false,message:"admin not found"})
      
      var delete_cleanup = await Cleanup.findOne({where:{id:cleanup_id}})
      delete_cleanup.is_deleted=1
      delete_cleanup.save()
     
      // return res.json(delete_cleanup)
       return res.json({status:true,message:" Yard Cleanup Is Deleted"})
  }catch(err){
       
      return res.json({status:false,meaasge:"Something wrong"})
  }
})


//update coupon

  router.post('/update-coupon',accessToken,async(req,res)=>{
  
  const {coupon_id,name,type,discount,service,description,expiry_date}=req.body
  
  if(!coupon_id) return res.json({status:false,message:"coupon_id is require"});
//   if(!name) return res.json({status:false,message:"name is require"});
//   if(!type || type==0) return res.json({status:false,message:"type is require"});
//   if(!discount) return res.json({status:false,message:"discount is require"});
//   if(!service || service==0) return res.json({status:false,message:"service is require"});
//   if(!description) return res.json({status:false,message:"description is require"});
//   if(!expiry_date) return res.json({status:false,message:"expiry date is require "});
 try{
      const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
      if(!admin) return res.json({status:false,message:"admin not found"})
   
     const match = await Coupon.findOne({where:{name:name,id:{[Op.not]:coupon_id,is_deleted:0}}})
     if(match) return res.json({status:"false", message:"this Coupon name is already exist"})
    
      const coupon = await Coupon.findOne({where:{id:coupon_id}});
       //return res.json(yard_cleanup)
       coupon.name=name;
       coupon.type=type;
       coupon.discount=discount;
       coupon.expiry_date=expiry_date;
       coupon.service=service;
       coupon.description=description;
       coupon.save();
      
     return res.json({status:true,message:"Coupon Update successfuly."})
    }catch(err){
         
        return res.json({status:false,message:"Somthing is wrong"});
    }
})


//delete coupon
router.post('/delete-coupon',accessToken,async(req,res)=>{
  const {coupon_id}=req.body
  
  if(!coupon_id) return res.json({stats:false,message:"coupon_id is required"})
  
  try{
       const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
      if(!admin) return res.json({status:false,message:"admin not found"})
      
      var delete_coupon = await Coupon.findOne({where:{id:coupon_id}})
      delete_coupon.is_deleted=1
      delete_coupon.save()
     
       //return res.json(delete_coupon)
       return res.json({status:true,message:"Coupon Is Deleted"})
  }catch(err){
       
      return res.json({status:false,meaasge:"Something wrong"})
  }
})



 //BLOCK-UNBLOCK USERS

router.post('/block-unblock-users',accessToken,async(req,res)=>{
    const {user_id,is_blocked}=req.body
    
    if(!user_id) return res.json({status:false,mesage:"user id is require"});
    if(is_blocked ==='') return res.json({status:false,mesage:"is blocked is require"});
    
    try{
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
        
        const user= await User.findOne({where:{id:user_id}})
        
            user.is_blocked=is_blocked;
            user.save();
     
        
       var mess = (user.is_blocked==1) ? "User Is Block" : "User Is Unblock"
        return res.json({status:true,message:mess})
    }catch(err){
         
        return res.json({status:false,message:"Somethin wrong"})
    }
})


 //GET BLOCK USERS list

router.post('/block-users',accessToken,async(req,res)=>{
    try{
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
        
         //pagination
        
        //  var pageAsNumber = Number.parseInt(req.query.page);
        //  var sizeAsNumber = Number.parseInt(req.query.size);
       
        //   var page = 1;
         
        //  if(!Number.isNaN(pageAsNumber) && pageAsNumber > 1 ){
        //      page = pageAsNumber; 
        //   }
          
        //   var size = 10;
        //   if(!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 10){
        //       size = sizeAsNumber;
        //   }
        
        // const userRow = await User.findAndCountAll({
        //     where:{role:1,is_deleted:0,is_blocked:1},
        //     order:[['updatedAt','desc']],
        //     limit:size,
        //     offset:(page-1)*size,
            
        // })
         
        const user = await User.findAll({
            where:{role:1,is_deleted:0,is_blocked:1},
            order:[['updatedAt','desc']]
           
            
        })
        
        var user_details=[];
        // var user = userRaw.rows;
       
        for(var i=0; i<user.length; i++)
        {
            user_details.push({
                
             id:user[i].id,
             name:user[i].fristname+" "+user[i].lastname,
             email:user[i].email,
             mobile:user[i].mobile,
             status:user[i].status,
             is_blocked:user[i].is_blocked,
             
            })
        }
       return res.json({status:true,data:{user_details},message:"Block Details"})
        // return res.json({status:true,data:{user_details,total_page:Math.ceil(userRaw.count/size)},message:"block-details"})
    }catch(err){
         
        return res.json({status:false,message:"Somethin wrong"})
    }
})



//ADD USERS


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // cb(null,'backend/public/documents/')
     cb(null, path.join(__dirname,'../public/users/'))
      },
    filename: function (req, file, cb) {
      cb(null, Date.now()+'.png')
    }
  })
  
  
  
var upload = multer({ storage: storage })

    router.post("/add-user",accessToken,upload.single('image'),async(req,res)=>{
    
    const {fristname,lastname,email,mobile,address,password,device_id,fcm_token,lat,long,role,street,city,zipcode,state,country} = req.body
    if(!fristname) return res.json({status:false,message:"firstname is require"})
    if(!lastname) return res.json({status:false,message:"lastname is require"})
    if(!email) return res.json({status:false,message:"email is require"})
    if(!mobile) return res.json({status:false,message:"mobile is require"})
    if(!password) return res.json({status:false,message:"password is require"})
    if(!role) return res.json({status:false,message:"role is require"})
    
     if(!address) return res.json({status:false,message:'address is require'});
    // if(!street) return res.json({status:false,message:'street is require'});
    // if(!city) return res.json({status:false,message:'city is require'});
    // if(!zipcode) return res.json({status:false,message:'zipcode is require'});
    // if(!state) return res.json({status:false,message:'state is require'});
    // if(!country) return res.json({status:false,message:'country is require'});
    
    try{
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
        
       
        const checkEmail = await User.findOne({where:{email:email}})
        if(checkEmail) return res.json({status:false,message:"Email is already exist"})
    
        const checkPhone = await User.findOne({where:{mobile:mobile}})
        if(checkPhone) return res.json({status:false,message:"Mobile number is already exist"})

        const hash = bcrypt.hashSync(password,10)
        
        const user = await User.create({fristname,lastname,email,status:1,
        mobile,
        address,
        password:hash,
        device_id,
        fcm_token,
        lat,
        lng:long,
        role,
        street:'',
        city:'',
        zip_code:'',
        state:'',
        country:'USA',
        image:"/users/"+req.file.filename})
         
        return res.json({status:true,message:"User Added Successful"})
        
    }
    catch(err){
         
        return res.json({status:false,message:"Something is wrong"})
    }
})




//delete FENCE
router.post('/delete-fence',accessToken,async(req,res)=>{
  const {fence_id}=req.body
  
  if(!fence_id) return res.json({stats:false,message:"fence_id is required"})
  
  try{
       const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
      if(!admin) return res.json({status:false,message:"admin not found"})
      
      var delete_fence = await Fence.findOne({where:{id:fence_id}})
     
      delete_fence.is_deleted=1
      delete_fence.save()
      
      
     
      return res.json({status:true,message:" Fence Is Deleted"})
  }catch(err){
       
      return res.json({status:false,meaasge:"Something wrong"})
  }
})







//ADD SERVICE PROVIDER




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


// var storageone = multer.diskStorage({
//     destination: function (req, file, cb) {
//       // cb(null,'backend/public/documents/')
//      cb(null, path.join(__dirname,'../public/users/'))
//       },
//     filename: function (req, file, cb) {
//       cb(null, Date.now()+'.png')
//     }
//   })
  
  
  
  
// var uploadone = multer({ storage: storageone })

//add provider


router.post("/add-provider",accessToken,upload.fields([{name:'identity'},{name:'license'},{name:'insurance'},{name:'image'}]),async(req,res)=>{
    
    const {fristname,lastname,email,dob,mobile,ssn,equipments,address,bio,password,device_id,fcm_token,lat,lng:long,role,street,city,zipcode,state,country,identity,license,insurance,account_number,bank_name,routing_number,service} = req.body
    
    if(!fristname) return res.json({status:false,message:"Firstname is require"})
    if(!lastname) return res.json({status:false,message:"Lastname is require"})
    if(!email) return res.json({status:false,message:"Email is require"})
    if(!mobile) return res.json({status:false,message:"Mobile is require"})
    if(!password) return res.json({status:false,message:"Password is require"})
    if(!role) return res.json({status:false,message:"Role is require"})
    if(!bio) return res.json({status:false,message:"Bio is require"})
    // if(req.files.identity.length=="" || req.files.license.length =="") return res.json({status:false,message:'License/Identity document is required.'}); 
    // // if(req.files.license.length) return res.json({status:false,message:'License document is required.'});
    
    if(!req.files.license && !req.files.identity) return res.json({status:false,message:'Please select license or identity'});
    if(!req.files.insurance) return res.json({status:false,message:'insurance document is required.'});
    
   
    if(!address) return res.json({status:false,message:"Address is require"})
    if(!account_number) return res.json({status:false,message:"Account_number is require"})
    if(!bank_name) return res.json({status:false,message:"Bank_name is require"})
    if(!routing_number) return res.json({status:false,message:"Routing_number is require"})
    if(!service) return res.json({status:false,message:"Service is require"})
    if(!equipments) return res.json({status:false,message:"Equipments is require"});
    if(!ssn) return res.json({status:false,message:'Ssn is require'});
    if(!street) return res.json({status:false,message:'Street is require'});
    if(!city) return res.json({status:false,message:'City is require'});
    if(!zipcode) return res.json({status:false,message:'Zipcode is require'});
    if(!state) return res.json({status:false,message:'State is require'});
    if(!country) return res.json({status:false,message:'Country is require'});
    if(!dob) return res.json({status:false,message:"Dob is require"});
//   || equipments==''
    try{
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"Admin not found"})
        
       
        const checkEmail = await User.findOne({where:{email:email,is_deleted:0,status:1}})
        if(checkEmail) return res.json({status:false,message:"Email is already exist"})
    
        const checkPhone = await User.findOne({where:{mobile:mobile,is_deleted:0}})
        if(checkPhone) return res.json({status:false,message:"Mobile number is already exist"})
        
        const equip = equipments.split('');
        if(equip.indexOf("0") !== -1) return res.json({status:false,message:'Equipment id should not zero.'});
        
        const hash = bcrypt.hashSync(password,10)
       
        var Bdate =dob   // moment().format('YYYY-MM-DD')
        
        var img = (req.files.image) ? "/users/"+req.files.image[0].filename : "/users/default.png";
        
        var user = await User.create({
        fristname,lastname,email,mobile,dob:Bdate,bio,
        image:img,
        address,
        service,
        password:hash,
        device_id,
        fcm_token,
        ssn,
        lat,
        lng:long,
        role,
        status:1,
        street,
        city,
        zip_code:zipcode,
        state,
        country})
         //return res.json("okk")
        const user_detail = await User_detail.create({
            provider_id:user.id,
            identity:typeof req.files.identity !='undefined' ? '/documents/'+req.files.identity[0].filename:'',
            license:typeof req.files.license !='undefined' ?'/documents/'+req.files.license[0].filename:'',
            insurance:'/documents/'+req.files.insurance[0].filename,
                    
        });
        
        const bank_detail = await Bank_detail.create({provider_id:user.id,account_number,bank_name,routing_number})
        
        
        // return res.json(equipments)
        
       
        
        for(let i=0; i<equip.length; i++)
        { 
            const checkexist = await Equipment.findOne({where:{id:equip[i],is_deleted:0}});
            
            if(checkexist){
              await Provider_equipment.create({provider_id:user.id,equipment_id:equip[i],category_id:checkexist.category_id})   
            }
          
        }
        
        
        return res.json({status:true,message:"Provider Added Successful"})
        
    }
    catch(err){
        return res.json(err)
         
        return res.json({status:false,message:"Something is wrong"})
    }
})

// //get equipments

//   router.post('/get-equipment',accessToken,async(req,res)=>{
//  try{
//       const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
//       if(!admin) return res.json({status:false,message:"admin is deleted"})

//       const equipments = await Equipment.findAll({is_deleted:0})
      
//         const equipment=[];
//         for(i=0; i<equipments.length; i++)
//         {
//             equipment.push({
//                 id:equipments[i].id,
//                 name:equipments[i].name,
//                 if(type:equipments[i].type==1)
//                 type:"commercial"
                
//             })
//         }
//         return res.json(equipment)
    
//      return res.json({status:true,data:{equipment},message:"show equipments provider ."})
     
//     }catch(err){
//          
//         return res.json({status:false,message:"something is wrong"});
//     }
// })




//pending provider  

  router.post('/pending-provider',accessToken,async(req,res)=>{
 try{
      const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
      if(!admin) return res.json({status:false,message:"admin is deleted"})
    
    
    //   var pageAsNumber = Number.parseInt(req.query.page)
    //   var sizeAsNumber = Number.parseInt(req.query.size)
      
    //   var page = 1;
    //   if(!Number.isNaN(pageAsNumber) && pageAsNumber>1){
    //       page=pageAsNumber;
    //   }
    //   var size = 10;
    //   if(!Number.isNaN(sizeAsNumber)&&sizeAsNumber>0 && sizeAsNumber<10)
    //   {
    //       size = sizeAsNumber ;
    //   }
    //   const provider_dataRaw = await User.findAndCountAll({
    //          where:{admin_approved:0,is_deleted:0,role:2},
    //          order:[['createdAt','desc']],
    //          limit:size,
    //          offset:(page-1)*size
          
    //   })
      
  const provider_data = await User.findAll({
      
             where:{admin_approved:0,is_deleted:0,role:2},
             
             include:[
                 {model:Provider_equipment,as:"provider_equipment",where:{is_deleted:0}},
                 {model:User_detail,as:'user_documents'}
                 ],
             order:[['createdAt','desc']]
       })
       
       
//   return res.json(provider_data)
      const provider= [];
    
    
    for(var i=0; i<provider_data.length; i++)
    {
        if(provider_data[i].user_documents!=null){
    let group = (provider_data[i].provider_equipment).reduce((r, a) => {
    // console.log("a", a);
    // console.log('r', r);
    r[a.category_id] = [...r[a.category_id] || [], a];
    return r;
    }, {});
    

     
    var categories = [];
   
    // group.push(group)
    // return res.json(categories)
      Object.keys(group).forEach((k,v) => {
              
            categories.push(k)
            
            // categories.push(k)
            
            
          });
         
          if(categories=="1","2")
          {var test="Mowing & Plowing"}
          
          if(categories=="1")
          {test="Mowing"}
          
          if(categories=="2")
          {test="Plowing"}
       
     
     provider.push({
            id:provider_data[i].id,
            name:provider_data[i].fristname+" "+provider_data[i].lastname,
            strip_status:(provider_data[i].account_id==null) ? 0:1,
            email:provider_data[i].email,
            contact:provider_data[i].mobile,
            admin_approved:provider_data[i].admin_approved,
            service:test
            // test:[group]
        })
        
    }    
    }
    
    
     return res.json({status:true,data:{provider},message:"Show Pending Provider"})
     //return res.json({status:true,data:{provider,total_page:Math.ceil(provider_dataRaw.count/size)},message:"show pending provider ."})
     
    }catch(err){
         
        return res.json({status:false,message:"Something is wrong"});
    }
})
// total_page:Math.ceil(userRaw.count/size)


//approve and reject

  router.post('/approve-reject',accessToken,async(req,res)=>{
      const {provider_id,admin_approved} = req.body
      
      if(!provider_id) return res.json({status:false,message:"provider_id is require"})
      if(!admin_approved==='') return res.json({status:false,message:"admin_approved is require"})
      
 try{
      const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
      if(!admin) return res.json({status:false,message:"admin not found"})

     const provider = await User.findOne({where:{id:provider_id,is_deleted:0,role:2}})
     if(!provider) return res.json({status:false,message:"Provider not found"})
     
     provider.admin_approved = admin_approved,
     provider.save();
    //   return res.json(provider)
     var mess = (provider.admin_approved==1) ? "Provider Has Approved" : "Provider Has Reject"//0 pending 1 approve 2 reject
    //  return res.json("okk")
     if(provider.admin_approved==1){
    //   var payload = {
    //         notification:{
            
    //         title:'Profile Update',
    //         body:'Your profile  has been approved by admin'
    //         },
    //         data:{
                
    //             title:'Profile Update',
    //             body:'Your profile  has been approved by admin',
    //             click_action:'profile_approved_by_admin'
    //         }
    //         };
            
    //   var options = {
    //         priority: "high",
    //         timeToLive: 60 * 60 * 24,
    //         };
    //         var fcm=provider.fcm_token
    //         var test =   providerpush.messaging().sendToDevice(fcm,payload,options)
    
    
    // return res.json(provider.fcm_token)
  
            
            
        
            
            
        var payload = {
         notification:{
                title:'Profile Update',
                body:'Your profile  has been approved by admin and now you can accept jobs'
            },
        data:{
                title:'Profile Update',
                body:'Your profile  has been approved by admin and now you can accept jobs',
                click_action:'profile_approved_by_admin'
              }
        };
            
       var options = {
                priority: "high",
                timeToLive: 60*60*24,
            };
            
           
        await providerpush.messaging().sendToDevice(provider.fcm_token,payload,options)
         
            // return res.json({data:{test,fcm}})
     }
     return res.json({status:true,message:mess})
     
    }catch(err){
        // return res.json(err)
        //  
        // return res.json(err)
        return res.json({status:false,message:"Something is wrong"});
    }
})

//edit user details

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

router.post('/edit-user',accessToken,upload.single('image'),async(req,res)=>{
    
    const {user_id,firstname,lastname,mobile,address,password,lat,lng,}= req.body;
    if(!user_id) return res.json({status:false,message:"user_id is require"})
    if(!firstname) return res.json({status:false,message:"firstname is require"})
    if(!lastname) return res.json({status:false,message:"lastname is require"})
    if(!mobile) return res.json({status:false,message:"mobile is require"})
    // if(!address) return res.json({status:false,message:"address is require"})
    // if(!lat) return res.json({status:false,message:"lat is require"})
    // if(!lng) return res.json({status:false,message:"lng is require"})
    
    try{
        
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}});
        if(!admin) return res.json({status:false,message:"admin not found"});
        
         
         const user_details = await User.findOne({where:{id:user_id,is_deleted:0}})
        
        user_details.fristname=firstname;
        user_details.lastname =lastname;
        user_details.mobile   =mobile;
        user_details.address  =address;
        user_details.lat      =lat;
        user_details.lng      =lng;
        
        if(password != "")
        {   
             var hash = bcrypt.hashSync(password,10);
             user_details.password=hash;
        }
        if(req.file)
        {
            user_details.image="/users/"+req.file.filename;
        }
       
        user_details.save()
        
        return res.json({status:true,message:"User Details Update successfuly Done "})
       }catch(err){
       
         
        return res.json({status:false,message:"Something is wrong"})
    }
})


//edit provider details


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

router.post('/edit-provider',accessToken,upload.single('image'),async(req,res)=>{
    const {provider_id,firstname,lastname,mobile,address,password,equipments,dob,bio,service,lat,lng,ssn,street,city,zipcode,state,country}= req.body;
    
    if(!provider_id) return res.json({status:false,message:"provider_id is require"})
    if(!firstname) return res.json({status:false,message:"firstname is require"})
    if(!lastname) return res.json({status:false,message:"lastname is require"})
    if(!mobile) return res.json({status:false,message:"mobile is require"})
    if(!address) return res.json({status:false,message:"address is require"})
    // if(!lat) return res.json({status:false,message:"lat is require"})
    // if(!lng) return res.json({status:false,message:"lng is require"})
    // if(!equipments) return res.json({status:false,message:"equipments is require"})
    
    // if(!ssn) return res.json({status:false,message:'ssn is require'});
    // if(!street) return res.json({status:false,message:'street is require'});
    // if(!city) return res.json({status:false,message:'city is require'});
    // if(!zipcode) return res.json({status:false,message:'zipcode is require'});
    // if(!state) return res.json({status:false,message:'state is require'});
    // if(!country) return res.json({status:false,message:'country is require'});
    // //if(!service) return res.json({status:false,message:"service is rerquire"})
    try{
       
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}});
        if(!admin) return res.json({status:false,message:"admin not found"});
        // return res.json("okl")
        const provider_details = await User.findOne({where:{id:provider_id,role:2,is_deleted:0}})
        if(provider_details==null) return res.json({status:false,message:'Provider not available'})
        // var Bdate = moment(dob).format('DD-MM-YYYY')
        //  return res.json(provider_details)
        provider_details.fristname=firstname;
        provider_details.lastname =lastname;
        provider_details.mobile   =mobile;
        provider_details.address  =address;
        provider_details.lat      =lat;
        provider_details.lng      =lng;
        provider_details.ssn      =ssn;
        provider_details.street      =street;
        provider_details.city      =city;
        provider_details.zipcode      =zipcode;
        provider_details.state      =state;
        provider_details.country      =country;
        provider_details.dob     =dob;
        
        if(bio !=''){
           provider_details.bio=bio;
        }
        
        if(password !=''){
             var hash = bcrypt.hashSync(password,10);
             
             provider_details.password=hash;
        }
        if(req.file)
        {
            provider_details.image="/users/"+req.file.filename;
        }
       
        provider_details.save();
        
       
        
        
                    
        // var str = "1, apple, mouse, kindle";
        var chackzero = equipments.indexOf('0') != -1;
        if(chackzero) return res.json({status:false,message:'Equipment Id Zero Not Exist'})
        
        const equip = equipments.split('');
        
    //   return res.json(equip)
        await Provider_equipment.update({is_deleted:1},{where:{provider_id}})   
        
        
        for(let i=0; i<equip.length; i++)
        { 
            
           const checke = await Equipment.findOne({where:{id:equip[i],is_deleted:0}});
           
           if(checke){
               
           var checkexist =  await Provider_equipment.findOne({where:{
                                                           is_deleted:0,
                                                           provider_id:provider_details.id,
                                                           equipment_id:checke.id,
                                                           category_id:checke.category_id
                   
                                                         }})
            
            if(!checkexist){    
           await Provider_equipment.create({
                                                provider_id:provider_details.id,
                                                equipment_id:checke.id,
                                                category_id:checke.category_id
                                            }) 
            }
          }            

            
        }
        
        return res.json({status:true,message:"Provider Details Update successfuly Done "})
       }catch(err){
       
         
        return res.json({status:false,message:"Somthing is wrong"})
    }
})

//snow plowing car type get

router.post('/car-type',accessToken,async(req,res)=>{
    
    try{
        
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}});
        if(!admin) return res.json({status:false,message:"admin not found"});
        
        const car_data = await Subcategory.findAll({where:{is_deleted:0}})
        
        var car_details =[];
        
        for(var i=0; i<car_data.length ; i++)
        {
            car_details.push({
                
             id:car_data[i].id, 
             type:car_data[i].name,
             price:car_data[i].price
             
            })
        }
        return res.json({status:true,data:{car_details},message:"Cars Types"})
        
    }catch(err){
       
         
        return res.json({status:false,message:"Something is wrong"})
    }
})



//ADD CAR TYPE

router.post('/add-cartype',accessToken,async(req,res)=>{
    
    const {name,price,status} = req.body;
    if(!name) return res.json({status:false,message:"name is require"})
    if(!price) return res.json({status:false,message:"price is require"})
    if(!status) return res.json({status:false,message:"status is require"})
    
    try{
        
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}});
        if(!admin) return res.json({status:false,message:"admin not found"});
        
        const car_data = await Subcategory.create({
            name,
            price,
            status,
            category_id:2
        });
        
       return res.json({status:true,message:"Car Types Added"})
        
    }catch(err){
       
         
        return res.json({status:false,message:"Something is wrong"})
    }
})

//EDIT CAR TYPE

router.post('/edit-cartype',accessToken,async(req,res)=>{
    
    const {car_id,name,price} = req.body;
    if(!car_id) return res.json({status:false,message:"car_id is require"})
    if(!name) return res.json({status:false,message:"name is require"})
    if(!price) return res.json({status:false,message:"price is require"})
    
   try{
        
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}});
        if(!admin) return res.json({status:false,message:"admin not found"});
        
        const car_data = await Subcategory.findOne({where:{id:car_id,is_deleted:0}});
        
        car_data.name=name;
        car_data.price=price;
        car_data.save()
        
       return res.json({status:true,message:"Car Details Edit successfuly Done"})
        
    }catch(err){
         
        return res.json({status:false,message:"Domething Is Wrong"})
    }
})



//deshbord today booking

router.post('/today-booking',accessToken,async(req,res)=>{
    try{
        
        const admin =await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
         
        const dataHourStart = moment().format('YYYY-MM-DD')+' 00:00:00';
        const datahourEnd   = moment().format('YYYY-MM-DD')+' 23:59:59';
             
        // return res.json({dataHourStart,datahourEnd})     
             
        const tbook = await Order.findAll({
             where:{createdAt:{[Op.between]: [dataHourStart, datahourEnd]},payment_status:2},
        include:[
            {model:User,as:'provider' },
            {model:User,as:'user_details'}
            
                ],
                order:[['id','desc']]
       
        });
        
        
        
        
//   return res.json(tbook)
        var today_total_booking = 0;
        var today_cancel =0;
        const todaybooking_details=[];
        
         for(var i=0; i<tbook.length; i++)
         {
             
            if(tbook[i].id != "")
            {
                today_total_booking++ ;
            }
            if(tbook[i].status==4)
            {
                today_cancel ++;
            }
            if(tbook[i].category_id==1)
            {serviced='Lawn Mowing'}
            
            if(tbook[i].category_id==2)
            {serviced='Snow Plowing'}
            
            if(tbook[i].category_id==null)
            {serviced='NA'}
            
             todaybooking_details.push({
                 id:tbook[i].id,
                 order_id:tbook[i].order_id,
                 user_name:(tbook[i].user_details != null) ? tbook[i].user_details.fristname+' '+tbook[i].user_details.lastname : '',
                 provider_name:(tbook[i].provider != null) ? tbook[i].provider.fristname+' '+tbook[i].provider.lastname : 'Not Assigned',
                 service_type:serviced,
                 
             })
             
         }
         
       
        const total_book = await Order.findAll({
            where:{is_deleted:0,payment_status:2}
        })
        
        var total_booking=0;
       
         for(var i=0; i<total_book.length; i++)
         {
             if(total_book[i].id)
             {
                 total_booking ++;
             }
          }
          
          const total_cancel= await Order.findAll({
            where:{is_deleted:0,status:4}
        })
         //return res.json(total_cancel)
        var total_cancelled=0;
       
         for(var i=0; i<total_cancel.length; i++)
         {
             if(total_cancel[i].id)
             {
                 total_cancelled ++;
             }
          }
          
         const provider_locaton = [] 
         const userdata= await User.findAll({
         where:{is_deleted:0,role:2,status:1,admin_approved:1}
         })
         for(var i=0; i<userdata.length; i++ )
         {
         provider_locaton.push({
          id:userdata[i].id,
          lat:userdata[i].lat,
          lng:userdata[i].lng,
          name:(userdata[i] != null) ?  userdata[i].fristname+' '+userdata[i].lastname : '', 
         })}
        
         const newuser = await User.findAll({
         where:{createdAt:{[Op.between]: [dataHourStart, datahourEnd]},is_deleted:0,status:1}
         })
         var new_customer = 0;
         var new_provider = 0;
         for(var i=0; i<newuser.length; i++)
         {
            if(newuser[i].role == 1)
            { new_customer ++ }
            if(newuser[i].role == 2)
            {
                new_provider ++
               
            }
         }
        
        
        var customer_complaints = await Report.count({
        where: {is_deleted:0,type:'user'},
        attributes: [[sequelize.fn('COUNT', "user"), 'count']]
    });
        
        var provider_complaints = await Report.count({
        where: {is_deleted:0,type:'provider'},
        attributes: [[sequelize.fn('COUNT', 'provider'), 'count']]
    });
       
     
      
var today_Admin_earning = await Order.findAll({
        where:{payment_status:2,is_deleted:0,status:3,
             createdAt:{[Op.between]: [dataHourStart, datahourEnd]},
             },
        attributes:[
                  [sequelize.fn('sum', sequelize.col('provider_amount')), 'provider_amount'],
                  [sequelize.fn('sum', sequelize.col('total_amount')), 'total_amount'],
                  [sequelize.fn('sum', sequelize.col('tax')), 'tax'],
                  [sequelize.fn('sum', sequelize.col('grand_total')),'grand_total'],
                 ],
          raw:true      
    
    
})


    //   return res.json(today_Admin_earning)
    
       if(today_Admin_earning!=''){
           
        var Admin_ear= parseFloat(today_Admin_earning[0].total_amount)-parseFloat(today_Admin_earning[0].provider_amount);
        var Admin_revenue= parseFloat(today_Admin_earning[0].grand_total);
       }
       
         var today_earning_admin = (Admin_ear) ? Admin_ear.toFixed(2):0;
         var today_revanue = (Admin_revenue) ? Admin_revenue.toFixed(2):0;
        // return res.json(today_earning_admin) 
    
var total_admin_earning = await Order.findAll({
         where:{payment_status:2,status:3,is_deleted:0},
      attributes:[
                  [sequelize.fn('sum', sequelize.col('provider_amount')), 'provider_amount'],
                  [sequelize.fn('sum', sequelize.col('total_amount')), 'total_amount'],
                  [sequelize.fn('sum', sequelize.col('tax')), 'tax'],
                  [sequelize.fn('sum', sequelize.col('grand_total')),'grand_total'],
                 ],
          raw:true
        
    
})  
 

        
       
        if(total_admin_earning!=null){
            
            var total_admin_earnings=parseFloat(total_admin_earning[0].total_amount)-parseFloat(total_admin_earning[0].provider_amount);
            var total_admin_Revenue=parseFloat(total_admin_earning[0].grand_total)
        }
        
        var totall_admin_earning = (total_admin_earnings) ? total_admin_earnings.toFixed(2):0;
        var total_admin_revenue = (total_admin_Revenue) ? total_admin_Revenue.toFixed(2):0;
         
        // return res.json({today_earning})
        
       return res.json({status:true,data:{today_total_booking,total_booking,today_cancel,total_cancelled,
       new_customer,new_provider,todaybooking_details,provider_locaton,provider_locaton,customer_complaints,provider_complaints,today_earning_admin,totall_admin_earning,total_admin_revenue,today_revanue},message:"Deshboard Details"})
        
    }catch(err){
        return res.json(err)
         
        return res.json({status:false,message:"Something is wrong"})
    }
})

//delete car type
router.post('/delete-cartype',accessToken,async(req,res)=>{
    
  const {cartype_id}=req.body
  
  if(!cartype_id) return res.json({stats:false,message:"cartype_id is required"})
  
  try{
       const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
      if(!admin) return res.json({status:false,message:"admin not found"})
      
      var delete_cartype = await Subcategory.findOne({where:{id:cartype_id}})
     
      delete_cartype.is_deleted=1;
      delete_cartype.save();
      
     return res.json({status:true,message:"Car Data Has Been Deleted"})
  }catch(err){
       
      return res.json({status:false,meaasge:"Something wrong"})
  }
})


//ADD QUESTION

router.post('/add-question',accessToken,async(req,res)=>{
    const {question,category_id}= req.body
    if(!question) return res.json({status:false,message:"Question is required"})
    if(!category_id) return res.json({status:false,message:"Enter Category id"})
    
    try{
        
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
        
        const ques = await Question.create({
            question,
            category:category_id
            
        });
        return res.json({status:true,message:"Question Added successfuly Done"})
    }catch(err){
         
        return res.json({status:false,message:"Something is wrong"})
        
    }
})


//GET QUESTION LAWN

router.post('/get-question',accessToken,async(req,res)=>{
    
    
    try{
        
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
        
        const ques = await Question.findAll({
            where:{is_deleted:0,category:1},
            order:[['id','desc']]
            
        });
       return res.json({status:true,data:{ques},message:"Question Data Show"})
    }catch(err){
         
        return res.json({status:false,message:"Something is wrong"})
        
    }
})

//GET QUESTION SNOW

router.post('/get-question-snow',accessToken,async(req,res)=>{
    
    
    try{
        
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
        
        const ques = await Question.findAll({
            where:{is_deleted:0,category:2},
            order:[['id','desc']]
            
        });
       return res.json({status:true,data:{ques},message:"Question Data Show"})
    }catch(err){
         
        return res.json({status:false,message:"Something is wrong"})
        
    }
})


//EDIT QUESTION


router.post('/edit-question',accessToken,async(req,res)=>{
    const {question_id,question} = req.body
    if(!question_id) return res.json({status:false,message:"question_id required"})
    if(!question) return res.json({status:false,message:"question  required"})
    try{
        
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
        
        const ques = await Question.findOne({where:{id:question_id,is_deleted:0}});
        
        ques.question = question;
        ques.save(); 
       
        return res.json({status:true,data:{ques},message:"Question Updated"})
    }catch(err){
         
        return res.json({status:false,message:"Something is wrong"})
        
    }
})


//delete  QUESTION
router.post('/delete-question',accessToken,async(req,res)=>{
    
  const {question_id}=req.body
  
  if(!question_id) return res.json({stats:false,message:"question_id is required"})
  
  try{
       const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
      if(!admin) return res.json({status:false,message:"admin not found"})
      
      var delete_question = await Question.findOne({where:{id:question_id}})
     
      delete_question.is_deleted=1;
      delete_question.save();
      
     return res.json({status:true,message:"Question Has Been Deleted"})
  }catch(err){
       
      return res.json({status:false,meaasge:"Something wrong"})
  }
})

//Service Delivery Add

router.post('/service-delivery',accessToken,async(req,res)=>{ 
    
const {type,price,duration,duration_type} = req.body
if(!type) return res.json({status:false,message:"type is require"});
// if(!price) return res.json({status:false,message:"price is require"});
if(!duration) return res.json({status:false,message:"duration is require"});
if(!duration_type) return res.json({status:false,message:"duration_type is require"});
try{
    if(duration_type=="DAYS" || duration_type=="MONTH" || duration_type=="YEARS")
    {
    const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
    if(!admin) return res.json({status:false,message:"admin not found"})
    // return res.json("okk")
    const service = await Service_period.create({
    type,
    price:0,
    duration,
    duration_type,
    })
     return res.json({status:true,message:"Service Delivery Has Been Added"})
    }
    return res.json({status:false,message:"Dutration Type Is Wrong"})
}catch(err){
     
    return res.json({status:false,message:"Something is wrong"})
}

   })


//Service Delivery GET
router.post('/get-service-delivery',accessToken,async(req,res)=>{ 

try{
    
    const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
    if(!admin) return res.json({status:false,message:"admin not found"})

    const ser = await Service_period.findAll({where:{is_deleted:0}})
    const service=[];
    for(var i=0; i<ser.length; i++)
    {
        service.push({
            id:ser[i].id,
            service_type:ser[i].duration,
            duration_type:ser[i].duration_type,
            price:ser[i].price,
            status:ser[i].status,
            recommended:ser[i].recommended,
            is_deleted:ser[i].is_deleted
        })
    }
     return res.json({status:true,data:{service},message:"Service Delivery Show"})
}catch(err){
     
    return res.json({status:false,message:"Something is wrong"})
}

   })

//Service Delivery delete
router.post('/delete-service-delivery',accessToken,async(req,res)=>{ 
const {service_id} = req.body;
if(!service_id) return res.json({status:false,message:"service_id is require"})
try{
    
    const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
    if(!admin) return res.json({status:false,message:"admin not found"})

    const service = await Service_period.findOne({where:{id:service_id,is_deleted:0}})
    service.is_deleted=1;
    service.save()
    return res.json({status:true,message:"Service Delivery Has Been Deleted"})
}catch(err){
     
    return res.json({status:false,message:"Something is wrong"})
}

   })

//Service Delivery edit
router.post('/edit-service-delivery',accessToken,async(req,res)=>{
    
const {service_id,duration_type,duration,price,type} = req.body;

if(!service_id) return res.json({status:false,message:"service_id is require"})
try{
    if(!Number.isInteger(duration)) return res.json({status:false,message:'Duration of days should be in integer value.'});
       
    const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
    if(!admin) return res.json({status:false,message:"admin not found"})

    const service = await Service_period.findOne({where:{id:service_id,is_deleted:0}})
     
    service.type=type
    service.duration=duration;
    // service.duration_type=duration_type;
    // service.= ;
    service.save()
    return res.json({status:true,message:"Service Delivery Has Been Updated"})
}catch(err){
     
    return res.json({status:false,message:"Something is wrong"})
}

   })



 //On Demand fee get
 router.post('/geton-demand-fee',accessToken,async(req,res)=>{ 

try{
    
    const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
    if(!admin) return res.json({status:false,message:"admin not found"})

    const on_demand_data = await Setting.findOne({where:{field_key:'on_demand_fee',is_deleted:0}})
   
     var on_demand_fee= [];
        // for(i=0; i<on_demand_data.length; i++)
        // {
        //     on_demand_fee.push({
        //         id:on_demand_data[i].id,
        //         field_key:on_demand_data[i].field_key,
        //         field_value:on_demand_data[i].field_value,
        //         status:on_demand_data[i].status
        //     })
        // }  
    return res.json({status:true,data:{on_demand_fee:on_demand_data.field_value,fee_id:on_demand_data.id},message:"On Demand Fee Has Been Show"})
}catch(err){
     
    return res.json({status:false,message:"Something is wrong"})
}

  })

       
   
 //On Demand fee update
 router.post('/editon-demand-fee',accessToken,async(req,res)=>{ 
const {fee_id,on_demand_fee} = req.body;
if(!fee_id) return res.json({status:false,message:"fee_id is require"})
if(!on_demand_fee) return res.json({status:false,message:"on_demand_fee is require"})
try{
    
    const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
    if(!admin) return res.json({status:false,message:"admin not found"})

    const on_demand = await Setting.findOne({where:{id:fee_id,is_deleted:0}})
    on_demand.field_value=on_demand_fee;
    on_demand.save();
    return res.json({status:true,message:"On Demand Fee Has Been Updated"})
}catch(err){
     
    return res.json({status:false,message:"Something is wrong"})
}

  })
 

// //TODAY ORDERS
// router.post('/today-order',accessToken,async(req,res)=>{
    
//   try{ 
    
//     const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
//     if(!admin) return res.json({status:false,message:"admin not found"})
   
//   const todayOrders= await Order.findAll({where:{on_demand:"today" }})
//   return res.json({status:true,data:{todayOrders},message:"today orders lists"})
   
//   }catch(err){
//      
//     return res.json({status:false,message:"somthing is wrong"})
//   }
// })


router.post('/get-snow-plowing-options',accessToken,async(req,res) =>{
    
    try{    
           const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
           if(!admin) return res.json({status:false,message:"admin not found"})
           
            var hdriveway = await Driveway.findOne({where:{type:'HOME',is_deleted:0}});
            var hsidewalk = await Sidewalk.findAll({where:{type:'HOME',is_deleted:0}});
            var hwalkway  = await Walkway.findAll({where:{type:'HOME',is_deleted:0}});
            
            
            var bdriveway = await Driveway.findOne({where:{type:'BUSINESS',is_deleted:0}});
            var bsidewalk = await Sidewalk.findAll({where:{type:'BUSINESS',is_deleted:0}});
            var bwalkway  = await Walkway.findAll({where:{type:'BUSINESS',is_deleted:0}});
            
            return res.json({
                status:true,
                data:{
                     home:{driveway:hdriveway,sidewalk:hsidewalk,walkway:hwalkway},
                     business:{driveway:bdriveway,sidewalk:bsidewalk,walkway:bwalkway}, 
                },
                message:'Get Home Business Data'
                
            });
         
            
    }catch(err){
         
        return res.json({status:false,message:'something is wrong.'});
    }
});



// 
router.post('/sideway',accessToken,async(req,res) =>{
    
    const {action,type,id,name,price} = req.body;
    
    if(!action) return res.json({status:false,message:'action is required.'});
  
    
    try{    
        
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
        
           if(action=='ADD'){
               
                if(!type) return res.json({status:false,message:'type is required.'});
                if(!name) return res.json({status:false,message:'name is required.'});
                if(!price) return res.json({status:false,message:'price is required.'});
                 
                 var sidewalk = await Sidewalk.findOne({where:{name,type,is_deleted:0}});
                 if(sidewalk) return res.json({status:false,message:'name is already exist.'});
                 
                 await Sidewalk.create({name,price,type});
                 return res.json({status:true,message:'Sidewalk Added successfuly.'});
                
            }
            
            
        
            if(action=='UPDATE'){
                
                 if(!id) return res.json({status:false,message:'id is required.'});
                 if(!type) return res.json({status:false,message:'type is required.'});
                 if(!name) return res.json({status:false,message:'name is required.'});
                 if(!price) return res.json({status:false,message:'price is required.'});
                 
                var sidewalk = await Sidewalk.findOne({
                    where:{name,type,is_deleted:0,id:{[Op.not]:id}}
                    
                });
                 if(sidewalk) return res.json({status:false,message:'name is already exist.'});
                 
                 
                 var sidewalk = await Sidewalk.findOne({where:{id,type,is_deleted:0}});
                // return res.json(sidewalk)
                     sidewalk.name = name;
                     sidewalk.price = price;
                     sidewalk.save();
                     
                 return res.json({status:true,message:'Sidewalk Updated successfuly.'});
                
            }
            
            
            
             if(action=='DELETE'){
                 
                 if(!id) return res.json({status:false,message:'id is required.'});
                 
                    var sidewalk = await Sidewalk.findOne({where:{id,type,is_deleted:0}});
                        sidewalk.is_deleted = 1;
                        sidewalk.save();
                        
                return res.json({status:true,message:'Sidewalk Deleted successfuly.'});
                
            }
            
            
           
    }catch(err){
         
        return res.json({status:false,message:'Something is wrong.'});
    }
});



// 
router.post('/walkway',accessToken,async(req,res) =>{
    
    const {action,type,id,name,price} = req.body;
    
    if(!action) return res.json({status:false,message:'action is required.'});
   
   
  
    
    try{    
        
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
         if(!admin) return res.json({status:false,message:"admin not found"})
        
           if(action=='ADD'){
               
                 if(!name) return res.json({status:false,message:'name is required.'});
                 if(!price) return res.json({status:false,message:'price is required.'});
                 if(!type) return res.json({status:false,message:'type is required.'});
                 
                 var walkway = await Walkway.findOne({where:{name,type,is_deleted:0}});
                 
                 if(walkway) return res.json({status:false,message:'name is already exist.'});
                    
                 await Walkway.create({name,price,type});
                 return res.json({status:true,message:'Walkway Added successfuly.'});
                
            }
            
            
            
            if(action=='UPDATE'){
                
                 if(!id) return res.json({status:false,message:'id is required.'});
                 if(!name) return res.json({status:false,message:'name is required.'});
                 if(!price) return res.json({status:false,message:'price is required.'});
                 if(!type) return res.json({status:false,message:'type is required.'});
                             
                             
                var sidewalk = await Walkway.findOne({
                    where:{name,type,is_deleted:0,id:{[Op.not]:id}}
                    
                });
                
                 if(sidewalk) return res.json({status:false,message:'name is already exist.'});
                 
                 
                var walkway = await Walkway.findOne({where:{id,type,is_deleted:0}});
                        walkway.name = name;
                        walkway.price = price;
                        walkway.save();
                        
                return res.json({status:true,message:'walkway updated successfuly.'});
            }
            
             if(action=='DELETE'){
                 
                 if(!id) return res.json({status:false,message:'id is required.'});
                 
                    var walkway = await Walkway.findOne({where:{id,type,is_deleted:0}});
                        walkway.is_deleted = 1;
                        walkway.save();
                        
                return res.json({status:true,message:'Walkway Deleted successfuly.'});
            }
           
            
           
         
            
    }catch(err){
         
        return res.json({status:false,message:'Something is wrong.'});
    }
});


// drive way



router.post('/driveway',accessToken,async(req,res) =>{
     const {id,on_first_car_price,more_than_one_price,type} = req.body;
     
     if(!id) return res.json({status:false,message:'id is required.'});
    //  if(!on_first_car_price) return res.json({status:false,message:'on first car price is required.'});
    //  if(!more_than_one_price) return res.json({status:false,message:'more than one price is required.'});
     if(!type) return res.json({status:false,message:'amount is required.'});
     
     try{
         
         const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
         if(!admin) return res.json({status:false,message:"admin not found"})
         
         var driveway = await Driveway.findOne({where:{id,type,is_deleted:0}});
         if(on_first_car_price !=''){
             driveway.on_first_car = on_first_car_price;
         }
         if(on_first_car_price!=''){
              driveway.more_than_one = more_than_one_price;
         }
        driveway.save();
         
         return res.json({status:true,message:'Driveway Updated successfuly.'});
     }catch(err){
         
        return res.json({status:false,message:'something is wrong.'});
     }
});


//  get equipments

router.post('/get-equipments',accessToken,async(req,res) =>{
    try{
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
        
        const equipmentRaw = await Equipment.findAll({where:{is_deleted:0}});
        
        var commercial   = [];
        var residential  = [];
        var snow_plowing = [];
        
        for(var i=0; i<equipmentRaw.length; i++){
            
            if(equipmentRaw[i].type==1){
                commercial.push({
                    id:equipmentRaw[i].id,
                    name:equipmentRaw[i].name
                });
            }
            
            if(equipmentRaw[i].type==2){
                residential.push({
                     id:equipmentRaw[i].id,
                     name:equipmentRaw[i].name
                })
            }
            
            if(equipmentRaw[i].type==0){
                snow_plowing.push({
                    id:equipmentRaw[i].id,
                    name:equipmentRaw[i].name  
                })
            }
        }
        
        
        return res.json({status:true,data:{commercial,residential,snow_plowing},message:'Equipments lists.'});
    }catch(err){
         
        return res.json({status:false,message:'something is wrong.'}); 
    }
})

//block provider lists

router.post('/block-provider',accessToken,async(req,res)=>{
    try{
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
        
        // var pageAsNumber = Number.parseInt(req.query.page)
        // var sizeAsNumber = Number.parseInt(req.query.size)
        
        // var page = 1;
        // if(!Number.isNaN(pageAsNumber) && pageAsNumber>1)
        // {
        //     page = pageAsNumber
        // }
        // var size = 10;
        // if(!Number.isNaN(sizeAsNumber)&& sizeAsNumber<10 && sizeAsNumber>0)
        // {
        //     size= sizeAsNumber
        // }
        
        
        // const bproviderRaw= await User.findAndCountAll({
        //     where:{role:2,is_deleted:0,is_blocked:1},
        //      limit:size,
        //      offset:(page-1)*size,
            
        // })
        const bprovider= await User.findAll({
            where:{role:2,is_deleted:0,is_blocked:1}
        })
        
        const block_provider=[];
        
        // const bprovider=bproviderRaw.rows;
        
        //  return res.json(bprovider)
        
        for(var i=0; i<bprovider.length; i++)
        {
            block_provider.push({
                id:bprovider[i].id,
                name:bprovider[i].fristname+" "+bprovider[i].lastname,
                email:bprovider[i].email,
                mobile:bprovider[i].mobile,
                is_deleted:bprovider[i].is_deleted,
                is_blocked:bprovider[i].is_blocked
            })
        }
         return res.json({status:true,data:{block_provider},message:"Block Provider Data"})
        // return res.json({status:true,data:{block_provider,total_page:Math.ceil(bproviderRaw.count/size)},message:"block provider data"})
    }catch(err){
         
        return res.json({status:false,message:"Something is wrong"})
    }
})


//ADD CAR COLOR 

router.post('/add-carcolors',accessToken,async(req,res)=>{
    const {color,color_code} = req.body
    if(!color) return res.json({status:false,message:"color is require"})
    if(!color_code) return res.json({status:false,message:"color_code is require"})
    try{
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
         
         const checkname = await Color.findOne({where:{name:color,is_deleted:0}})
         if(checkname) return res.json({status:false,message:"color is already exist"})
         
         
          const checkcode = await Color.findOne({where:{color_code,is_deleted:0}})
         if(checkcode) return res.json({status:false,message:"color code is already exist"})
         
        const colors = await Color.create({name:color,color_code})
         
        
        return res.json({status:true,message:"Car Color Added"})
    }catch(err){
         
        return res.json({status:false,message:"Something is wrong"})
    }
})


//GET CAR COLOR 
router.post('/get-carcolor',accessToken,async(req,res)=>{
  
    
    try{
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
         
        const colors = await Color.findAll({where:{is_deleted:0}})
        
        return res.json({status:true,data:{colors},message:"Car Color Added"})
    }catch(err){
         
        return res.json({status:false,message:"Something is wrong"})
    }
})

//DELETE CAR COLOR

router.post('/delete-carcolor',accessToken,async(req,res)=>{
  const {color_id} = req.body
  if(!color_id) return res.json({status:false,message:"color_id is require"})
    
    try{
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
         
        const colors = await Color.findOne({where:{id:color_id}})
        colors.is_deleted=1;
        colors.save();
        return res.json({status:true,message:"Car Color Deleted"})
    }catch(err){
         
        return res.json({status:false,message:"Something is wrong"})
    }
})


//EDIT CAR COLOR

router.post('/edit-carcolor',accessToken,async(req,res)=>{
  const {color_id,colorname,color_code} = req.body
  
  if(!colorname) return res.json({status:false,message:"colorname is require"})
  if(!color_id) return res.json({status:false,message:"color_id is require"})
  if(!color_code) return res.json({status:false,message:"color_code is require"})
  
    try{
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
         
        const checkname = await Color.findOne({where:{name:colorname,is_deleted:0}})
        if(checkname) return res.json({status:false,message:"color is already exist"})
         
        const colors = await Color.findOne({where:{id:color_id,is_deleted:0}})
        
        colors.color_code = color_code;
        colors.name = colorname;
        colors.save();
        
        return res.json({status:true,message:"Car Color Update"})
    }catch(err){
         
        return res.json({status:false,message:"Something is wrong"})
    }
})



//edit provider documents and bank details


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

router.post('/edit-provider-docbank',upload.fields([{name:'identity'},{name:'license'},{name:'insurance'}]),accessToken,async(req,res)=>{
    
    const {provider_id,identity,license,insurance,newAccount_number,new_routing_number,newBank_name,ssn}=req.body
    
    if(!provider_id) return res.json({status:false,message:"provider id is require"})
    // if(!newAccount_number) return res.json({status:false,message:"newAccount_number is require"})
    // if(!new_routing_number) return res.json({status:false,message:"new_routing_number is require"})
    // if(!newBank_name) return res.json({status:false,message:"newBank_name is require"})
    
    try{
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
        
      
        const match = await User_detail.findOne({where:{provider_id,is_deleted:0}})
             
            
             if(req.files.identity){
                 match.identity = '/public/documents/'+req.files.identity[0].filename;
             }
             if(req.files.license){
             match.license ='/public/documents/'+req.files.license[0].filename;
             }
             if(req.files.insurance)
             {
               match.insurance = '/public/documents/'+req.files.insurance[0].filename;  
             }
             
             match.save();
       
        
        const bank_detail = await Bank_detail.findOne({where:{provider_id,is_deleted:0}})
          
             
             bank_detail.account_number= newAccount_number;
             bank_detail.bank_name =     newBank_name;
             bank_detail.routing_number = new_routing_number;
             bank_detail.save();
             
             
        const user_detail = await User.findOne({where:{id:provider_id,is_deleted:0}})
             user_detail.ssn = ssn;
             user_detail.save();
             
             
    if(user_detail.account_id !=null){
            
            const account = await stripe.accounts.update(
              user_detail.account_id,
              {
                 external_account:{


                        object:'bank_account',
                        country:'US',
                        currency:'usd',
                        routing_number:new_routing_number,
                        account_number:newAccount_number,
                    },
                     individual: {
                      ssn_last_4:ssn.substr(ssn.length -4)
                    },
                  
              }
            );
            
        }
             
             return res.json({status:"true",message:'Provider Details Updated '})
         
                
    }catch(err){
         
        // return res.json({status:false,message:"Something is wrong"})
          switch (err.type) {
        case 'StripeCardError':
        // A declined card error
         return res.json({status:false,message:err.message});
         // => e.g. "Your card's expiration year is invalid."
        break;
        case 'StripeRateLimitError':
        // Too many requests made to the API too quickly
         return res.json({status:false,message:err.message});
        break;
        case 'StripeInvalidRequestError':
        // Invalid parameters were supplied to Stripe's API
          return res.json({status:false,message:err.message});
        break;
        case 'StripeAPIError':
        // An error occurred internally with Stripe's API
        return res.json({status:false,message:err.message});
        break;
        case 'StripeConnectionError':
        // Some kind of error occurred during the HTTPS communication
          return res.json({status:false,message:err.message});
        break;
        case 'StripeAuthenticationError':
        // You probably used an incorrect API key
        return res.json({status:false,message:err.message});
        break;
        default:
        // Handle any other types of unexpected errors
        return res.json({status:false,message:'Something is wrong'});
        break;
        }
    }
})

 
//provider verify

router.post('/verify-provider',accessToken,async(req,res)=>{
  const {provider_id} = req.body
  if(!provider_id)return res.json({status:false,message:"proider_id is require"})
  
 
    try{
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
        
        const provider = await User.findOne({
        where:{id:provider_id,role:2,is_deleted:0},
        include:[
                {model:Provider_equipment,as:"provider_equipment"},
                {model:User_detail,as:"user_documents"}
                ]   
            
        })
        
        // return res.json(provider)
        
       if(provider.provider_equipment.length==[] && provider.user_documents==null)
       return res.json({status:false,message:"Plsase document and equipment add first."})
       
        
        provider.status=1;
        provider.save();
        
        
    return res.json({status:true,message:"Provider Verify"})
    }catch(err){
         
        return res.json({status:false,message:"Something Is Wrong"})
    }
})


//user verify

router.post('/verify-user',accessToken,async(req,res)=>{
  const {user_id} = req.body
  if(!user_id)return res.json({status:false,message:"user_id is require"})
  
 
    try{
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
     
        const user = await User.findOne({where:{id:user_id,role:1,is_deleted:0}})
        
   
        user.status=1;
        user.save();
        
    return res.json({status:true,message:"User Verify"})
    }catch(err){
         
        return res.json({status:false,message:"Something is wrong"})
    }
})

//add corner lot

router.post('/corner-lot',accessToken,async(req,res)=>{
  const {one_time,seven_days,ten_days,fourteen_days} = req.body
  if(!seven_days)return res.json({status:false,message:"seven_days price is require"})
  if(!ten_days)return res.json({status:false,message:"ten_days price is require"})
  if(!fourteen_days)return res.json({status:false,message:"fourteen_days price is require"})
  if(!one_time)return res.json({status:false,message:"one_time price is require"})
    try{
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
     
        const corner = await Corner_lot.create({
            price:one_time,
            seven_days_price:seven_days,
            ten_days_price:ten_days,
            fourteen_days_price:fourteen_days
            
        })
        
    return res.json({status:true,message:"Corner Lot Added"})
    }catch(err){
         
        return res.json({status:false,message:"Something is wrong"})
    }
})

// get corner lot

router.post('/get-corner-lot',accessToken,async(req,res)=>{
    
 
    try{
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
     
        const corner = await Corner_lot.findOne({where:{is_deleted:0}})
    
    
    return res.json({status:true,data:corner,message:"Corner Lot Show"})
    }catch(err){
         
        return res.json({status:false,message:"something is wrong"})
    }
})

// update corner lot

router.post('/update-corner-lot',accessToken,async(req,res)=>{
    
 const {corner_id,one_time,seven_days,ten_days,fourteen_days}=req.body
 
 if(!corner_id) return res.json({status:false,message:"corner_id is require"})
    try{
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
     
        const corner = await Corner_lot.findOne({where:{id:corner_id,is_deleted:0}})
        
        corner.price=one_time;
        corner.seven_days_price=seven_days;
        corner.ten_days_price=ten_days;
        corner.fourteen_days_price=fourteen_days;
        corner.save();
        
    
    return res.json({status:true,message:"Corner Lot Updated successfuly Done ."})
    }catch(err){
         
        return res.json({status:false,message:"Something is wrong"})
    }
})



//Service Delivery recommended

router.post('/service-delivery-recommended',accessToken,async(req,res)=>{
    
const {service_id} = req.body;
// if(!recommended) return res.json({stqatus:false,message:"recommended is require"})
if(!service_id) return res.json({status:false,message:"service_id is require"})
try{
    
   
    const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
    if(!admin) return res.json({status:false,message:"admin not found"})
    
    const service = await Service_period.findOne({where:{id:service_id,is_deleted:0}})
    service.recommended="Yes";
    service.save()
    
    
    await Service_period.update(
            {recommended:"No"},
            { where:{
                    id:{
                        [Op.not]:service_id
                       }
                    }
            })
    
    return res.json({status:true,message:"Service Recommended Has Been Updated"})
}catch(err){
     
    return res.json({status:false,message:"Something is wrong"})
}

   })





 //get admin fee lawn
 router.post('/get-admin-feeLawn',accessToken,async(req,res)=>{ 

try{
    
    const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
    if(!admin) return res.json({status:false,message:"admin not found"})

    const admin_fee = await Setting.findOne({where:{field_key:'admin_feeLawn',is_deleted:0}})
    
    return res.json({status:true,data:{admin_fee:admin_fee.field_value,fee_id:admin_fee.id},message:"Admin Fee Has Been Show"})
}catch(err){
     
    return res.json({status:false,message:"Something is wrong"})
}

  })

 //update admin fee lawn
 router.post('/update-admin-feeLawn',accessToken,async(req,res)=>{ 
const {fee_id,admin_feeLawn} = req.body;
if(!fee_id) return res.json({status:false,message:"fee_id is require"})
if(!admin_feeLawn) return res.json({status:false,message:"admin feeLawn is require"})
try{
    
    const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
    if(!admin) return res.json({status:false,message:"admin not found"})

    const admin_fees = await Setting.findOne({where:{id:fee_id,is_deleted:0}})
    admin_fees.field_value=admin_feeLawn;
    admin_fees.save();
    return res.json({status:true,message:"Admin Fee Has Been Updated"})
}catch(err){
     
    return res.json({status:false,message:"Something is wrong"})
}

  })
  
  
 //get admin fee snow
 router.post('/get-admin-feeSnow',accessToken,async(req,res)=>{ 

try{
    
    const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
    if(!admin) return res.json({status:false,message:"admin not found"})

    const admin_fee = await Setting.findOne({where:{field_key:'admin_feeSnow',is_deleted:0}})
    
    return res.json({status:true,data:{admin_fee:admin_fee.field_value,fee_id:admin_fee.id},message:"Admin Fee Has Been Show ."})
}catch(err){
     
    return res.json({status:false,message:"Something is wrong"})
}

  })

 //update admin fee snow
 router.post('/update-admin-feeSnow',accessToken,async(req,res)=>{ 
const {fee_id,admin_feeSnow} = req.body;
if(!fee_id) return res.json({status:false,message:"fee_id is require"})
if(!admin_feeSnow) return res.json({status:false,message:"Admin Fee Snow is require"})
try{
    
    const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
    if(!admin) return res.json({status:false,message:"admin not found"})

    const admin_fees = await Setting.findOne({where:{id:fee_id,is_deleted:0}})
    admin_fees.field_value=admin_feeSnow;
    admin_fees.save();
    return res.json({status:true,message:"Admin Fee Has Been Updated "})
}catch(err){
     
    return res.json({status:false,message:"Something is wrong"})
}

  })
 
//tax rate get admin snow
router.post('/taxrate-snow-get',accessToken,async(req,res)=>{
    try{
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
        
        
        const tax_rates= await Setting.findOne({where:{field_key:'tax_rate_snow',is_deleted:0}})
        
        return res.json({status:true,data:{tax_rate_id:tax_rates.id,tax_rate:tax_rates.field_value},message:"Tax Rate Show"})
    }catch(err){
         
        return res.json({tatus:false, message:"Something is require"})
    }
})



//tax rate update admin snow
 router.post('/update-taxrate-snow',accessToken,async(req,res)=>{ 
const {tax_rate_id,tax_rate} = req.body;
if(!tax_rate_id) return res.json({status:false,message:"Taxrate id is require"})
if(!tax_rate) return res.json({status:false,message:"Admin Tax Rate is require"})
try{
    
    const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
    if(!admin) return res.json({status:false,message:"admin not found"})

    const admin_tax = await Setting.findOne({where:{id:tax_rate_id,is_deleted:0}})
    admin_tax.field_value=tax_rate;
    admin_tax.save();
    return res.json({status:true,message:"Admin Tax Snow Has Been Updated"})
}catch(err){
     
    return res.json({status:false,message:"Something is wrong"})
}

  })
 

//tax rate get admin lawn
router.post('/taxrate-lawn-get',accessToken,async(req,res)=>{
    try{
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
        
        
        const tax_rates= await Setting.findOne({where:{field_key:'tax_rate_lawn',is_deleted:0}})
        
        return res.json({status:true,data:{tax_rate_id:tax_rates.id,tax_rate:tax_rates.field_value},message:"Tax Rate Show"})
    }catch(err){
         
        return res.json({tatus:false, message:"Somthing is require"})
    }
})



//tax rate update admin lawn
 router.post('/update-taxrate-lawn',accessToken,async(req,res)=>{ 
const {tax_rate_id,tax_rate} = req.body;
if(!tax_rate_id) return res.json({status:false,message:"Taxrate id is require"})
if(!tax_rate) return res.json({status:false,message:"Admin Tax Rate is require"})
try{
    
    const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
    if(!admin) return res.json({status:false,message:"admin not found"})

    const admin_tax = await Setting.findOne({where:{id:tax_rate_id,is_deleted:0}})
    admin_tax.field_value=tax_rate;
    admin_tax.save();
    return res.json({status:true,message:"Admin Tax Lawn Has Been Updated"})
}catch(err){
     
    return res.json({status:false,message:"Something is wrong"})
}

  })
 
 
//get report
router.post('/get-report',accessToken,async(req,res)=>{
    
    try{
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
        
       
        var reports= await Report.findAll({
            where:{is_deleted:0},
            include:[
                {model:User,as:"reportees"},
                {model:User,as:"reporters"}
                ]
        })
                     
//   return res.json(reports)
        return res.json({status:true,data:{reports},message:"Show Reports"})
    }catch(err){
         
        return res.json({status:false, message:"Something is wrong"})
    }
})


//add reason
router.post('/add-reasons',accessToken,async(req,res)=>{
    const {reason}=req.body;
    if(!reason) return res.json({status:false,message:"reason is require"})
    try{
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
        
       
        var reasons = await Reason.create({reason})        
        //  return res.json(reason)
        return res.json({status:true,message:"Reason Added"})
    }catch(err){
         
        return res.json({status:false, message:"Something is wrong"})
    }
})




//get reason
router.post('/get-reasons',async(req,res)=>{
    
    try{
       
        var reason= await Reason.findAll({
            where:{is_deleted:0}
           
        })        
        //  return res.json(reason)
        return res.json({status:true,data:{reason},message:"Show Reason"})
    }catch(err){
         
        return res.json({status:false, message:"Something is wrong"})
    }
})


//EDIT reason
router.post('/edit-reasons',accessToken,async(req,res)=>{
    const {reason_id,newreason}=req.body
    if(!reason_id) return res.json({status:false,message:"reason id is require"})
    if(!newreason) return res.json({status:false,message:"new reason is require"})
    try{
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
        
       
        var reasons= await Reason.findOne({where:{id:reason_id,is_deleted:0}}) 
        // return res.json(reasons)
        reasons.reason=newreason;
        reasons.save();
        
        return res.json({status:true,message:"Reason Is Update"})
    }catch(err){
         
        return res.json({status:false, message:"Something is wrong"})
    }
})




//Delete reason
router.post('/delete-reasons',accessToken,async(req,res)=>{
    const {reason_id}=req.body
    if(!reason_id) return res.json({status:false,message:"reason id is require"})
  
    try{
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
        
       
        var reasons= await Reason.findOne({where:{id:reason_id,is_deleted:0}}) 
        // return res.json(reasons)
        reasons.is_deleted=1;
        reasons.save();
        
        return res.json({status:true,message:"Reason Is Deleted"})
    }catch(err){
         
        return res.json({status:false, message:"Something is wrong"})
    }
})


//show radius
router.post('/radius',accessToken,async(req,res)=>{
    try{
         const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
         if(!admin) return res.json({status:false,message:"admin not found"})
        
        const radious= await Setting.findOne({where:{field_key:"radius",is_deleted:0}})
        return res.json({status:true,data:{radious},message:"Radius data show"})
        
    }catch(err){
         
        return res.json({status:false,messagge:"Something is wrong"})
    }
})

//update radius

router.post('/update-radius',accessToken,async(req,res)=>{
    const {field_value} = req.body
        if(!field_value) return res.json({status:false,message:"Field value is require"})
    try{
        
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
        
        const datas = await Setting.findOne({where:{field_key:'radius',is_deleted:0}})
        datas.field_value=field_value;
        datas.save()
        
        return res.json({status:true,message:"Radius is updated"})
        
    }catch(err){
         
        return res.json({status:false,message:"something is wrong"})
    }
})

//change provider
router.post('/change-provider',accessToken,async(req,res)=>{
    const {order_id,provider_id}= req.body
    if(!order_id) return res.json({status:false,message:"Order id is require"})
    if(!provider_id) return res.json({status:false,message:"Provider id is require"})
    try{
         const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
         if(!admin) return res.json({status:false,message:"admin not found"})
        
        const change= await Order.findOne({where:{order_id:order_id,is_deleted:0}})
        if(!change) return res.json({status:false,message:"Order id not match"})
        // return res.json(change)
        var  date_and_time=moment().format(); 
        
        change.assigned_to=provider_id;
        change.change_provider_assigned_date=date_and_time;
        
        if(change.status==1)
        {
        change.status=2;
        }
        
             if(change.on_the_way==1){
              change.on_the_way=0;
              change.save();
              
            }
            
            if(change.at_location==1){
              change.at_location=0;
              change.save();
            }
             if(change.started_job==1){
                change.started_job=0;
                change.save();
            }
           
           
        
        change.save();
        
        
          var provider= await User.findOne({where:{id:provider_id,is_deleted:0}})
        
        if(provider!=null){
        
             var message = { 
            to: provider.fcm_token , 
            collapse_key: '',
            
            notification:{
                            title:'Job Update',
                            body:'Admin has assigned a job to you'
                        },
            
             data:{
                            order_id:order_id,
                            title:'Job Update',
                            body:'Admin has assigned a job to you',
                            click_action:'new_order_assigned_by_admin'
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
        
        
        
        
         var getorder= await Order.findOne({where:{order_id}})
         var user= await User.findOne({where:{id:getorder.user_id,is_deleted:0}})
        
        if(user!=null){
        
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
               ;
            }else{
              console.log(response);
            }
             })
             
        }
        
        return res.json({status:true,message:"Provider changed ."})
        
        
    }catch(err){
         
        return res.json({status:false,message:"something is wrong"})
    }
})

//available provider

router.post('/available-provider',accessToken,async(req,res)=>{
   const {order_id}= req.body
   if(!order_id) return res.json({status:false,message:"Order id is require"})
    try{
         const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
         if(!admin) return res.json({status:false,message:"admin not found"})
        
        const order = await Order.findOne({
            where:{is_deleted:0,order_id},
            // include:[{model:Provider_equipment,as:'provider_equipment',where:{is_deleted:0}}],
        })
 
        var providereq = await  Provider_equipment.findAll({
            where:{category_id:order.category_id},
            attributes:[ [Sequelize.fn('DISTINCT', Sequelize.col('provider_id')) ,'provider_id']],
            
        });
       
        const provider=[];
        
        var property = await Property.findByPk(order.property_id);
    // return res.json(property)
      
        for(var i=0; i<providereq.length; i++)
        {
         var document_chack= await User_detail.findOne({where:{is_deleted:0,provider_id:providereq[i].provider_id}})  
         
         if(document_chack != null){
             
            var radius    = await Setting.findOne({where:{field_key:'radius'}});
            var providers = await User.findOne({
                where:{id:providereq[i].provider_id,is_deleted:0,is_blocked:0,admin_approved:1},
                attributes:['id','fristname','lastname',[Sequelize.literal("6371 * acos(cos(radians("+parseFloat(property.lat)+")) * cos(radians(lat)) * cos(radians("+parseFloat(property.lng)+") - radians(lng)) + sin(radians("+parseFloat(property.lat)+")) * sin(radians(lat)))"),'distance']],
                            having: Sequelize.literal('distance < '+parseFloat(radius.field_value)),
                            logging: console.log,
                });
             
                if(providers){
                    provider.push({
                    id:providers.id,
                    name:providers.fristname+' '+providers.lastname,
                    })
                }
        }
        
        }
     
        return res.json({status:true,data:{provider},message:"Available - provider"})
    }catch(err){
        return res.json(err)
        //  
        return res.json({status:false,message:"something is wrong"})
    }
})

//cancel order

router.post('/cancel-order',accessToken,async(req,res)=>{
    const {order_id} = req.body
    if(!order_id) return res.json({status:false,message:"Order id is require"})
    try{
        // return res.json("okk")
        const admin= await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"Admin not found"})
        
        const order =await Order.findOne({where:{order_id,is_deleted:0}})
        if(order.status==4)
        {
            return res.json({status:false,message:'This order already cancelled'})
        }
        order.status=4
        order.save()
        
        var provider= await User.findOne({where:{id:order.assigned_to,is_deleted:0}})
        
        if(provider!=null){
          var payload = {
            notification:{
            
            title:'Job Update',
            body:'Your job has been cancelled by admin'
            },
            data:{
                order_id:order_id,
                title:'Job Update',
                body:'Your job has been cancelled by admin',
                click_action:'your_job_cancel_by_admin'
            }
            };
            
            var options = {
            priority: "high",
            timeToLive: 60 * 60 * 24,
            };
            
          var fcm =  provider.fcm_token ;
        // return res.json(fcm)
          var test =   providerpush.messaging().sendToDevice(fcm,payload,options)
        
        
        }
        
        return res.json({status:true,message:"Order has been cancelled"})
        
    }catch(err){
         
        return res.json({status:false,message:"Something is wrong"})
    }
})


//cancel recurring order
router.post('/cancel-recurring-order',accessToken,async(req,res)=>{
    const {order_id} = req.body
    if(!order_id) return res.json({status:false,message:"Order id is require"})
    try{
        // return res.json("okk")
        const admin= await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"Admin not found"})
        
        const order =await Recurring_history.findOne({where:{order_id,is_deleted:0}})
         if(order.status=='Cancel')
        {
            return res.json({status:false,message:'This order already cancelled'})
        }
        order.status='Cancel';
        order.is_deleted=1;
        order.save();
        
        var user = await User.findOne({where:{is_deleted:0,id:order.user_id}})
        
        if(user.fcm_token !=''){
                
            //start notification  
            var message = { 
            to: user.fcm_token, 
            collapse_key: '',
            
            notification:{
                title:'Order Update',
                body:'Your recurring order has been cancelled by admin'
            },
            
             data:{
                order_id:order_id,
                title:'Order Update',
                body:'Your recurring order has been cancelled by admin',
                click_action:'cancel_order'
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
        
        
        return res.json({status:true,message:"Recurring order has been cancelled"})
        
    }catch(err){
         
        return res.json({status:false,message:"Something is wrong"})
    }
})

//Recurring Jobs (recurring orders)

router.post('/recurring-job',accessToken,async(req,res)=>{
    
    try{
        
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"Admin not found"})
       
        const recurring = await Recurring_history.findAll({
            where:{is_deleted:0,status:{[Op.not]:"Pending"}},
            order:[['id','desc']],  
            include:[
                 {
                  model:User,as:'userdata'
                 }
                 ]
            
        })
        //  return res.json(recurring)
        
        const plus= [];
        for(var i=0;i<recurring.length;i++){
            
            if(recurring[i].on_every==7){
                  var recurrings="Every 7 Days"
                  }
            if(recurring[i].on_every==10){
                  recurrings="Every 10 Days"
                  }
            if(recurring[i].on_every==14){
                  recurrings="Every 14 Days"
                  }
             
          
           
           var last_date_details=await Order.findOne({
               where:{is_deleted:0,parent_recurrent_order_id:recurring[i].order_id},
               order:[['id','desc']]})
          
          
           
           var last_date="";
            if(last_date_details!=null)
            {
                 
               var last_date = moment(last_date_details.createdAt).format('YYYY-MM-DD');
           
               var startdate = last_date;
               var new_date = moment(startdate, "YYYY-MM-DD").add(recurring[i].on_every, 'days');
            }
           
           
           
           
            //  return res.json({startdate,new_date})    
            plus.push({
                id:recurring[i].id,
                order_id:recurring[i].order_id,
                user_id:recurring[i].user_id,
                user_name:recurring[i].userdata.fristname+' '+recurring[i].userdata.lastname,
                provider_id:recurring[i].provider_id,
                recurring_plan:recurrings,
                city:recurring[i].userdata.city,    
                state:recurring[i].userdata.state,
                status:recurring[i].status,
                // next_service:new_date.format("YYYY-MM-DD"),
                last_service:(last_date) ? last_date : "" ,
                // next_service:(new_date) ? new_date.format("YYYY-MM-DD") : "",
                next_service:recurring[i].date,
            
                
            })
        }
        
        return res.json({status:true,data:{plus},message:"Recurring Jobs"})
        
    }catch(err){
         
        return res.json({status:false,message:"Something is wrong"})
    }
})


// //View Recurring Jobs

// router.post('/view-recurring',accessToken,async(req,res)=>{
//     const {order_id}=req.body
//     if(!order_id) return res.json({status:false,message:"Order id is require"})
//     try{
        
//         const admin= await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
//         if(!admin) return res.json({status:false,message:"Admin not found"})
        
//         const recurring_user = await Recurring_history.findOne({
//             where:{order_id:order_id,is_deleted:0},
//             include:[
//                 {model:Lawn_size,as:'lawn_size_details'},
//                 {model:Fence,as:'fence_details'},
//                 {model:Corner_lot,as:'corner_details'}
//                 ]
            
//         })
//         var recurring_details={
//             id:recurring_user.id,
//             order_id:recurring_user.order_id,
//             lawn_size:(recurring_user.lawn_size_details)?recurring_user.lawn_size_details.name:"NA",
//             lawn_price:(recurring_user.lawn_size_amount.length>0)?recurring_user.lawn_size_amount:0.00,
//             fence_size:(recurring_user.fence_details)?recurring_user.fence_details.name:'NA',
//             fence_price:(recurring_user.fence_amount.length>0)?recurring_user.fence_amount:0.00,
//             corner_lot_price:(recurring_user.corner_amount)?recurring_user.corner_amount:0.00,
//             admin_fee:(recurring_user.admin_fee)?recurring_user.admin_fee:0.00,
//         }
        
//       return res.json({status:true,data:{recurring_details},message:"Recurring data"})  
//     }catch(err){
//          
//         return res.json({status:false,message:"Something is wrong"})
//     }
// })



//CHANGE RECURRING WEEK
router.post('/change-recurring',accessToken,async(req,res)=>{
    const {order_id,days}=req.body
    if(!order_id) return res.json({status:false,message:"Order id is require"})
    if(!days) return res.json({status:false,message:"Days is require"})
    try{
        
        const admin= await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"Admin not found"})
        
        const recurring_user = await Recurring_history.findOne({
            where:{order_id:order_id,is_deleted:0},
            include:[
                {
                 model:User,as:'userdata'
                }
            ]
            })
           
            // return res.json(recurring_user.userdata)
             recurring_user.on_every=days;
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
            else{ 
                var reslt = await client.messages.create({ 
                    body: `Your recurring service timing has been changed`,
                    from: "+17075874531",
                    to: "+91"+user.mobile,
                    // to:"+917447070365"
                  });
                //end notification
                } 
        
   
      return res.json({status:true,message:"Recurring job timing has changed"})  
    }catch(err){
         
        return res.json({status:false,message:"Something is wrong"})
    }
})

//available recurring
 router.post('/available-recurring-days',accessToken,async(req,res)=>{
     try{
         
         const admin= await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
         if(!admin) return res.json({status:false,message:"Admin not found"})
         
         var available_recurring= await Service_period.findAll({where:{type:2,is_deleted:0}})
         return res.json({status:true,data:{available_recurring},message:"Available recurring days"})
     }catch(err){
          
         return res.json({status:false,message:"Somthing is wrong"})
     }
 })


//   // get yard cleanup bass details  

//   router.post('/yard-cleanup-body',accessToken,async(req,res)=>{
      
//  try{
//       const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
//       if(!admin) return res.json({status:false,message:"admin is deleted"})

//       var lawn = await Lawn_size.findAll({where:{is_deleted:0}});
     
//      // return res.json({cleanup,lawn})
//       var pricebox=[];
    
//       var lawn_size=[];
//       for(i=0; i<lawn.length; i++)
//       {
//         lawn_size.push({
//             id:lawn[i].id
//         })  
        
         
//       }
//     //   return res.json(lawn_size)
//       var body=[];
//     //var bodyi=[];
    
//       for(i=0; i<lawn_size.length; i++)
//       {
        
//         var cleanup = await Cleanup.findOne({where:{is_deleted:0,lawn_size_id:lawn_size[i].id}})
        
//         // if(cleanup.name=="Heavy Clean up"){
//         body.push({
            
//             // lawn_size_id:cleanup.lawn_size_id,
//             name:cleanup.name,
//             col_1:cleanup.price,
            
//         })
//     //   }
        
       
//       }
//       return res.json({body})
//       return res.json({status:true,data:{pricebox},message:"Show Yard Cleanup"})
//      }catch(err){
//          
//         return res.json({status:false,message:"Something is wrong"});
//     }
// })


// get yard cleanup bass details  


router.post('/get-cleanuptest',async(req,res) =>{
    
    // const {lawn_size_id} = req.body;
    
    // if(!lawn_size_id) return res.json({status:false,message:"lawn size is required."});
    
    try{
    
          var cleanup = await Cleanup.findAll({
                  where:{is_deleted:0},
                  attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('name')) ,'name']]
              });
              
              
            //   return res.json(cleanup)
          var clean_id    =[];
          
          var datalist    = [];
         
          for(var i=0; i < cleanup.length; i++){
              
              var cleanupRaw = await Cleanup.findAll({
                  where:{name:cleanup[i].name,is_deleted:0},
                  order:[['id','asc']]
                  
              });
             
              var obj ={};
              obj["name"] =cleanup[i].name;
             
              for(var j=0; j<cleanupRaw.length; j++){
                //  obj[`colid_${j+1}`]=cleanupRaw[j].id,
                 obj[`col_${j+1}`] =cleanupRaw[j].price
                
              }
              
              datalist.push(obj)
               
            //   var colid=[];
          
           
          }
         
          
    //   return res.json({datalist})
        
        
         return res.json({status:true,data:{datalist},message:'Available clean up list for this lawnsize'})
    }catch(err){
         
      return res.json({status:false,message:'Something is wrong.'}); 
    }
})







//after order complete order details
    
router.post('/recurring-order-details',accessToken,async(req,res)=>{
    const { order_id }=req.body
    //if(!user_id) return res.json({status:false,message:"user_id is require"})
      if(!order_id) return res.json({status:false,message:"Order_id is require"})
    
    try{
        
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"Admin not found"})
         
        
         const order = await Recurring_history.findOne({
            where:{order_id},
           
             include:[
                      {model:User,as:'provider'},
                      {model:Lawn_size ,as:'lawn_size_details'},
                      {model:Lawn_height,as:'lawn_height'},
                      {model:User,as:'userdata'},
                      {model:Fence,as:'fence_details'},
                      {model:Cleanup,as:'cleanup'},
                      {
                          model:Order_sidewalk,as:'order_sidewalks',
                          include:[{model:Sidewalk,as:"sidewalk"}],
                        //   where:{is_deleted:0}
                      },
                      {
                          model:Order_walkway,as:'order_walkways',
                          include:[
                              {
                                  model:Walkway,as:'walkway'
                              }],
                      },
                       {
                          model:Order,as:'order_table'
                      },
                     {model:Transaction,as:'transaction_details'},
                    //   {
                    //       model:Recurring_history,as:'recurring_view'
                    //   },
                       
                    //   {model:Subcategory,as:"subcategory"},
                    //   {model:Color,as:"color"},
                     ]
          })
        //   return res.json(order)
           if(!order) return res.json({status:false,message:'Order id not exist'})
       

            if(order.status=='Pending'){
              var status = 'Pending';                
            }
             if(order.order_table.provider_assigned_date!=null)
            {
                var status='Provider Assigned'
            }
            if(order.status=='Accepted'){
                var status ='Accepted'
            }
            if(order.status=='Cancel'){
                var status='Cancel'
            }
             
            
            // if(order.order_table.on_the_way==1 && order.order_table.on_the_way!='' ){
            //   var status='On The Way'    
            // } 
            // if(order.order_table.at_location==1 && order.order_table.at_location!=''){
            //   var status='Location Reached'    
            // }
            //  if(order.order_table.started_job==1 && order.order_table.started_job!=''){
            //   var status='Job Started'    
            // }
            // if(order.order_table.finished_job==1 && order.order_table.finished_job!=''){
            //   var status='Job End'    
            // }
            // if(order.order_table.status==3){
            //     var status='Completed'
            // }
            if(order.category_id==1)
            {var services="Lawn Mowing"}
            
            if(order.category_id==2)
            {var services="Snow Plowing"}
            
             
            if(order.category_id==0)
            {var services=""}
            
            if(order.order_table.service_type==1)
            {var serviced="One Time"}
            if(order.order_table.service_type==2)
            {var serviced="Recurring"}
            if(order.order_table.service_type==0)
            {var serviced=""}
             
            
             var before_order_image = await Order_image.findAll({where:{order_id:order.order_id,type:'before',is_deleted:0}});
             var after_order_image = await Order_image.findAll({where:{order_id:order.order_id,type:'after',is_deleted:0}});
            //  var fences_price= await Service_period.findOne({where:{type:order.service_type,is_deleted:0}});
            
             var reviews= await Review.findOne({where:{user_id:order.user_id,is_deleted:0}});
             if(reviews!=null){
             var review = reviews.rating;
             var comment= reviews.comment;
             }
             var property_image= await Property.findOne({where:{id:order.property_id,is_deleted:0}});
             var  commission= await Setting.findOne({where:{field_key:"admin_commission",is_deleted:0}})
        
            
        //   return res.json(property_image)
            
           
            
            //   var startdate = order.date;
            //   var new_date = moment(startdate, "YYYY-MM-DD").add(order.on_every, 'days');
            
           
             const side=[];
             for(let j=0; j<order.order_sidewalks.length ; j++)
             {
                 side.push({
                     amount:order.order_sidewalks[j].amount,
                     size:order.order_sidewalks[j].sidewalk.name
                 })
             }
             
             const walk=[]
             if(order.order_walkways!=null){
             for(let i=0; i<order.order_walkways.length; i++)
             {
                 walk.push({
                     amount:order.order_walkways[i].amount,
                     size:order.order_walkways[i].walkway.name
                 })
             }
             }
             
        //      var discounts='';
        //      if(order.coupon_type==1)
        //      { discounts="Flat"}
        //      if(order.coupon_type==2)
        //      { discounts="Percentage"}
        //     //  const sidewalks_name=[]
        //     // if(order.order_sidewalks!=null){
        //     //      for(i=0;i<order.order_sidewalks.length;i++){
        //     //          sidewalks_name.push({
        //     //              sidewalk_size:order.order_sidewalks[i].sidewalk.name
        //     //          })
        //     //      }
        //     //   }
        //     //  return res.json(property_image)
            
           
              if(commission.field_value!=null){
               var commision_value= commission.field_value/100*order.total_amount
             var provider_am = (order.total_amount-commision_value-order.admin_fee)
            }
         
            
            
    //   return res.json(order)
          var order_details ={
              order_id:order.order_id,
            //   date:moment(order.date).format('MM/DD/YYYY'),
            //   time:moment(order.date).format('ha z'),
              status:status,
              service:services,
              sub_total:order.total_amount,
              grand_total:order.grand_total,
              
              provider_id:(order.provider) ? order.provider.id:'',
              provider_name:(order.provider) ? order.provider.fristname+" "+order.provider.lastname:'',
              
              user_id:(order.user_details) ? order.user_details.id : '',
              user_name:(order.userdata) ? order.userdata.fristname+" "+order.userdata.lastname:'',
              mobile:(order.provider) ? order.provider.mobile:'',
              address:(order.provider) ? order.provider.address:'',
              service_delivery:serviced,
              
              lawnsizeid:(order.lawn_size_details !=null) ? order.lawn_size_details.id :'',
              lawnsize:(order.lawn_size_details!=null) ? order.lawn_size_details.name :'',
              lawnsize_price:(order.lawn_size_amount)?order.lawn_size_amount:"0.00",
              lawnheightid:(order.lawn_height!=null) ? order.lawn_height.id :'',
              lawnheight:(order.lawn_height!=null) ? order.lawn_height.name :'',
              
              fencesize:(order.fence_details!=null) ? order.fence_details.name :'NA',
              fence_id:(order.fence_id) ? order.fence_id :'NA',
              fence_price:(order.fence_amount) ? order.fence_amount:"0.00",
              
              cleanup_price:(order.cleanup_amount) ? order.cleanup_amount:"0.00",
              corner_lot_price:(order.corner_lot_amount)?order.corner_lot_amount:"0.00",
              corner_lot_id:(order.corner_lot_id)?order.corner_lot_id:"NA",
              
              admin_fee:(order.admin_fee)?order.admin_fee:"0.00",
              tax_price:(order.tax)?order.tax:"0.00",
              tax_rate:(order.tax_perc>0)?order.tax_perc:0.00,
              gate_code:(order.order_table.gate_code) ? order.order_table.gate_code:'',
              
              img1:(order.img1) ? order.img1:'',
              img2:(order.img2) ? order.img2:'',
              img3:(order.img3) ? order.img3:'',
              img4:(order.img4) ? order.img4:'', 
              
              property_image:(property_image) ? property_image.image:'',
              property_address:(property_image) ? property_image.address:'',
              before_image:(before_order_image.length> 0) ? before_order_image:[],
              after_image:(after_order_image.length > 0) ? after_order_image:[],
              
              yardname:(order.cleanup!=null) ? order.cleanup.name :'NA',
              carnumber:(order.car_number) ? order.car_number:'NA',
              driveway_price:(order.driway_amount) ? order.driway_amount:"0.00",
              
             // walkway_price:(order.walkway_amount) ? order.walkway_amount:"0",
             
              user_rating:(review) ? review :0,
              user_comment:(comment) ? comment : '',
              sideway_amount_size:(side.length>0)? side:[],
              walkway_amount_size:(walk.length>0)? walk:[],
              
              lawnheight_price:(order.lawn_height_amount)?order.lawn_height_amount:"0.00",
            //   cornerlot_price:(order.corner_lot_amount) ? order.corner_lot_amount:"0",
            
              car_type:(order.subcategory)? order.subcategory.name :"NA",
              car_price:(order.subcategory)? order.subcategory.price :"0",
              car_color:(order.color)?order.color.name:"NA",
              category:(order.service_for)?order.service_for:"NA",
              
            //  discount_type:discounts,
            
              discount:(order.discount_value)?order.discount_value:0.00,
              discount_rs:(order.discount_amount)?order.discount_amount:0.00,
              
              tip:(order.tip)?order.tip:0.00,
            
              customer_instruction:(order.order_table.instructions)?order.order_table.instructions:'NA',
              
              admin_commission:(order.admin_commission)?order.admin_commission:0,
              
              on_demand_fee:(order.on_demand_fee)?order.on_demand_fee:0,
              
            //   date:moment(order.date).format('MM/DD/YYYY'),
            //   time:moment(order.createdAt).format('LT'),//order ime
            
            //   schedule_date:(new_date) ? new_date.format("YYYY-MM-DD"):'',
              schedule_date:(order.date) ? order.date:'',
              provider_assigned:(order.order_table.assigned_to)?1:0,
              job_completed:(order.status==3)?1:0,
              payment_successful:(order.order_table.payment_status==2)?1:0,
            //   provider_change_status: (order.order_table.change_provider_assigned_date!=null) ? 1:0,
              
              
              on_the_way:(order.on_the_way)?order.on_the_way:0,
              location_reached:(order.at_location)?order.at_location:0,
              started_job:(order.started_job)?order.started_job:0,
              end_job:(order.finished_job)?order.finished_job:0,
              
              
              coupon_code:(order.coupon_code) ? order.coupon_code:'NA',
              recurring_days:(order.on_every) ? order.on_every+' '+"Days":"NA",
              
              provider_amount:(provider_am) ? provider_am:'',	
              
              transaction_id:(order.transaction_details!=null) ? order.transaction_details.transaction_id:'',
              payment_date:(order.transaction_details!=null) ? moment(order.transaction_details.updatedAt).format('MM/DD/YYYY'):'',
              payment_time:(order.transaction_details!=null) ? moment(order.transaction_details.updatedAt).format('LT'):'',
              
            //   provider_assigned_date:(order.order_table.provider_assigned_date!=null) ? moment(order.order_table.provider_assigned_date).format('MM/DD/YYYY'):'',
            //   provider_assigned_time:(order.order_table.provider_assigned_date!=null) ? moment(order.order_table.provider_assigned_date).format('LT'):'',
              
              
            //   on_the_way_date:(order.order_table.on_the_way_date!=null) ? moment(order.order_table.on_the_way_date).format('MM/DD/YYYY'):'',
            //   on_the_way_time:(order.order_table.on_the_way_date!=null) ? moment(order.order_table.on_the_way_date).format('LT'):'',
              
            //   at_location_date:(order.order_table.at_location_date!=null) ? moment(order.order_table.at_location_date).format('MM/DD/YYYY'):'',
            //   at_location_time:(order.order_table.at_location_date!=null) ? moment(order.order_table.at_location_date).format('LT'):'',
              
            //   started_job_date:(order.order_table.started_job_date!=null) ? moment(order.order_table.started_job_date).format('MM/DD/YYYY'):'',
            //   started_job_time:(order.order_table.started_job_date!=null) ? moment(order.order_table.started_job_date).format('LT'):'',
              
              
            //   finished_job_date:(order.order_table.finished_job_date!=null) ? moment(order.order_table.finished_job_date).format('MM/DD/YYYY'):'',
            //   finished_job_time:(order.order_table.finished_job_date!=null) ? moment(order.order_table.finished_job_date).format('LT'):'',
              
            //   cancel_order_date:(order.order_table.cancel_order_date!=null) ? moment(order.order_table.cancel_order_date).format('MM/DD/YYYY'):'',
            //   cancel_order_time:(order.order_table.cancel_order_date!=null) ? moment(order.order_table.cancel_order_date).format('LT'):'',
              
            //   change_provider_assigned_date:(order.order_table.change_provider_assigned_date!=null) ? moment(order.order_table.change_provider_assigned_date).format('MM/DD/YYYY'):'',
            //   change_provider_assigned_time:(order.order_table.change_provider_assigned_date!=null) ? moment(order.order_table.change_provider_assigned_date).format('LT'):'',
            }
       
    //   return res.json(order_details)
        
     return res.json({status:true,data:{order_details},message:"Order Details"})
       
    }catch(err){
         
        // return res.json(err)
        return res.json({status:false,message:"something is wrong"})
    }
})




  
//lawn size some details edit

router.post('/edit-prices',accessToken,async(req,res)=>{
    const {order_id,lawn_id,lawn_amount,fence_id,fence_amount,corner_id,corner_amount}= req.body
    if(!order_id) return res.json({status:false,message:"Order id is required"})
    try{
        
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
         
        var recurring_user= await Recurring_history.findOne(
            {where:{order_id:order_id,is_deleted:0},
            include:[
                {
                 model:User,as:'userdata'
                }
                ]
        })
    //    return res.json(recurring_user.userdata.mobile)
        if(lawn_id!=null)
        {
            
            if(!lawn_amount) return res.json({satatus:false,message:"Select lawn amount "})
            
            if(recurring_user.lawn_size_id==lawn_id){
                
                recurring_user.lawn_size_amount=parseInt(lawn_amount)
                recurring_user.save();
            }
        }
        
         if(fence_id!=null)
        {
            
            if(!fence_amount) return res.json({satatus:false,message:"Select fence amount "})
            
            if(recurring_user.fence_id==fence_id){
                recurring_user.fence_amount=parseInt(fence_amount)
                recurring_user.save();
             }
        }
        
        if(corner_id!=null)
        {
            
            if(!corner_amount) return res.json({status:false,message:'Select amount '})
            
             if(recurring_user.corner_lot_id==corner_id){
               
                recurring_user.corner_lot_amount=parseInt(corner_amount)
                recurring_user.save();
            }
        }
        
         var total_price =( 
            recurring_user.lawn_size_amount +
           
            recurring_user.fence_amount +
            recurring_user.corner_lot_amount +
            recurring_user.admin_fee 
         ) 
        recurring_user.total_amount=total_price; 
        recurring_user.grand_total =(total_price + recurring_user.tax)
        recurring_user.save()
            // return res.json(recurring_user.userdata.fcm_token)
        if(recurring_user.userdata.fcm_token!=''){
                
            //start notification  
            var message = { 
            to: recurring_user.userdata.fcm_token, 
            collapse_key: '',
            
           notification:{
            
            title:'Order Update',
            body:`Your price has been changed`
            },
             data:{
                order_id:order_id,
                title:'Order Update',
                body:`Your price has been changed`,
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

           
            }
            else{ 
            var reslt = await client.messages.create({ 
                body: `Your price has been changed`,
                from: "+17075874531",
                to: "+1"+recurring_user.userdata.mobile,
                // to:"+917447070365"
              });
            //end notification
            } 
        
        return res.json({status:true,data:{recurring_user},message:'successfuly price updated'})
    }catch(err){
         
        return res.json({status:false,message:"Something is wrong"})
    }
})


//recurring order delete


router.post('/recurring-delete',accessToken,async(req,res)=>{
    const {order_id} = req.body
    if(!order_id) return res.json({stats:false,message:"Order id is required"})
    try{
        
        const admin= await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"Admin not found"})
       
        var recurring = await Recurring_history.findOne({where:{order_id}})
        
         recurring.is_deleted=1;
         recurring.save();
      
        
        return res.json({status:true,message:"Deleted"})
        
    }catch(err){
         
        return res.json({status:false,message:"Something is wrong"})
    }
})

//edit yard cleanup

 router.post('/edit-cleanup',accessToken,async(req,res)=>{
  var {cleanup_name}=req.body
  if(!cleanup_name) return res.json({status:false,message:'Cleanup name required'})
  try{
      
      const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
      if(!admin) return res.json({status:false,message:"admin not found"})
    
      var cleanups = await Cleanup.findAll({
          where:{name:cleanup_name,is_deleted:0},
          
             include:[
                      {model:Lawn_size,as:'lawn_size_table'}
              ]
                      
      }) 
      
      if(cleanups==null) return res.json({status:false,message:"Cleanup Name Not Exist"})
      
      var details=[];
      
    //  return res.json(cleanups)
    
      for(var i=0; i<cleanups.length; i++){
          details.push({
            id:cleanups[i].id,
            name:cleanups[i].name,
            price:cleanups[i].price,
            lawn_size_id:cleanups[i].lawn_size_id,
           lawn_size_name:(cleanups[i].lawn_size_table!=null) ? cleanups[i].lawn_size_table.name:'',
            
          })
        //   cleanups[i].is_deleted=1;
        //   cleanups[i].save();
      }
      
      details.sort((a, b) => parseFloat(a.id) - parseFloat(b.id));
  return res.json({status:true,data:{details},message:'Cleanup details'})
   
     }catch(err){
         
        return res.json({status:false,message:"Something is wrong"});
    }
  })

//delete  yard cleanup

router.post('/delete-cleanup',accessToken,async(req,res)=>{
  var {cleanup_name}=req.body
  if(!cleanup_name) return res.json({status:false,message:'Cleanup name required'})
  try{
      
      const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
      if(!admin) return res.json({status:false,message:"admin not found"})
    
      var cleanups = await Cleanup.findAll({
          where:{name:cleanup_name}}) 
      
      if(cleanups==null) return res.json({status:false,message:"Cleanup Name Not Exist"})
      
      var details=[];
      
    //  return res.json(cleanups)
    
    for(var i=0; i<cleanups.length; i++)
    {
         cleanups[i].is_deleted=1;
         cleanups[i].save();
        
    }
        
     return res.json({status:true,message:'Cleanup Deleted'})
      
     }catch(err){
         
        return res.json({status:false,message:"Something is wrong"});
    }
  })
        


// //update yard cleanup

//  router.post('/update-cleanup',accessToken,async(req,res)=>{
//   var {capsule}=req.body//eske andar clenupid jayegi
//   if(!capsule) return res.json({status:false,message:'Cleanup required'})
//   try{
      
//       const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
//       if(!admin) return res.json({status:false,message:"admin not found"})
    
//       var data = (capsule[0].id);
//     //   return res.json("okk")
//       for(i=0; i<capsule.length ; i++)
//       {
//              var check = await Cleanup.findOne({where:{id:capsule[i].id,is_deleted:0}});
//         //   return res.json(check)
//              check.price=capsule[i].price;
//              check.save();
//       }
//     // return res.json({status:true,message:"Cleanup updated"})
      
      
       
//   return res.json({status:true,message:'Cleanup updated'})
   
//      }catch(err){
//          
//         return res.json({status:false,message:"Something is wrong"});
//     }
//   })
  





//add yard cleanup

  router.post('/update-cleanup',accessToken,async(req,res)=>{
  const {capsule}=req.body
//   return res.json(capsule)
    
//   if(!name) return res.json({status:false,message:"Name is require"})
 
  try{
      
      
      const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
      if(!admin) return res.json({status:false,message:"admin not found"})
    
    
     var data = (capsule[0].name);
     var check = await Cleanup.findAll({where:{name:data,is_deleted:0}});
    
      for(var i=0; i<check.length; i++)
      {
          check[i].is_deleted=1;
          check[i].save();
      }
     
    //  return res.json(check)
    // function isLetter(c) {
    //  return c.toLowerCase() != c.toUpperCase();
    //   }
    
    // if(check!=null){
    //  if(data==check.name) return res.json({status:false,message:"This cleanup type is already exist"})
    // }
    //   return res.json('okk')
     for(var i=0; i<capsule.length; i++)
     {
      var lsize = await Lawn_size.findOne({where:{is_deleted:0,id:capsule[i].lawn_size_id}})
     // if(!lsize) return res.json({status:false,message:'Lawn size id not match'})
      
          if(lsize){
                await Cleanup.create({
                 
                lawn_size_id:capsule[i].lawn_size_id,
                price:parseFloat(capsule[i].price),
                name:capsule[i].name
            
              });    
          }
       
     }
    
     return res.json({status:true,message:" Yard Cleanup Update successfuly."})
     
    }catch{
         
        return res.json({status:false,message:"Something is wrong"});
    }
  })





//provider assigned

router.post('/provider-assigned',accessToken,async(req,res)=>{
    const {order_id,provider_id}= req.body
    if(!order_id) return res.json({status:false,message:"Order id is require"})
    if(!provider_id) return res.json({status:false,message:"Provider id is require"})
    try{
         const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
         if(!admin) return res.json({status:false,message:"admin not found"})
        
        const change= await Order.findOne({where:{order_id:order_id,is_deleted:0}})
        if(!change) return res.json({status:false,message:"Order id not match"})
        
        // return res.json(change)
        var  date_and_time=moment().format(); 
        
        change.assigned_to=provider_id;
        change.provider_assigned_date=date_and_time;
        
        if(change.status==1)
        {
        change.status=2;
        }
        
        change.save();
        
        var provider= await User.findOne({where:{id:provider_id,is_deleted:0}})
        
        if(provider!=null){
        
             var message = { 
            to: provider.fcm_token , 
            collapse_key: '',
            
            notification:{
                            title:'Job Update',
                            body:'Admin has assigned a job to you'
                        },
            
             data:{
                            order_id:order_id,
                            title:'Job Update',
                            body:'Admin has assigned a job to you',
                            click_action:'new_order_assigned_by_admin'
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
        
    
         var getorder= await Order.findOne({where:{order_id}})
         var user= await User.findOne({where:{id:getorder.user_id,is_deleted:0}})
        
        if(user!=null){
        
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
               ;
            }else{
              console.log(response);
            }
             })
             
        }
             
        // return res.json(provider)
        
        return res.json({status:true,data:{fcm},message:"Provider changed ."})
        
        
    }catch(err){
         
        return res.json({status:false,message:"something is wrong"})
    }
})


// const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

// const refund = await stripe.refunds.create({
//   charge: 'ch_3JjhBz2eZvKYlo2C1VWOjsgk',
// });








// generate stripe connect account

router.post('/generate-connect-account',accessToken,async(req,res) =>{
     const {provider_id} = req.body;
     
     try{
            var admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
            if(!admin) return res.json({status:false,message:"admin not found"})
            
            var user = await User.findOne({where:{id:provider_id,is_deleted:0}})
            
                   const account = await stripe.accounts.create({
                    type: 'custom',
                    country: 'US',
                    email:user.email,
                    business_type: 'individual',
                    capabilities: {
                    card_payments: {requested: true},
                    transfers: {requested: true},
                    },
                    tos_acceptance: {
                    date: Math.floor(Date.now() / 1000),
                    ip: req.connection.remoteAddress,
                    },
                    company: {
                        address: {
                        city: 'Dallas',
                        country: "US",
                        line1: 'address_full_match',
                        line2: '825 Baker Avenue',
                        postal_code: 75202,
                        state: 'Texas'
                        }
                    },
                    individual: {
                        first_name:user.fristname,
                        last_name:user.lastname,
                        email:user.email,
                        phone:'0000000000',
                        dob:{
                        day:'01',
                        month:'01',
                        year:'1901'
                        },
                        address: {
                        city: 'Dallas',
                        country: "US",
                        line1: 'address_full_match',
                        line2: '825 Baker Avenue',
                        postal_code: 75202,
                        state: 'Texas'
                        },
                        ssn_last_4:'0000'
                    },
                    external_account:{
                        object:'bank_account',
                        country:'US',
                        currency:'usd',
                        routing_number:'110000000',
                        account_number:'000123456789'
                    },
                    business_profile:{
                        mcc:'1520',
                        url:'facebook.com',
                    }
                    
    });
    
     }catch(err){
         
     }
    // try{
        
    // //   const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
    // //   if(!admin) return res.json({status:false,message:"admin not found"})
        
    // //     var user = await User.findOne({where:{id:provider_id,is_deleted:0}})
        
        
    //      const account = await stripe.accounts.create({
    //                 type: 'custom',
    //                 country: 'US',
    //                 email:user.email,
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
    //                     first_name:user.fristname,
    //                     last_name:user.lastname,
    //                     email:user.email,
    //                     phone:'0000000000',
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
    
    
    // //      const account = await stripe.accounts.create({
    // //                 type: 'custom',
    // //                 country: 'US',
    // //                 email: 'kavita@mailinator.com',
    // //                 business_type: 'individual',
    // //                 capabilities: {
    // //                 card_payments: {requested: true},
    // //                 transfers: {requested: true},
    // //                 },
    // //                 tos_acceptance: {
    // //                 date: Math.floor(Date.now() / 1000),
    // //                 ip: req.connection.remoteAddress,
    // //                 },
    // //                 company: {
    // //                     address: {
    // //                     city: 'Dallas',
    // //                     country: "US",
    // //                     line1: 'address_full_match',
    // //                     line2: '825 Baker Avenue',
    // //                     postal_code: 75202,
    // //                     state: 'Texas'
    // //                     }
    // //                 },
    // //                 individual: {
    // //                     first_name:'kavita',
    // //                     last_name:'kag',
    // //                     email:'kavita@mailinator.com',
    // //                     phone:'0000000000',
    // //                     dob:{day:01,month:01,year:1901},
    // //                     address: {
    // //                     city: 'Dallas',
    // //                     country: "US",
    // //                     line1: 'address_full_match',
    // //                     line2: '825 Baker Avenue',
    // //                     postal_code: 75202,
    // //                     state: 'Texas'
    // //                     },
    // //                     ssn_last_4:'0000'
    // //                 },
    // //                 external_account:{
    // //                     object:'bank_account',
    // //                     country:'US',
    // //                     currency:'usd',
    // //                     routing_number:'110000000',
    // //                     account_number:'000123456789'
    // //                 },
    // //                 business_profile:{
    // //                     mcc:'1520',
    // //                     url:'facebook.com'
    // //                 }
                    
    // // });
    
    
    
    
    
    // }catch(err){
    //     return res.json({status:false,message:'Something is wrong.'});
    // }
})






//commercial

router.post('/commercial',accessToken,async(req,res)=>{
    // const {provider_id}= req.body
    // if(!provider_id) return res.json({status:false,message:'Provider id is require'})
    try{
        
         var admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
         if(!admin) return res.json({status:false,message:'admin not found.'});
         
         const user = await Equipment.findAll({where:{is_deleted:0}});
        //  const user = await User.findOne({
        //     where:{id:provider_id},
        //      include:[
             
        //          {
        //           model:Provider_equipment,as:'provider_equipment',
        //           include:[{model:Equipment,as:'equipment'}],
        //           where:{is_deleted:0},
        //          }
               
        //          ]
            
        //   });   
           
        //   if(!user) return res.json({statu:false,message:"Provider id not match"})
        
           var commercial   = [];
       
            for(var i=0; i<user.length; i++)
            {
             
          
           if(user[i].type==1){
                commercial.push({
                    id:user[i].id,
                    name:user[i].name
                });
            }
          
        }
         return res.json({status:true,data:{commercial},message:'commercial equipment'})
    }catch(err){
         
        return res.json({staus:false,message:'Something is wrong'})
    }
})




//residential 
  
  
  
  router.post('/residential',accessToken,async(req,res)=>{
    // const {provider_id}= req.body
    // if(!provider_id) return res.json({status:false,message:'Provider id is require'})
    try{
        
         var admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
         if(!admin) return res.json({status:false,message:'admin not found.'});
         
        const user = await Equipment.findAll({where:{is_deleted:0}});
        //  const user = await User.findOne({
        //     where:{id:provider_id},
        //      include:[
                 
        //          {
        //           model:Provider_equipment,as:'provider_equipment',
        //           include:[{model:Equipment,as:'equipment'}],
        //           where:{is_deleted:0},
        //          }
               
        //          ]
            
        //   });   
           
        //   if(!user) return res.json({statu:false,message:"Provider id not match"})
        
         
           var residential  = [];
      
            for(var i=0; i<user.length; i++)
            {
        
            if(user[i].type==2){
                residential.push({
                     id:user[i].id,
                     name:user[i].name
                })
            }
            
        }
       
         return res.json({status:true,data:{residential},message:'residential equipment'})
    }catch(err){
         
        return res.json({staus:false,message:'Something is wrong'})
    }
})  




//snow_plowing
  
  
  
  router.post('/snow-plowing',accessToken,async(req,res)=>{
    // const {provider_id}= req.body
    // if(!provider_id) return res.json({status:false,message:'Provider id is require'})
    try{
        
         var admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
         if(!admin) return res.json({status:false,message:'admin not found.'});
         
        const user = await Equipment.findAll({where:{is_deleted:0}});
        
        //  const user = await User.findOne({
        //     where:{id:provider_id},
        //      include:[
                 
        //          {
        //           model:Provider_equipment,as:'provider_equipment',
        //           include:[{model:Equipment,as:'equipment'}],
        //           where:{is_deleted:0},
        //          }
               
        //          ]
            
        //   });   
           
        //   if(!user) return res.json({statu:false,message:"Provider id not match"})
        
         
        // return res.json(user)
        
           var snow_plowing = [];
        
        
        
            for(var i=0; i<user.length; i++)
            {
             
      
            
            if(user[i].type==0){
                snow_plowing.push({
                    id:user[i].id,
                    name:user[i].name  
                })
            }
        }
        
         return res.json({status:true,data:{snow_plowing},message:'snow_plowing equipment'})
    }catch(err){
         
        return res.json({staus:false,message:'Something is wrong'})
    }
})



//repost order in recurring to order 

router.post('/repost',accessToken,async(req,res)=>{
    const {order_id}=req.body
    if(!order_id)return res.json({status:false,message:'Order id is require'})
     try{
         
         const admin= await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
         if(!admin) return res.json({status:false,message:"Admin not found"})
        
        
        var matchOldid= await Order.findOne({where:{parent_recurrent_order_id:order_id,is_deleted:0}})
    //   return res.json(matchOldid)
        
        if( matchOldid!=null)
        {
            if(matchOldid.status==1 || matchOldid.status==2)
                {
                    return res.json({status:false,message:'Your order has already been reposted'})
                }
        }
       
         var today_date = moment().format('YYYY-MM-DD');
     
        
        var getrecurring = await Recurring_history.findOne({where:{order_id:order_id,is_deleted:0}});
      
         if(getrecurring!=null){
            // for(var i=0; getrecurring.length > i; i++ ){
            
                var new_order_id =  'ORD'+Math.floor(Math.random() * 100000000000);
                
                var checkOrderIdExist = await Order.findOne({where:{order_id:new_order_id}});
                if(checkOrderIdExist){
                var new_order_id =  'ORD'+Math.floor(Math.random() * 1000000000000);
                }
                
                
                var getorder = await Order.findOne({where:{order_id:getrecurring.order_id}});
                // console.log("ttttttttttt",getorder)
                
                 await Order.create({
                     
                                order_id:new_order_id,
                                
                                user_id:getrecurring.user_id,
                                property_id:getrecurring.property_id,
                                category_id:getrecurring.category_id,
                                
                                subcategory_id:0,
                                subcategory_amount:0,
                                service_for:"",
                                on_demand:"Schedule",
                                on_demand_fee:0,
                                date:today_date,
                                lawn_size_id:getrecurring.lawn_size_id,
                                lawn_size_amount:getrecurring.lawn_size_amount,
                                
                                lawn_height_id:0,//getrecurring[i].lawn_height_id,
                                lawn_height_amount:0,//getrecurring[i].lawn_height_amount,
                                
                                service_type:2,
                                recurring_service_id:0,
                                
                                fence_id:getrecurring.fence_id,
                                fence_amount:getrecurring.fence_amount,
                                cleanup_id:getrecurring.cleanup_id,
                                cleanup_amount:getrecurring.cleanup_amount,
                                
                                corner_lot_id:getrecurring.corner_lot_id,
                                corner_lot_amount:getrecurring.corner_lot_amount,
            
                                
                                color_id:0,
                                car_number:0,
                                driveway:0,
                                driveway_amount:0,
                                sidewalk_id:0,
                                sidewalk_amount:0,
                                walkway_id:0,
                                walkway_amount:0,
                                
                               
                                admin_fee_perc:getrecurring.admin_fee_perc,
                                admin_fee:getrecurring.admin_fee,
                                
                                tax_perc:getrecurring.tax_perc,
                                tax:getrecurring.tax,
                                
                                
                                
                                img1:getorder.img1,
                                img2:getorder.img2,
                                img3:getorder.img3,
                                img4:getorder.img4,
                                
                                gate_code:(getrecurring.gate_code) ? getrecurring.gate_code:'',
                                instructions:"",
                                
                                payment_status:2,
                                total_amount:getrecurring.total_amount,
                                grand_total:getrecurring.grand_total,
                                parent_recurrent_order_id:getorder.order_id

                });
                
                
                
                var gtrecurring = await Recurring_history.findOne({
                                                 where:{id:getrecurring.id}
                                                  });
                                                  
                gtrecurring.date = moment(gtrecurring.date,'YYYY-MM-DD').add(gtrecurring.on_every, 'days');
                gtrecurring.save();
         
               
                 
             var transaction = await Transaction.create({
                 user_id:gtrecurring.user_id,
                 provider_id:0,
                 order_id:new_order_id,
                 category_id:gtrecurring.category_id,
                 amount:gtrecurring.grand_total,
                 payment_status:2,
                 transaction_id:'test',
                 admin_commision:0,
                 strip_response:'test',
                 status:1
                 
              });
             
             
             
             
             
            var radius    = await Setting.findOne({where:{field_key:'radius'}});
            var all_provider= await User.findAll({
                where:{is_deleted:0,is_blocked:0,status:1,role:2},
                attributes:['fcm_token','id',[Sequelize.literal("6371 * acos(cos(radians("+parseFloat(getorder.lat)+")) * cos(radians(lat)) * cos(radians("+parseFloat(getorder.lng)+") - radians(lng)) + sin(radians("+parseFloat(getorder.lat)+")) * sin(radians(lat)))"),'distance']],
                having: Sequelize.literal('distance < '+parseFloat(radius.field_value)),
                //  order: Sequelize.literal('distance ASC'),
                logging: console.log,
            })
            
           
            for(i=0; i<all_provider.length; i++)
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
                
                
                
                if(categories.indexOf((getorder.category_id).toString()) !== -1){
                //return res.json("ok")
                //   adminpush.messaging().sendToDevice(all_provider[i].fcm_token,payload,options)
                  if(all_provider[i].fcm_token !=''){
                   
                   
                    // var payload = { 
                    //     notification:{
                    //         title:'New Job',
                    //         body:'(NEW JOB) available in your Area !'
                    //     },
                    //     data:{
                    //         order_id:new_order_id,
                    //         title:'New Job',
                    //         body:'(NEW JOB) available in your Area !',
                    //         click_action:'postjob'
                    //     }
                    // };
         
            
           
               
                
                
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
             
            
           
             
            return res.json({status:true,data:{new_order_id},message:'Order Repost'})
            
            // }
           
          
             
         }
       return res.json({status:false,message:'You have not a recurring service'})
  }catch(err){
         
        return res.json({status:false,message:err})
    }
})



// repost order 

router.post('/repost-oneTime',accessToken,async(req,res)=>{
    
    const {order_id}=req.body
    
    if(!order_id) return res.json({status:false,message:'Order id is require'})
     try{
         
         const admin= await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
         if(!admin) return res.json({status:false,message:"Admin not found"})
        
         var today_date = moment().format('YYYY-MM-DD');
        
        //  await Provider_equipment.update({is_deleted:1},{where:{provider_id} })  
         
         await Order.update( { date:today_date,status:2},{ where:{order_id} } );
                
        return res.json({status:true,message:'Order Repost'})
            
       }catch(err){
         
        return res.json({status:false,message:'Something is wrong'})
    }
})





//report
 router.post('/report',accessToken,async(req,res)=>{
    const{start_date,stop_date} =req.body
    // if(!start_date) return res.json({status:false,message:'Please select start date'})
    // if(!stop_date) return res.json({status:false,message:'Please select last date'})
    try{
        
        const admin= await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
         if(!admin) return res.json({status:false,message:"Admin not found"})
         
         if(start_date !="" &&  stop_date!=""){
            
            // var dateArray = [];
            var currentDate = moment(start_date);
            
            var stopDate = moment(stop_date);
            
            // while (currentDate <= stopDate) {
            //     dateArray.push(moment(currentDate).format('YYYY-DD-MM') )
            //     currentDate = moment(currentDate).add(1, 'days');
                
            // // var orders= await Order.findAll({where:{status:3,is_deleted:0}})
            // }
            
            var Job_Completed = await Order.findAll({
                where:{status:3,payment_status:2,is_deleted:0,
                createdAt:{
                        [Op.between]:[start_date,stop_date]
                      }
                },
             attributes: [ 
              
                [Sequelize.literal('COUNT(status)'), 'Job_Comp'],
                [sequelize.fn('sum', sequelize.col('grand_total')), 'Total_Sales'],
                [sequelize.fn('sum', sequelize.col('tax')), 'total_taxes']
                
 
              ],
              raw:true
          
            })
             
            // var Job_Completed=Job_Complet.Job_Comp
        //   return res.json(Job_Completed)
               
             var Job_Cancels = await Order.findAll({
                 
                where:{status:4,is_deleted:0,
                  createdAt:{
                      [Op.between]:[start_date,stop_date]
                  }  
                },
             attributes: [
            
                [Sequelize.literal('COUNT(status)'), 'Job_Cancel']
              ],
              raw:true
         
            })  
            
            
            // return res.json(Job_Cancels)
             var Job_post = await Order.findAll({
                where:{is_deleted:0,payment_status:2,
                createdAt:{
                            [Op.between]:[start_date,stop_date]
                    }
                },
             attributes: [
                // 'status',
                [Sequelize.literal('COUNT(id)'), 'Job_Post']
              ],
              raw:true
            //   group: 'status'
            })
            
           
            
            var Total_refund = await Refund_history.findAll({
                where:{is_deleted:0,
                createdAt:{
                        [Op.between]:[start_date,stop_date]
                    }
                },
              attributes: [
                  [sequelize.fn('sum', sequelize.col('amount')), 'total_refund']
                ],
                raw:true
            })
            
             var Admin_fee = await Order.findAll({
                where:{is_deleted:0,status:3,payment_status:2,
                createdAt:{
                    [Op.between]:[start_date,stop_date]
                    }
                },
              attributes: [
                  [sequelize.fn('sum', sequelize.col('admin_fee')), 'total_Admin_fee'],
                  [sequelize.fn('sum', sequelize.col('total_amount')), 'total_amounts'],
                  [sequelize.fn('sum', sequelize.col('tip')), 'total_tip'],
                  [sequelize.fn('sum', sequelize.col('provider_amount')), 'Provider_earning'],
                  [sequelize.fn('sum', sequelize.col('tax')), 'total_taxes']
                ],
                raw:true
            })
            
                            // var provider_ear = await Order.findAll({
                            //     where:{is_deleted:0,status:3,
                            //     createdAt:{
                            //         [Op.between]:[start_date,stop_date]
                            //         }
                            //     },
                            //   attributes: [
                            //       [sequelize.fn('sum', sequelize.col('provider_amount')), 'Provider_earning']
                            //     ],
                            //     raw:true
                            // })
                            
            var Admin_ear= parseFloat(Admin_fee[0].total_amounts)-parseFloat(Admin_fee[0].Provider_earning)  
            
            //  var Admin_ear= parseFloat(Admin_fee[0].total_amounts-Admin_fee[0].total_Admin_fee)-parseFloat(provider_ear[0].Provider_earning)   //admin commision
            //   var Admin_ear= (Admin_fee[0].grand_total_amount-Admin_fee[0].total_tip-Job_Completed[0].total_taxes)-(provider_ear[0].Provider_earning)  
            var combo_box={
             Job_Completed:(Job_Completed[0].Job_Comp) ? Job_Completed[0].Job_Comp:0,
             total_tax:(Job_Completed[0].total_taxes) ? Job_Completed[0].total_taxes: 0,
             Total_Sales:(Job_Completed[0].Total_Sales) ? Job_Completed[0].Total_Sales:0,
             Provider_amount:(Admin_fee[0].Provider_earning) ? Admin_fee[0].Provider_earning:0,
             total_tip:(Admin_fee[0].total_tip) ? Admin_fee[0].total_tip:0,
             Admin_earning:(Admin_ear) ? Admin_ear.toFixed(2):0,
             Job_Cancels:(Job_Cancels[0].Job_Cancel) ? Job_Cancels[0].Job_Cancel:0,
             Job_post:(Job_post[0].Job_Post) ? Job_post[0].Job_Post:0,
             Total_refund:(Total_refund[0].total_refund) ? Total_refund[0].total_refund:0,
             
             
         };
             
       
      
        var to_user_list = await Review.findAll({
         where:{is_deleted:0,
              createdAt:{
              [Op.between]:[start_date,stop_date]
              },
              user_id: {
              [Op.eq]: sequelize.col('review_to')
              }
          },    
          attributes: ['user_id',
                         [Sequelize.fn('AVG', Sequelize.col('rating')), 'avgRating'],
                      ],
                      raw:true,
                      group:['review_to']
        })
      
      var user_box=[]
      
      for(i=0; i<to_user_list.length; i++)
        {
          
            var id = to_user_list[i].user_id
      
            var Order_table = await Order.findAll({where:{is_deleted:0,status:3,user_id:to_user_list[i].user_id,
                    createdAt:{
                                [Op.between]:[start_date,stop_date]
                             }
                        },
                         attributes: [ 
                                  [sequelize.literal("COUNT(order_id)"),"total_order"],
                                  [sequelize.literal("SUM(grand_total)"),"total_spending"],
                                  ],
                                  raw:true
                      })
                        
        var user = await User.findOne({where:{id}}) 
        
        
        user_box.push({
                        user_id:id,
                        user_name:user.fristname+' '+user.lastname, 
                        job_posts:(Order_table[0].total_order) ? Order_table[0].total_order:0,
                        spending:(Order_table[0].total_spending) ? Order_table[0].total_spending :0,
                        
                     })}
                     
 //////////////////////////////////////             
                     
        
    var to_provider_list = await Review.findAll({
                 where:{is_deleted:0,
                      createdAt:{
                      [Op.between]:[start_date,stop_date]
                      },
                      provider_id: {
                      [Op.eq]: sequelize.col('review_to')
                      }
                  },    
                  attributes: ['provider_id',
                                 [Sequelize.fn('AVG', Sequelize.col('rating')), 'avgRating'],
                              ],
                              raw:true,
                              group:['review_to']
              })
              
              
              
     var provider_box=[]
              
        for(i=0; i<to_provider_list.length; i++)
          {
                  
            var id = to_provider_list[i].provider_id
              
            var Order_table = await Order.findAll({where:{is_deleted:0,status:3,payment_status:2,assigned_to:to_provider_list[i].provider_id,
              createdAt:{ [Op.between]:[start_date,stop_date] } },
              attributes: [ 
                              [sequelize.literal("COUNT(order_id)"),"total_order"],
                              [sequelize.literal("SUM(grand_total)"),"total_spending"],
                              [sequelize.literal("SUM(provider_amount)"),"provider_er"],
                              ],
                              raw:true
                               
                     })
                                
            var user = await User.findOne({where:{id}})  
                
                
            provider_box.push({
                                provider_id:id,
                                provider_name:user.fristname+' '+user.lastname, 
                                job_done:(Order_table[0].total_order) ? Order_table[0].total_order:0,
                                earning:(Order_table[0].provider_er) ? Order_table[0].provider_er :0,
                                
                             })
                
              
              }
            
            
            
               
     return res.json({status:true,data:{combo_box,user_box,provider_box},message:'Report datas'})
         }    ////////////////////////////////////////////////////////////////NOT A DATE/////////////////////////////////////
         else{
           
            
        var Job_Completed = await Order.findAll({
            where:{status:3,payment_status:2,is_deleted:0},
            attributes:
                [ 
                [Sequelize.literal('COUNT(status)'), 'Job_Comp'],
                [sequelize.fn('sum', sequelize.col('grand_total')), 'Total_Sales'],
                [sequelize.fn('sum', sequelize.col('tax')), 'total_taxes']
                
                
                ],
              raw:true
          
            })
             
          
               
        var Job_Cancels = await Order.findAll({where:{status:4,is_deleted:0},
            attributes:
                [
                
                [Sequelize.literal('COUNT(status)'), 'Job_Cancel']
                ],
              raw:true
         
            })  
            
        var Job_post = await Order.findAll({where:{is_deleted:0,payment_status:2,},
            attributes: 
                [
                
                [Sequelize.literal('COUNT(id)'), 'Job_Post']
                ],
             raw:true
          
            })
            
           
            
        var Total_refund = await Refund_history.findAll({where:{is_deleted:0},
            attributes:
                [
                [sequelize.fn('sum', sequelize.col('amount')), 'total_refund']
                ],
                raw:true
            })
            
        var Admin_fee = await Order.findAll({
            where:{is_deleted:0,status:3,payment_status:2},
            attributes: 
                [
                [sequelize.fn('sum', sequelize.col('admin_fee')), 'total_Admin_fee'],
                [sequelize.fn('sum', sequelize.col('total_amount')), 'total_amounts'],
                [sequelize.fn('sum', sequelize.col('tip')), 'total_tip'],
                [sequelize.fn('sum', sequelize.col('provider_amount')), 'Provider_earning'],
                [sequelize.fn('sum', sequelize.col('tax')), 'total_taxes']
                
                ],
              raw:true
            })
            
                        // var provider_ear = await Order.findAll({where:{is_deleted:0,status:3},
                        //      attributes:
                        //         [
                        //         [sequelize.fn('sum', sequelize.col('provider_amount')), 'Provider_earning']
                        //         ],
                        //       raw:true
                        //     })
            // return res.json({Admin_fee,Job_Completed})            
        var Admin_ear= parseFloat(Admin_fee[0].total_amounts)-parseFloat(Admin_fee[0].Provider_earning)
        
          var combo_box={
             Job_Completed:(Job_Completed[0].Job_Comp) ? Job_Completed[0].Job_Comp:0,
             total_tax:(Job_Completed[0].total_taxes) ? Job_Completed[0].total_taxes: 0,
             Total_Sales:(Job_Completed[0].Total_Sales) ? Job_Completed[0].Total_Sales:0,
             Provider_amount:(Admin_fee[0].Provider_earning) ? Admin_fee[0].Provider_earning:0,
             total_tip:(Admin_fee[0].total_tip) ? Admin_fee[0].total_tip:0,
             Admin_earning:(Admin_ear) ? Admin_ear.toFixed(2):0,
             Job_Cancels:(Job_Cancels[0].Job_Cancel) ? Job_Cancels[0].Job_Cancel:0,
             Job_post:(Job_post[0].Job_Post) ? Job_post[0].Job_Post:0,
             Total_refund:(Total_refund[0].total_refund) ? Total_refund[0].total_refund:0,
             
            };
             
       
         
           
    var to_user_list = await Review.findAll({
         where:{is_deleted:0,
              user_id: {
              [Op.eq]: sequelize.col('review_to')
              }
          },    
          attributes: ['user_id',
                         [Sequelize.fn('AVG', Sequelize.col('rating')), 'avgRating'],
                      ],
                      raw:true,
                      group:['review_to']
        })
      
      var user_box=[]
      
      for(i=0; i<to_user_list.length; i++)
        {
          
        var id = to_user_list[i].user_id
      
        var Order_table = await Order.findAll({where:{is_deleted:0,status:3,user_id:to_user_list[i].user_id},
                         attributes: [ 
                                  [sequelize.literal("COUNT(order_id)"),"total_order"],
                                  [sequelize.literal("SUM(grand_total)"),"total_spending"],
                                  ],
                                  raw:true
                       
                        })
                        
        var user = await User.findOne({where:{id}}) 
        
        
        user_box.push({
                        user_id:id,
                        user_name:user.fristname+' '+user.lastname, 
                        job_posts:(Order_table[0].total_order) ? Order_table[0].total_order:0,
                        spending:(Order_table[0].total_spending) ? Order_table[0].total_spending :0,
                        
                     })
        
      
      }
      
        
            
    var to_provider_list = await Review.findAll({
                 where:{is_deleted:0,
                      provider_id: {
                      [Op.eq]: sequelize.col('review_to')
                      }
                  },    
                  attributes: ['provider_id',
                                 [Sequelize.fn('AVG', Sequelize.col('rating')), 'avgRating'],
                              ],
                              raw:true,
                              group:['review_to']
              })
              
              
    //  return res.json(to_provider_list)        
     var provider_box=[]
              
        for(i=0; i<to_provider_list.length; i++)
          {
                  
            var id = to_provider_list[i].provider_id
              
            var Order_table = await Order.findAll({where:{is_deleted:0,status:3,payment_status:2,assigned_to:id,},
              attributes: [ 
                              [sequelize.literal("COUNT(order_id)"),"total_order"],
                              [sequelize.literal("SUM(grand_total)"),"total_spending"],
                              [sequelize.literal("SUM(provider_amount)"),"provider_er"],
                            ],
                              raw:true
                               
                     })
                                
            var user = await User.findOne({where:{id}})  
                
                
            provider_box.push({
                                provider_id:id,
                                provider_name:user.fristname+' '+user.lastname, 
                                job_done:(Order_table[0].total_order) ? Order_table[0].total_order:0,
                                earning:(Order_table[0].provider_er) ? Order_table[0].provider_er :0,
                                
                             })
                
              
              }
            
       
        return res.json({status:true,data:{combo_box,user_box,provider_box},message:'Report datas'})
         }
       
      }catch(err){
         
    //   return res.json(err)
        return res.json({status:false,message:"something is wrong"})
    }
})






// //report in table

router.post('/report-details',accessToken,async(req,res)=>{
    const {action,start_date,stop_date}=req.body
    if(!action) return res.json({status:false,message:'Action is require'})
    if(!start_date) return res.json({status:false,message:'Start date is require'})
    if(!stop_date) return res.json({status:false,message:'Stop date is require'})
    try{
        
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin not found"})
        
        if(action=='complete'){
            
            var orders=await Order.findAll({where:{
                status:3,is_deleted:0,
                createdAt:{
                        [Op.between]:[start_date,stop_date]
                      }
                }
                
            })
            
            var complate_orders=[];
            for(var i=0; i<orders.length; i++)
            {
                 complate_orders.push({
                    order_id:orders[i].order_id,
                    order_date:moment(orders[i].createdAt).format('DD/MM/YYYY')
                  
                 })
                
            }
           
            
        return res.json({status:true,data:{complate_orders},message:'Complate Orders Details'})
            
        }
        
        
        // var Job_Completed = await Order.findAll({
        //         where:{status:3,is_deleted:0,
        //         updatedAt:{
        //                 [Op.between]:[start_date,stop_date]
        //               }
        //         },
        //      attributes: [ 
              
        //         [Sequelize.literal('COUNT(status)'), 'Job_Comp'],
        //         [sequelize.fn('sum', sequelize.col('total_amount')), 'Total_Sales'],
        //         [sequelize.fn('sum', sequelize.col('tax')), 'total_taxes']
                
 
        //       ],
        //       raw:true
          
        //     })
          
        
        
        
        if(action=='cancel'){
            var orders= await Order.findAll({where:{
                status:4,is_deleted:0,
                createdAt:{
                        [Op.between]:[start_date,stop_date]
                      }
                }
                
            })
            
            var cancel_orders=[];
            for(i=0; i<orders.length; i++)
            {
                cancel_orders.push({
                    order_id:orders[i].order_id,
                    order_date:moment(orders[i].createdAt).format('DD/MM/YYYY')
                })
            }
        
        return res.json({status:true,data:{cancel_orders},message:'Cancel Orders Details'})
            
        }
         if(action=='refund'){
            var refunds= await Refund_history.findAll({where:{is_deleted:0,status:'succeeded',
                createdAt:{
                    [Op.between]:[start_date,stop_date]
                }
            }
                
            })
            // return res.json(refunds)
            
            var refund_orders=[];
            
            for(var i=0; i<refunds.length; i++)
            {
                refund_orders.push({
                    order_id:(refunds[i].order_id) ? refunds[i].order_id:'',
                    refund_amount:(refunds[i].amount) ? refunds[i].amount:'',
                    order_date:moment(refunds[i].createdAt).format('DD/MM/YYYY')
                })
            }
        
        return res.json({status:true,data:{refund_orders},message:'Refund Orders Details'})
            
        }
        
          if(action=='Job_post'){
            var jobs= await Order.findAll({where:{is_deleted:0,
                 createdAt:{
                    [Op.between]:[start_date,stop_date]
                }
            }
                
            })
            // return res.json(refunds)
            
            var job_posts=[];
            
            for(i=0; i<jobs.length; i++)
            {
                job_posts.push({
                    order_id:(jobs[i].order_id) ? jobs[i].order_id:'',
                    order_date:moment(jobs[i].createdAt).format('DD/MM/YYYY')
                })
            }
        
        return res.json({status:true,data:{job_posts},message:'Post jobs Details'})
            
        }
        
        
        if(action=='Admin_earning'){
            var admin_er= await Order.findAll({where:{is_deleted:0,status:3,
                 createdAt:{
                    [Op.between]:[start_date,stop_date]
                }
            }
                
            })
    //   return res.json(admin_er)
            
            var admin_erning=[];
            
            for(var i=0; i<admin_er.length; i++)
            { 
                var admin_com = (parseFloat(admin_er[i].total_amount)-parseFloat(admin_er[i].admin_fee))
                
                admin_erning.push({
                    order_id:(admin_er[i].order_id) ? admin_er[i].order_id:'',
                    admin_fee:(admin_er[i].admin_fee) ? admin_er[i].admin_fee:0,
                    admin_commision:admin_com,
                    total:(admin_er[i].admin_fee)+(admin_com),
                    order_date:moment(admin_er[i].createdAt).format('DD/MM/YYYY'),
                })
            }
        
         return res.json({status:true,data:{admin_erning},message:'Admin earning Details'})
            
        }
        
        
        
        
         if(action=='Provider_earning'){
           var provider_box=[];
          var all_provider = await Order.findAll({where:{is_deleted:0,status:3,
              
               createdAt:{
                    [Op.between]:[start_date,stop_date]
                    }
          },group: ['assigned_to']})
          
            for(var i=0; i<all_provider.length; i++)
            {
                var id= all_provider[i].assigned_to
                count=0;
                
                var match_provider= await Order.findAll({where:{is_deleted:0,status:3,assigned_to:all_provider[i].assigned_to,
                    createdAt:{
                    [Op.between]:[start_date,stop_date]
                    }
                },
                    attributes:[
                        [sequelize.literal("COUNT(order_id)"),"total_job_done"],
                        [sequelize.literal("sum(provider_amount)"),"total_earning"],
                        ],
                        raw:true
                        
                })
                
                 var user = await User.findOne({where:{id}})
                    provider_box.push({
                        provider_id:id,
                        provider_name:user.fristname+' '+user.lastname,
                        job_done:match_provider[0].total_job_done,
                        earning:match_provider[0].total_earning,
                    })
                
            }
            
            return res.json({status:true,data:{provider_box},message:'provider datas'})
        }
        
    }catch(err){
         
        return res.json({status:false,message:"Something is wrong."})
    }
})







//refund amount
router.post('/refund-amount',accessToken,async(req,res)=>{
    const {charge_id,user_id,order_id}=req.body
    if(!charge_id) return res.json({status:false,message:"Charge id is require"});
    if(!user_id) return res.json({status:false,message:"User id is require"});
    if(!order_id) return res.json({status:false,message:'Order id is require'})
    try{
        
        
        
      const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
      if(!admin) return res.json({status:false,message:"admin not found"})
       
      var orderMatch= await Refund_history.findOne({where:{order_id,is_deleted:0}}) 
      if(orderMatch) return res.json({status:false,message:'Your amount already refunded'}) 
    //   var order= await Order.findOne({where:{order_id,is_deleted:0}})
    //   if(order==null) return res.json({status:false,message:'order not match'})
    
        var stripe = Stripe(admin.stripe_key);
        const refund = await stripe.refunds.create({
            
          charge:charge_id,
          
         });
         
        //  return res.json(refund) 
        await Refund_history.create({
            transaction_id:refund.id,
            status:refund.status,
            amount:refund.amount/100,
            user_id:user_id,
            order_id:order_id,
        })
        
        return res.json({status:true,message:"Amount Refunded"})       
    }catch(err){
         
        return res.json({status:false,message:"Somthing is wrong"})
    }
})


// //pay to provider

// router.post('/pay-provider',accessToken,async(req,res)=>{
//     const{charge_id}= req.body
//     if(!charge_id) return res.json({status:false,message:'Charge id is require'})
//     try{
        
//          const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
//          if(!admin) return res.json({status:false,message:"admin not found"})\
         
//          const account = await stripe.transfers.create({
//           amount: 20*100,
//           currency: "usd",
//           source_transaction: charge_id,
          
//           : "acct_1JjlB34GjZryZCgR",
//         });
//         return res.json({status:true,message:'Payment successfuly done'})
//     }catch(err){
//          
//         return res.json({status:false,message:'Something is wrong'})
//     }
// })



//update-admin-commision

router.post('/update-admin-commision',accessToken,async(req,res)=>{
    const{commision_value}= req.body
    if(!commision_value) return res.json({status:false,message:'commision_value is require'})
    try{
        
         const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
         if(!admin) return res.json({status:false,message:"admin not found"})
         
         var admin_comm= await Setting.findOne({where:{is_deleted:0,field_key:'admin_commission'}})
         admin_comm.field_value=commision_value;
         admin_comm.save();
            // return res.json(admin_comm)
        return res.json({status:true,message:'Admin commision update successfuly '})
    }catch(err){
         
        return res.json({status:false,message:'Something is wrong'})
    }
})







router.post('/support',accessToken,async(req,res) =>{
    try{
        var admin = await Admin.findOne();
        return res.json({status:true,data:{support:admin.support},message:'support page'});
    }catch(err){
        return res.json({status:false,message:'Something is wrong.'}); 
    }
})


router.post('/update-support',accessToken,async(req,res) =>{
    const {support} = req.body;
    try{
        var admin = await Admin.findOne({where:{id:1}});
        admin.support = support;
        admin.save();
        
        return res.json({status:true,message:'support data updated successfuly.'});
    }catch(err){
        return res.json({status:false,message:'Something is wrong.'}); 
    }
})


router.post('/about-app',accessToken,async(req,res) =>{
    try{
        var admin = await Admin.findOne();
        return res.json({status:true,data:{support:admin.about_app},message:'about app page'});
    }catch(err){
        return res.json({status:false,message:'Something is wrong.'}); 
    }
})


router.post('/update-about-app',accessToken,async(req,res) =>{
    const {about_app} = req.body;
    try{
        var admin = await Admin.findOne({where:{id:1}});
        admin.about_app = about_app;
        admin.save();
        
        return res.json({status:true,message:'about app data updated successfuly.'});
    }catch(err){
        return res.json({status:false,message:'Something is wrong.'}); 
    }
})





//add strip account



router.post('/add-stripe-account',accessToken,async(req,res) =>{
    const {user_id} = req.body;
    if(!user_id) return res.json({status:false,message:'User id is require'})
    try{
        
         const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
         if(!admin) return res.json({status:false,message:"admin not found"})
        
        const user = await User.findOne({where:{id:user_id,is_deleted:0,role:2}})
        if(!user) return res.json({status:false,message:"user not found"});
        if(user.is_blocked==1) return res.json({status:false,message:'User is blocked.'});
        
         var bank_detail         =  await Bank_detail.findOne({where:{provider_id:user.id}}); 
        //  return res.json(bank_detail)
        // return res.json(user.dob.split("-"));
        var stripe = Stripe(admin.stripe_key);
         const account = await stripe.accounts.create({
                    type: 'custom',
                    country: 'US',
                    email: user.email,
                    business_type: 'individual',
                    capabilities: {
                    card_payments: {requested: true},
                    transfers: {requested: true},
                    },
                    tos_acceptance: {
                    date: Math.floor(Date.now() / 1000),
                    ip: req.connection.remoteAddress,
                    },
                    company: {
                        address: {
                        city: user.city,//'Dallas',
                        country: "US",
                        line1: user.street,//'address_full_match',
                        line2: user.street,//'825 Baker Avenue',
                        postal_code:parseInt(user.zip_code), //75202,
                        state:user.state
                        }
                    },
                    individual: {
                        first_name:user.fristname,
                        last_name:user.lastname,
                        email:user.email,
                        phone:user.mobile,
                        // dob:{day:01,month:01,year:1901},
                        dob:{day:parseInt(user.dob.split("-")[0]),month:parseInt(user.dob.split("-")[1]),year:parseInt(user.dob.split("-")[2])},
                        address: {
                        city: user.city,//'Dallas',
                        country: "US",
                        line1: user.street,//'address_full_match',
                        line2: user.street,//'825 Baker Avenue',
                        postal_code:parseInt(user.zip_code), 
                        state:user.state
                        },
                        ssn_last_4:user.ssn.substr(user.ssn.length -4)
                    },
                    external_account:{

                        object:'bank_account',
                        country:'US',
                        currency:'usd',
                        routing_number:bank_detail.routing_number,
                        account_number:bank_detail.account_number,
                    },
                    business_profile:{

                        mcc:'1520',
                        url:'facebook.com'
                    }
                    
    });
    
    
    user.account_id = account.id;
    user.save();
      if(user){
           return res.json({status:true,'message':'Account has been created successfuly.'}) 
      }else{
           return res.json({status:false,'message':'something is wrong.'})
      }
    
    }catch(err){
        // return res.json(err)
        
          switch (err.type) {
        case 'StripeCardError':
        // A declined card error
         return res.json({status:false,message:err.message});
         // => e.g. "Your card's expiration year is invalid."
        break;
        case 'StripeRateLimitError':
        // Too many requests made to the API too quickly
         return res.json({status:false,message:err.message});
        break;
        case 'StripeInvalidRequestError':
        // Invalid parameters were supplied to Stripe's API
          return res.json({status:false,message:err.message});
        break;
        case 'StripeAPIError':
        // An error occurred internally with Stripe's API
        return res.json({status:false,message:err.message});
        break;
        case 'StripeConnectionError':
        // Some kind of error occurred during the HTTPS communication
          return res.json({status:false,message:err.message});
        break;
        case 'StripeAuthenticationError':
        // You probably used an incorrect API key
        return res.json({status:false,message:err.message});
        break;
        default:
        // Handle any other types of unexpected errors
        return res.json({status:false,message:err.message});
        break;
        }
        // return res.json({status:false,message:'something is wrong.'});
    }
})




router.post('/pay-to-provider',accessToken,async(req,res) =>{
    const {order_id} = req.body;
    if(!order_id) return res.json({status:false,message:"Order id is required."});
    try{
        
    const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
    if(!admin) return res.json({status:false,message:"admin not found"})
        
     var transaction = await Transaction.findOne({where:{order_id,payment_status:2}});
     if(!transaction) return res.json({status:false,message:"Transaction not found."});
     
     var order = await Order.findOne({where:{order_id}});
     if(order.assigned_to ==null || order.assigned_to=="") return res.json({status:false,message:"Job have not assigned yet."});
     
     if(order.paid_to_provider==1) return res.json({status:false,message:"Amount already paid."});
     
    
   
            
            
    // return res.json(order.assigned_to)
     var provider = await User.findOne({where:{id:order.assigned_to,is_deleted:0}});
     if(!provider.account_id) return res.json({status:false,message:'Please genrate stripe account'});
    //  return res.json(provider)
    
     var stripe = Stripe(admin.stripe_key);       
     const account = await stripe.transfers.create({
                                                      amount: order.provider_amount*100,
                                                      currency: "usd",
                                                      source_transaction:transaction.transaction_id,
                                                      destination:provider.account_id,
                                                      //transfer_group:order_id
                                                });
    if(account){
        await Transaction.create({
                order_id:order_id,
                category_id:order.category_id,
                transaction_id:account.id,
                provider_id:order.assigned_to,
                user_id:order.user_id,
                stripe_response:JSON.stringify(account),
                type:2,
                amount:order.provider_amount,
                payment_status:2,
               
           });
         
         
         order.paid_to_provider = 1;
         order.save();
         
         
           var payload = {
                notification:{
                title:'Payment',
                body:'Contractor Payment sent $'+order.provider_amount
                },
            data:{
                order_id:order_id,
                title:'Payment',
                body:'Contractor Payment sent $'+order.provider_amount,
                click_action:'admin_has_transferred_your_payment'
            }
            };
            
       var options = {
                priority: "high",
                timeToLive: 60*60*24,
            };
            
           
          await providerpush.messaging().sendToDevice(provider.fcm_token,payload,options)
           
    
         return res.json({status:true,message:"Paid to provider successfuly."}) 
    }else{
         return res.json({status:false,message:"Something is wrong try,again."}) 
    }                                      
  
        
    }catch(err){
        
        
        switch (err.type) {
        case 'StripeCardError':
        // A declined card error
         return res.json({status:false,message:err.message});
         // => e.g. "Your card's expiration year is invalid."
        break;
        case 'StripeRateLimitError':
        // Too many requests made to the API too quickly
         return res.json({status:false,message:err.message});
        break;
        case 'StripeInvalidRequestError':
        // Invalid parameters were supplied to Stripe's API
          return res.json({status:false,message:err.message});
        break;
        case 'StripeAPIError':
        // An error occurred internally with Stripe's API
        return res.json({status:false,message:err.message});
        break;
        case 'StripeConnectionError':
        // Some kind of error occurred during the HTTPS communication
          return res.json({status:false,message:err.message});
        break;
        case 'StripeAuthenticationError':
        // You probably used an incorrect API key
        return res.json({status:false,message:err.message});
        break;
        default:
        // Handle any other types of unexpected errors
        return res.json({status:false,message:err.message});
        break;
        }

        //  
        // return res.json(err)
    }
})


//logout


// router.post('/logout',accessToken,async(req,res)=>{
//     try{
        
//         const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
//         if(!admin) return res.json({status:false,message:"Admin not found"})
        
//         admin.fcm_token=""
//         admin.save();
//         return res.json({status:true,message:"Admin logout"})
        
//     }catch(err){
//          
//         return res.json({status:false,message:"Something is wrong"})
        
//     }
// })




//bar chart 

router.post('/chart',accessToken,async(req,res)=>{
    const {year}=req.body;
    try{
     var admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
     if(!admin) return res.json({status:false,message:"Admin not found"})
     
    //  if(type=="order"){
         
      
        var get_yearwise_date = await Order.findAll({
            where:{
            [Op.and]:[
                sequelize.where(sequelize.fn("YEAR", sequelize.col("date")), year),
                {payment_status:2,status:3,is_deleted:0}
                ],
             },
             order:[['date','asc']]
            
        })
        
        
          var result = get_yearwise_date.reduce(function(acc, obj) {
          var key = moment(obj.date.substr(0,7)).format("MMM");
          acc[key] = (acc[key] || 0) + +(obj.total_amount - obj.provider_amount);
         
          return acc;
        }, Object.create(null));
        
        
          var finalAmount =[];
            if(result.Jan){  finalAmount.push(parseFloat(result.Jan.toFixed(2)))}else{finalAmount.push(0)} 
            if(result.Feb){  finalAmount.push(parseFloat(result.Feb.toFixed(2)))}else{finalAmount.push(0)} 
            if(result.Mar){  finalAmount.push(parseFloat(result.Mar.toFixed(2)))}else{finalAmount.push(0)} 
            if(result.Apr){  finalAmount.push(parseFloat(result.Apr.toFixed(2)))}else{finalAmount.push(0)} 
            if(result.May){  finalAmount.push(parseFloat(result.May.toFixed(2)))}else{finalAmount.push(0)} 
            if(result.Jun){  finalAmount.push(parseFloat(result.Jun.toFixed(2)))}else{finalAmount.push(0)} 
            if(result.Jul){  finalAmount.push(parseFloat(result.Jul.toFixed(2)))}else{finalAmount.push(0)} 
            if(result.Aug){  finalAmount.push(parseFloat(result.Aug.toFixed(2)))}else{finalAmount.push(0)} 
            if(result.Sep){  finalAmount.push(parseFloat(result.Sep.toFixed(2)))}else{finalAmount.push(0)} 
            if(result.Oct){  finalAmount.push(parseFloat(result.Oct.toFixed(2)))}else{finalAmount.push(0)} 
            if(result.Nov){  finalAmount.push(parseFloat(result.Nov.toFixed(2)))}else{finalAmount.push(0)}
            if(result.Dec){  finalAmount.push(parseFloat(result.Dec.toFixed(2)))}else{finalAmount.push(0)}
        
        
       
        
        //take substring and just grab unique date
        let distict_dates = [...new Set(get_yearwise_date.map(a => a.date.substring(0, 7)))];
        
        let aall_months = distict_dates.map(a => {
                return {
                    Month: moment(a).format("MMM"),
                    Total_order: get_yearwise_date.filter(a1 => a1.date.startsWith(a)).length,
                    // total = (acc[key] || 0) + +a.grand_total,
                    
                }
            }
        )
        
        // return res.json(aall_months)
       var finaresult =[];
       
        const jan = aall_months.find((element) =>{ 
           return element.Month=="Jan" ? element:0
        });
        if(jan && typeof jan.Total_order !=='undefined'){
             
             finaresult.push(jan.Total_order)
        }else{
           
             finaresult.push(0)
        }
       
        const feb = aall_months.find((element) =>{ 
           return element.Month=="Feb" ? element:0
        });
        if(feb && typeof feb.Total_order !=='undefined'){
             finaresult.push(feb.Total_order)
        }else{
             finaresult.push(0)
        }
        
        
        const mar = aall_months.find((element) =>{ 
           return element.Month=="Mar" ? element:0
        });
        if(mar && typeof mar.Total_order !=='undefined'){
             finaresult.push(mar.Total_order)
        }else{
             finaresult.push(0)
        }
        
        
        
        
        const apr = aall_months.find((element) =>{ 
        return element.Month=="Apr" ? element:0
        });
        if(apr && typeof apr.Total_order !=='undefined'){
             finaresult.push(apr.Total_order)
        }else{
             finaresult.push(0)
        }
        
        
        const may = aall_months.find((element) =>{ 
           return element.Month=="May" ? element:0
        });
        if( may && typeof may.Total_order !=='undefined'){
             finaresult.push(may.Total_order)
        }else{
             finaresult.push(0)
        }
        
        
        const jun = aall_months.find((element) =>{ 
        return element.Month=="Jun" ? element:0
        });
        if( jun && typeof jun.Total_order !=='undefined'){
        finaresult.push(jun.Total_order)
        }else{
        finaresult.push(0)
        }
        
        
        const jul = aall_months.find((element) =>{ 
        return element.Month=="Jul" ? element:0
        });
        
        if(jul && typeof jul.Total_order !=='undefined'){
        finaresult.push(jul.Total_order)
        }else{
        finaresult.push(0)
        }
        
        
        
       const aug = aall_months.find((element) =>{ 
           return element.Month=="Aug" ? element:0
       });
       if( aug && typeof aug.Total_order !=='undefined'){
             finaresult.push(aug.Total_order)
       }else{
             finaresult.push(0)
       }
        
        
       const sep = aall_months.find((element) =>{ 
           return element.Month=="Sep" ? element:0
        });
       if( sep && typeof sep.Total_order !=='undefined'){
             finaresult.push(sep.Total_order)
       }else{
             finaresult.push(0)
       }
        
        
        
        
        
       const oct = aall_months.find((element) =>{ 
           return element.Month=="Oct" ? element:0
       });
        
       if( oct && typeof oct.Total_order !=='undefined'){
             finaresult.push(oct.Total_order)
       }else{
             finaresult.push(0)
       }
        
        
       const nov = aall_months.find((element) =>{ 
           return element.Month=="Nov" ? element:0
       });
        
       if( nov && typeof nov.Total_order !=='undefined'){
             finaresult.push(nov.Total_order)
       }else{
             finaresult.push(0)
       }
       
        const dec = aall_months.find((element) =>{ 
           return element.Month=="Dec" ? element:0
        });
         if(dec && typeof dec.Total_order !=='undefined'){
             finaresult.push(dec.Total_order)
        }else{
             finaresult.push(0)
        }
       
        
       
        
        return res.json({status:true,data:{finaresult,finalAmount},message:"Graph data"})
        
        
     
                      
                        //     if(type=="earning"){
                             
                        // //   return res.json("pll")
                        //     var get_yearwise_date = await Order.findAll({
                        //         where:{
                        //         [Op.and]:[
                        //             sequelize.where(sequelize.fn("YEAR", sequelize.col("date")), year),
                        //             {payment_status:2,status:3,is_deleted:0}
                        //             ],
                        //          },
                        //          order:[['date','asc']]
                                
                        //     })
                            
                            
                        //       var result = get_yearwise_date.reduce(function(acc, obj)
                        //       {
                        //         var key = moment(obj.date.substr(0,7)).format("MMM");
                        //         // return res.json(obj.date.substr(0,7))
                        //          acc[key] = (acc[key] || 0) + +obj.grand_total;
                             
                        //         return acc;
                        //       }, Object.create(null));
                            
                            
                            
                        //     var finaresult =[];
                        //         if(result.Jan){  finaresult.push(result.Jan) }else{finaresult.push(0)} 
                        //         if(result.Feb){  finaresult.push(result.Feb) }else{finaresult.push(0)} 
                        //         if(result.Mar){  finaresult.push(result.Mar) }else{finaresult.push(0)} 
                        //         if(result.Apr){  finaresult.push(result.Apr) }else{finaresult.push(0)} 
                        //         if(result.May){  finaresult.push(result.May) }else{finaresult.push(0)} 
                        //         if(result.Jun){  finaresult.push(result.Jun) }else{finaresult.push(0)} 
                        //         if(result.Jul){  finaresult.push(result.Jul) }else{finaresult.push(0)} 
                        //         if(result.Aug){  finaresult.push(result.Aug) }else{finaresult.push(0)} 
                        //         if(result.Sep){  finaresult.push(result.Sep) }else{finaresult.push(0)} 
                        //         if(result.Oct){  finaresult.push(result.Oct) }else{finaresult.push(0)} 
                        //         if(result.Nov){  finaresult.push(result.Nov) }else{finaresult.push(0)}
                        //         if(result.Dec){  finaresult.push(result.Dec) }else{finaresult.push(0)}
                            
                           
                        //     return res.json({status:true,data:{finaresult},message:"Graph data"})
                            
                            
                        //  }
                      
    //       var yearConvert= await Order.findAll({where:{
    //         [Op.and]:[
    //             sequelize.where(sequelize.fn("YEAR", sequelize.col("date")), year),
    //             {payment_status:2,status:3,is_deleted:0}
    //             ]
    //     }}) ///  return res.json(yearConvert)
      
        
        
        
    //     //////////////////////
    //     var result = yearConvert.reduce(function(acc, obj) {
    //       var key = moment(obj.date.substr(0,7)).format("MMM");
    //       acc[key] = (acc[key] || 0) + +obj.grand_total;
         
    //       return acc;
    //     }, Object.create(null));
    //     ////////////////////
        
    // //   return res.json(result)
        
    //     //count each date frequency
    //     let all_months = distict_dates.map(a => {
    //             return {
    //                 Month: moment(a).format("MMM"),
    //                 Total_order: yearConvert.filter(a1 => a1.date.startsWith(a)).length,
    //                 Total_Amount:result,
    //                 // total = (acc[key] || 0) + +a.grand_total,
                    
    //             }
    //         }
    //     )
            
            
            
    //         // var data={}
            
    //         // for(i=0; i<all_months.length ; i++)
    //         // {
    //         //     if(all_months[i].Month=="Nov")
    //         //     {
    //         //         data.push({
    //         //             month:all_months[i].Month,
    //         //             total_order:all_months[i].Total_order,
                        
    //         //         })
    //         //     }
                
                
    //         // }
        
        
    //             return res.json({status:true,data:{all_months},message:"Chart datas"});
        
        
        
        
    //     var Jan_ord=0;
    //     var Feb_ord=0;
    //     var Mar_ord=0;
    //     var Apr_ord=0;
    //     var May_ord=0;
    //     var Jun_ord=0;
    //     var Jul_ord=0;
    //     var Aug_ord=0;
    //     var Sep_ord=0;
    //     var Oct_ord=0;
    //     var Nov_ord=0;
    //     var Dec_ord=0;
        
        
    //     var orders_nov=[]
        
    //     for(i=0; i<yearConvert.length; i++)
    //     {
    //         var Jan=1;
    //         var Feb=2;
    //         var Mar=3;
    //         var Apr=4;
    //         var Mai=5;
    //         var Jun=6;
    //         var Jul=7;
    //         var Aug=8;
    //         var Sep=9;
    //         var Oct=10;
    //         var Nov=11;
    //         var Dec=12;  
            
            
            
            
    //      if(yearConvert[i].date.split('-')[1]==Jan)
    //       {
    //         Jan_ord++;
            
    //       } 
    //       else if(yearConvert[i].date.split('-')[1]==Feb)
    //       {
    //         Feb_ord++;
    //       }  
    //       else if(yearConvert[i].date.split('-')[1]==Mar)
    //       {
    //         Mar_ord++;
    //       } 
    //       else if(yearConvert[i].date.split('-')[1]==Apr)
    //       {
    //         Apr_ord++;
    //       } 
    //       else if(yearConvert[i].date.split('-')[1]==Mai)
    //       {
    //         May_ord++;
    //       } 
    //       else if(yearConvert[i].date.split('-')[1]==Jun)
    //       {
    //         Jun_ord++;
    //       }
    //       else if(yearConvert[i].date.split('-')[1]==Jul)
    //       {
    //         Jul_ord++;
    //       } 
    //       else if(yearConvert[i].date.split('-')[1]==Aug)
    //       {
    //         Aug_ord++;
    //       } 
    //       else if(yearConvert[i].date.split('-')[1]==Sep)
    //       {
    //         Sep_ord++;
    //       } 
    //       else if(yearConvert[i].date.split('-')[1]==Oct)
    //       {
    //         Oct_ord++;
    //       }
    //       else if(yearConvert[i].date.split('-')[1]==Nov)
    //       {
    //         Nov_ord++;
            
    //         orders_nov.push({
    //             grand_total:yearConvert[i].grand_total,
    //         })
    //         // // var Order_id=yearConvert[i].order_id
    //         // await Order.findOne({where:{order_d:yearConvert[i].order_id,}})
    //         //  attributes: [[sequelize.sum('min', sequelize.col('price')), 'minPrice']],
             
    //         //   var Job_Completed = await Order.findAll({
    //         //     where:{status:3,payment_status:2,is_deleted:0},
    //         //  attributes: [ 
    //         //   [sequelize.fn('sum', sequelize.col('grand_total')), 'Total_Sales'],
               
    //         //   ],
    //         //   raw:true
          
    //         // })
        
    //       }
    //       else if(yearConvert[i].date.split('-')[1]==Dec)
    //       {
    //         Dec_ord++;
    //       }
          
    //     }
        
    //     // var January=[];
    //     // var February=[];
    //     // var March=[];
    //     // var April=[];
    //     // var May=[];
    //     // var June=[];
    //     // var July=[];
    //     // var August=[];
    //     // var September=[];
    //     // var October=[];
    //     // var November=[];
    //     // var December=[];
       
    //     //  return res.json({orders_nov})
    //     details={
                      
    //                   Jan_ord:Jan_ord,
    //                   Feb_ord:Feb_ord,
    //                   Mar_ord:Mar_ord,
    //                   Apr_ord:Apr_ord,
    //                   May_ord:May_ord,
    //                   Jun_ord:Jun_ord,
    //                   Jul_ord:Jul_ord,
    //                   Aug_ord:Aug_ord,
    //                   Sep_ord:Sep_ord,
    //                   Oct_ord:Oct_ord,
    //                   Nov_ord:Nov_ord,
    //                   Dec_ord:Dec_ord,
    //                   }
                      
       
    //     return res.json({status:true,data:{details}})
    }
    catch(err){
  return res.json(err)
         
        return res.json({status:false,mesage:"Somthing is wrong"})
    }
})





//  stripe key 
router.post('/update-stripe-key',accessToken,async(req,res) =>{
    const {stripe_public_key,stripe_private_key} = req.body;
    
    if(!stripe_public_key) return res.json({status:false,message:'stripe public key is required.'});
    if(!stripe_private_key) return res.json({status:false,message:'stripe private key is required.'});
    try{
        
    const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
    if(!admin) return res.json({status:false,message:"admin is deleted"})
      
     admin.stripe_key = stripe_private_key;  
     admin.public_stripe_key = stripe_public_key;  
     if(admin.save()){
      return res.json({status:true,message:"Updated successfuly."});   
     }else{
      return res.json({status:false,message:"Not updating try again."});
     }
     
        
    }catch(err){
        return res.json(err);
        return res.json({status:false,message:'Something is wrong.'});
    }
});





// change status by useer 
router.post('/change-status',accessToken,async(req,res)=>{
    const {order_id,on_the_way,at_location,started_job,finished_job}= req.body;
    if(!order_id) return res.json({status:false,message:"Order id is require"})
    try{
        
        var order_table = await Order.findOne({where:{is_deleted:0,order_id}})
        if(!order_table) return res.json({status:false,message:"Order id not found"})
        var date_and_time=moment().format();
        var user= await User.findOne({where:{id:order_table.user_id,is_deleted:0}})
        
        if(order_table.assigned_to != null && order_table.assigned_to != "" ){
        if(on_the_way==1){
           
            
            order_table.on_the_way=parseInt(on_the_way);
            order_table.on_the_way_date=date_and_time;
            var msg='now status is on the way.';
            
            if(user.fcm_token !=''){
                
            //start notification  
            var message = { 
            to: user.fcm_token, 
            collapse_key: '',
            
            notification:{
                title:'Order Update',
                body:'Your service provider has on the way'
            },
            
             data:{
                order_id:order_id,
                title:'Order Update',
                body:'Your service provider has on the way',
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
            
            
        }
        if(at_location==1){
            order_table.on_the_way=1;
            order_table.at_location=parseInt(at_location);
            order_table.at_location_date=date_and_time;
            var msg='now status at location.';
            
            if(user.fcm_token !=''){
                
            //start notification  
            var message = { 
            to: user.fcm_token, 
            collapse_key: '',
            
            notification:{
                title:'Order Update',
                body:'Your service provider has been arrived at location'
            },
            
             data:{
                order_id:order_id,
                title:'Order Update',
                body:'Your service provider has been arrived at location',
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
            
            order_table.on_the_way=1;
            order_table.at_location=1;
            order_table.started_job=parseInt(started_job);
            order_table.started_job_date=date_and_time;
            var msg='now status is started job.';
            
            if(user.fcm_token !=''){
                
            //start notification  
            var message = { 
            to: user.fcm_token, 
            collapse_key: '',
            
           notification:{
            
            title:'Order Update',
            body:'Provider has been started work'
            },
             data:{
                order_id:order_id,
                title:'Order Update',
                body:'Provider has been started work',
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
            
            order_table.on_the_way=1;
            order_table.at_location=1;
            order_table.started_job=1;
            order_table.finished_job=parseInt(finished_job);
            order_table.finished_job_date=date_and_time;
            order_table.status=3
            var msg='now status is finished job.';
            
            if(user.fcm_token !=''){
                
            //start notification  
            var message = { 
            to: user.fcm_token, 
            collapse_key: '',
            
            notification:{
            title:'Order Update',
            body:'Your service provider has been finished work'
            },
             data:{
                order_id:order_id,
                title:'Order Update',
                body:'Your service provider has been finished work',
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
        order_table.save();
       return res.json({
           status:true,
           data:{
           current_status:{
               on_the_way:order_table.on_the_way, 
               at_location:order_table.at_location,
               started_job:order_table.started_job,
               finished_job:order_table.finished_job
               
           }
           
       },message:msg});
    }else{return res.json({status:false,message:"Please assign provider"})}
    }catch(err){
         
        return res.json({status:false,message:"Something is wrong"})
    }
});



router.post('/pay-provider-data',accessToken,async(req,res) =>{
    try{
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin is deleted"})

        
         const orders_need_payment = await Order.findAll({
            where:{paid_to_provider:0,status:3,is_deleted:0,payment_status:2,is_reviewed:0},    
            include:[
                   {model:User,as:'user_details'},
                   {model:User,as:'provider'}
                  ],
                  order:[['id','desc']]
                 
         });
        
         var need_payment = [];
         for(let i=0; i<orders_need_payment.length; i++)
         {

            if(orders_need_payment[i].service_type==1)
            {var service_type='One Time'}
            
            if(orders_need_payment[i].service_type==2)
            {var service_type='Recurring'}
            
            if(orders_need_payment[i].service_type==0)
            {var service_type='NA'}

            if(orders_need_payment[i].category_id==1)
            {var serviced='Lawn Mowing'}
            
            if(orders_need_payment[i].category_id==2)
            {var serviced='Snow plowing'}
            
            need_payment.push({
                  id:orders_need_payment[i].id,
                  order_id:orders_need_payment[i].order_id,
                  service_types:service_type,
                  name:(orders_need_payment[i].user_details !=null) ? orders_need_payment[i].user_details.fristname+" "+orders_need_payment[i].user_details.lastname:'',
                  provider_id:orders_need_payment[i].provider==null ? 'Not Assigned' : orders_need_payment[i].provider.id,
                  provider:orders_need_payment[i].provider==null ? 'Not Assigned' : orders_need_payment[i].provider.fristname+" "+orders_need_payment[i].provider.lastname,
                  service:serviced,
                  total:orders_need_payment[i].provider_amount==null ? "0.00": orders_need_payment[i].provider_amount,
                  status:"Completed",
                //   order_date:moment(orders[i].createdAt).format('MM/DD/YYYY'),
                 
             })
         }



        //  paid 
        const orders_paid = await Order.findAll({
            where:{paid_to_provider:1,status:3,is_deleted:0,payment_status:2},    
            include:[
                   {model:User,as:'user_details'},
                   {model:User,as:'provider'}
                  ],
                  order:[['id','desc']]
                 
         });
        
         var paid         = [];
         for(let i=0; i<orders_paid.length; i++)
         {

            if(orders_paid[i].service_type==1)
            {var service_type='One Time'}
            
            if(orders_paid[i].service_type==2)
            {var service_type='Recurring'}
            
            if(orders_paid[i].service_type==0)
            {var service_type='NA'}

            if(orders_paid[i].category_id==1)
            {var serviced='Lawn Mowing'}
            
            if(orders_paid[i].category_id==2)
            {var serviced='Snow plowing'}
            
            paid.push({
                  id:orders_paid[i].id,
                  order_id:orders_paid[i].order_id,
                  service_types:service_type,
                  name:(orders_paid[i].user_details !=null) ? orders_paid[i].user_details.fristname+" "+orders_paid[i].user_details.lastname:'',
                  provider_id:orders_paid[i].provider==null ? 'Not Assigned' : orders_paid[i].provider.id,
                  provider:orders_paid[i].provider==null ? 'Not Assigned' : orders_paid[i].provider.fristname+" "+orders_paid[i].provider.lastname,
                  service:serviced,
                  total:orders_paid[i].provider_amount==null ? "0.00": orders_paid[i].provider_amount,
                  status:"Completed",
                //   order_date:moment(orders[i].createdAt).format('MM/DD/YYYY'),
                 
             })
         }

        


          //  paid 
          const orders_reviewed = await Order.findAll({
            where:{paid_to_provider:0,status:3,is_deleted:0,payment_status:2,is_reviewed:1},    
            include:[
                   {model:User,as:'user_details'},
                   {model:User,as:'provider'}
                  ],
                  order:[['id','desc']]
                 
         });
        
         var need_review  = [];
         for(let i=0; i<orders_reviewed.length; i++)
         {

            if(orders_reviewed[i].service_type==1)
            {var service_type='One Time'}
            
            if(orders_reviewed[i].service_type==2)
            {var service_type='Recurring'}
            
            if(orders_reviewed[i].service_type==0)
            {var service_type='NA'}

            if(orders_reviewed[i].category_id==1)
            {var serviced='Lawn Mowing'}
            
            if(orders_reviewed[i].category_id==2)
            {var serviced='Snow plowing'}
            
            need_review.push({
                  id:orders_reviewed[i].id,
                  order_id:orders_reviewed[i].order_id,
                  service_types:service_type,
                  name:(orders_reviewed[i].user_details !=null) ? orders_reviewed[i].user_details.fristname+" "+orders_reviewed[i].user_details.lastname:'',
                  provider_id:orders_reviewed[i].provider==null ? 'Not Assigned' : orders_reviewed[i].provider.id,
                  provider:orders_reviewed[i].provider==null ? 'Not Assigned' : orders_reviewed[i].provider.fristname+" "+orders_reviewed[i].provider.lastname,
                  service:serviced,
                  total:orders_reviewed[i].provider_amount==null ? "0.00": orders_reviewed[i].provider_amount,
                  status:"Completed",
                //   order_date:moment(orders[i].createdAt).format('MM/DD/YYYY'),
                 
             })
         }

        return res.json({status:true,data:{need_payment,paid,need_review}})
         
        
    }catch(err){
         
     return res.json({status:false,message:'Something is wrong.'}); 
    }
});


router.post('/add-reviewed',accessToken,async(req,res) =>{
    const {order_id} = req.body;
    if(!order_id) return res.json({status:false,message:'order id is required.'});
    try{
    var order = await Order.findOne({where:{order_id}});
    if(!order) return res.json({status:false,'message':'order not found.'});
    order.is_reviewed = 1;
    order.save();
    return res.json({status:true,message:'Order has added in reviewed list.'});

    }catch(err){
      
     return res.json({status:false,message:'Something is wrong.'}); 
    }
});





// refund

router.post('/get-cancelled-data',accessToken,async(req,res) =>{
    try{
        const admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:"admin is deleted"})

        
         const orders_need_refund = await Order.findAll({
            where:{paid_to_provider:0,status:4,is_deleted:0,payment_status:2,is_refund_reviewed:0},    
            include:[
                   {model:User,as:'user_details'},
                   {model:User,as:'provider'},
                   {model:Transaction,as:'transaction_details'},
                   {model:Refund_history,as:'refund_histories'}
                  ],
                  order:[['id','desc']]
                 
         });
        //  return res.json(orders_need_refund)
         var need_refund = [];
         for(let i=0; i<orders_need_refund.length; i++)
         {

            if(orders_need_refund[i].service_type==1)
            {var service_type='One Time'}
            
            if(orders_need_refund[i].service_type==2)
            {var service_type='Recurring'}
            
            if(orders_need_refund[i].service_type==0)
            {var service_type='NA'}

            if(orders_need_refund[i].category_id==1)
            {var serviced='Lawn Mowing'}
            
            if(orders_need_refund[i].category_id==2)
            {var serviced='Snow plowing'}
            
            if(orders_need_refund[i].refund_histories==null){
            need_refund.push({
                  id:orders_need_refund[i].id,
                  order_id:orders_need_refund[i].order_id,
                  service_types:service_type,
                  user_id:orders_need_refund[i].user_details==null ? '' : orders_need_refund[i].user_details.id,
                  name:(orders_need_refund[i].user_details !=null) ? orders_need_refund[i].user_details.fristname+" "+orders_need_refund[i].user_details.lastname:'',
                  provider_id:orders_need_refund[i].provider==null ? 'Not Assigned' : orders_need_refund[i].provider.id,
                  provider:orders_need_refund[i].provider==null ? 'Not Assigned' : orders_need_refund[i].provider.fristname+" "+orders_need_refund[i].provider.lastname,
                  service:serviced,
                  total:orders_need_refund[i].grand_total==null ? "0.00": orders_need_refund[i].grand_total,
                  status:"Completed",
                  charge_id:orders_need_refund[i].transaction_details.transaction_id
                //   order_date:moment(orders[i].createdAt).format('MM/DD/YYYY'),
                 
             })
            }
         }



        //  refund 
        const orders_paid = await Refund_history.findAll({
            where:{is_deleted:0},    
            include:[
                   {
                       model:Order,as:'order',
                       include:[ 
                           {model:User,as:'user_details'},
                            {model:User,as:'provider'}
                        ]
                    }
                  ],
                  order:[['id','desc']]
                 
         });
        
        //  return res.json(orders_paid)
         var paid = [];
         for(let i=0; i<orders_paid.length; i++)
         {   
            paid.push({
                  id:orders_paid[i].order.id,
                  order_id:orders_paid[i].order.order_id,
                  user_id:orders_paid[i].order.user_details==null ? '' : orders_paid[i].order.user_details.id,
                  name:(orders_paid[i].order.user_details !=null) ? orders_paid[i].order.user_details.fristname+" "+orders_paid[i].order.user_details.lastname:'',
                  provider_id:orders_paid[i].order.provider==null ? 'Not Assigned' : orders_paid[i].order.provider.id,
                  provider:orders_paid[i].order.provider==null ? 'Not Assigned' : orders_paid[i].order.provider.fristname+" "+orders_paid[i].order.provider.lastname,
                  total:orders_paid[i].amount==null ? "0.00": orders_paid[i].amount,
                  status:"Completed",
                //   order_date:moment(orders[i].createdAt).format('MM/DD/YYYY'),
                 
             })
         }

        


          //  need review 
          const orders_reviewed = await Order.findAll({
            where:{paid_to_provider:0,status:4,is_deleted:0,payment_status:2,is_refund_reviewed:1},    
            include:[
                   {model:User,as:'user_details'},
                   {model:User,as:'provider'},
                   {model:Transaction,as:'transaction_details'}
                  ],
                  order:[['id','desc']]
                 
         });
        
         var need_review  = [];
         for(let i=0; i<orders_reviewed.length; i++)
         {

            if(orders_reviewed[i].service_type==1)
            {var service_type='One Time'}
            
            if(orders_reviewed[i].service_type==2)
            {var service_type='Recurring'}
            
            if(orders_reviewed[i].service_type==0)
            {var service_type='NA'}

            if(orders_reviewed[i].category_id==1)
            {var serviced='Lawn Mowing'}
            
            if(orders_reviewed[i].category_id==2)
            {var serviced='Snow plowing'}
            
            need_review.push({
                  id:orders_reviewed[i].id,
                  order_id:orders_reviewed[i].order_id,
                  service_types:service_type,
                  user_id:orders_reviewed[i].user_details==null ? '' : orders_reviewed[i].user_details.id,
                  name:(orders_reviewed[i].user_details !=null) ? orders_reviewed[i].user_details.fristname+" "+orders_reviewed[i].user_details.lastname:'',
                  provider_id:orders_reviewed[i].provider==null ? 'Not Assigned' : orders_reviewed[i].provider.id,
                  provider:orders_reviewed[i].provider==null ? 'Not Assigned' : orders_reviewed[i].provider.fristname+" "+orders_reviewed[i].provider.lastname,
                  service:serviced,
                  total:orders_reviewed[i].provider_amount==null ? "0.00": orders_reviewed[i].provider_amount,
                  status:"Completed",
                  charge_id:orders_need_refund[i].transaction_details.transaction_id
                //   order_date:moment(orders[i].createdAt).format('MM/DD/YYYY'),
                 
             })
         }

        return res.json({status:true,data:{need_refund,paid,need_review},message:"data show"})
         
        
    }catch(err){
         
     return res.json({status:false,message:'Something is wrong.'}); 
    }
});




router.post('/add-refund-reviewed',accessToken,async(req,res) =>{
    const {order_id} = req.body;
    if(!order_id) return res.json({status:false,message:'order id is required.'});
    try{
    var order = await Order.findOne({where:{order_id}});
    if(!order) return res.json({status:false,'message':'order not found.'});
    order.is_refund_reviewed = 1;
    order.save();
    return res.json({status:true,message:'Order has added in reviewed list.'});

    }catch(err){
      
     return res.json({status:false,message:'Something is wrong.'}); 
    }
});



//reject provider list 
router.post('/rejected-provider', accessToken, async (req, res) => {
    try {

        var admin = await Admin.findOne({
            where: {
                id: req.user.admin_id,
                is_deleted: 0
            }
        })
        if (!admin) return res.json({
            status: false,
            message: "Admin not found"
        })

        var provider_data = await User.findAll({
            where: {
                role: 2,
                is_deleted: 0,
                admin_approved: 2
            },
            attributes: {
                exclude: ['password']
            },
            include: [{
                    model: Provider_equipment,
                    as: "provider_equipment",
                    where: {
                        is_deleted: 0
                    }
                },
                {
                    model: User_detail,
                    as: 'user_documents'
                }
            ],
            order: [
                ['updatedAt', 'DESC']
            ]
        })

        var users = [];

        for (var i = 0; i < provider_data.length; i++) {
            if (provider_data[i].user_documents != null) {
                let group = (provider_data[i].provider_equipment).reduce((r, a) => {

                    r[a.category_id] = [...r[a.category_id] || [], a];
                    return r;
                }, {});

                var categories = [];


                Object.keys(group).forEach((k, v) => {

                    categories.push(k)




                });
                if (categories == "1", "2") {
                    var test = "Mowing & Plowing"
                }

                if (categories == "1") {
                    test = "Mowing"
                }

                if (categories == "2") {
                    test = "Plowing"
                }
            }
            users.push({
                id: provider_data[i].id,
                name: provider_data[i].fristname + " " + provider_data[i].lastname,
                strip_status: (provider_data[i].account_id == null) ? 0 : 1,
                email: provider_data[i].email,
                contact: provider_data[i].mobile,
                admin_approved: provider_data[i].admin_approved,
                service: test

            })
        }
        return res.json({
            status: true,
            data: {
                users
            },
            message: "Provider details"
        })

    } catch (err) {
        return res.json(err)
    }
})

// add to hold provider
router.post("/add-hold", accessToken, async (req, res) => {
    const {provider_id} = req.body;
    if (!provider_id) return res.json({status: false,message: "Provider id required"})

    try {

        var admin = await Admin.findOne({ where: {id: req.user.admin_id,is_deleted: 0 }});
        if(!admin) return res.json({status: false, message: "Admin not found"});

        var user = await User.findOne({where: {id: provider_id,role: 2,is_deleted: 0}});
        if (!user) return res.json({ status: false,message: "Provider not found" });

        user.admin_approved = 3;
        user.save();
        return res.json({ status: true, message:"Provider is hold....!" })

    } catch (err) {
        return res.json({
            status: false,
            message: "Something is wrong"
        })
    }
})


//hold provider list
router.post("/hold-provider", accessToken, async (req, res) => {
    try {
        var admin = await Admin.findOne({
            where: {
                id: req.user.admin_id,
                is_deleted: 0
            }
        });
        if (!admin) return res.json({
            status: false,
            message: "Admin not found"
        });

        ///////////     
        const provider_data = await User.findAll({

            where: {
                admin_approved: 3,
                is_deleted: 0,
                role: 2
            },

            include: [{
                    model: Provider_equipment,
                    as: "provider_equipment",
                    where: {
                        is_deleted: 0
                    }
                },
                {
                    model: User_detail,
                    as: 'user_documents'
                }
            ],
            order: [
                ['updatedAt', 'desc']
            ]
        })

        const users = [];


        for (var i = 0; i < provider_data.length; i++) {
            if (provider_data[i].user_documents != null) {
                let group = (provider_data[i].provider_equipment).reduce((r, a) => {

                    r[a.category_id] = [...r[a.category_id] || [], a];
                    return r;
                }, {});



                var categories = [];


                Object.keys(group).forEach((k, v) => {

                    categories.push(k)


                });

                if (categories == "1", "2") {
                    var test = "Mowing & Plowing"
                }

                if (categories == "1") {
                    test = "Mowing"
                }

                if (categories == "2") {
                    test = "Plowing"
                }


                users.push({
                    id: provider_data[i].id,
                    name: provider_data[i].fristname + " " + provider_data[i].lastname,
                    strip_status: (provider_data[i].account_id == null) ? 0 : 1,
                    email: provider_data[i].email,
                    contact: provider_data[i].mobile,
                    admin_approved: provider_data[i].admin_approved,
                    service: test

                })

            }
        }


        return res.json({
            status: true,
            data: {
                users
            },
            message: "Show Pending Provider"
        })


    } catch (err) {
        return res.json({
            status: false,
            message: "Something is wrong"
        })
    }
})

//ADD OPTION

router.post('/add-options',accessToken,async(req,res) =>{
    const {name} = req.body;
    if(!name) return res.json({status:false,message:"Name is required"});

    try{
    
        var admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
        if(!admin) return res.json({status:false,message:'admin not found.'});

        var match = await Option.findOne({where:{name,is_deleted:0}});
        if(match) return res.json({status:false,message:"This name is already exist"});

        var opt = await Option.create({name})
        return res.json({status:true,message:"add add option successful..."})

    }catch(err){
     
    return res.json({status:false,message:'Something is wrong.'});
    }
});

//GET OPTION

router.post('/get-option',accessToken,async(req,res)=>{
    try{
        var admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}});
        if(!admin) return res.json({status:false,message:"Admin not found."});

        var opt = await Option.findAll({where:{is_deleted:0}});
        return res.json({status:true,data:{opt},message:"Option get"})

    }catch(err)
    {
        return res.json({status:false,message:"Something is wrong"})
    }
})

//UPDATE OPTION..

router.post('/option-update',accessToken,async(req,res)=>{
    const {id,name}= req.body;
    if(!id) return res.json({status:false,message:"Id is require"});
    if(!name) return res.json({status:false,message:"Name is require"});
    try{

        var admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}});
        if(!admin) return res.json({status:false,message:"Admin not found."});

        var opt = await Option.findOne({where:{id,is_deleted:0}});
        if(!opt) return res.json({status:false,message:"Id not match"});

        opt.name=name;
        opt.save();

        return res.json({status:true,message:"Option updated."})


    }catch(err)
    {
        return res.json({status:false,message:"Someting is wrong"})
    }
})


//get tech support

router.post('/get-tech-support',accessToken,async(req,res)=>{
    try{
        var admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}});
        if(!admin) return res.json({status:false,message:"Admin not found."});

        var support_data= await Tech_support.findAll({
            where:{is_deleted:0},
            order:[['id','desc']]
        
        });
        return res.json({status:true,data:{support_data},message:"Technical support data"})
    }
    catch(err)
    {
        return res.json({status:false,message:"Somthing is wrong"})
    }
})



router.post('/send-notification',accessToken,async(req,res)=>{
    const {userdata,providerdata,role,sendto,text}= req.body;
    if(!text) return res.json({status:false,message:"Notification is require."})
    try{
        var admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}});
        if(!admin) return res.json({status:false,message:"Admin not found."});

        if(sendto ==="sendtoall"){
            if(role=="user"){
                var newarr= await User.findAll({where:{role:1,is_deleted:0}});
            }else if(role=="provider"){
                var newarr= await User.findAll({where:{role:2,is_deleted:0}});
            }else{
                var newarr= await User.findAll({where:{is_deleted:0}});
            }
           
          
            for(var i=0 ; i<newarr.length; i++)
            {   
                   if(newarr[i].fcm_token !='' && newarr[i].role==1){
                    
                       
                    var message = { 
                    to: newarr[i].fcm_token, 
                    collapse_key: '',
                    
                    notification:{
                    title:'Admin Message',
                    body:`${text}`
                    },
                     data:{
                        // order_id:order_id,
                        title:'Admin Message',
                        body:`${text}`,
                        click_action:'user_and_provider',
                    }
                    };
                    
                        fcm.send(message, function(err, response){
                        if (err) {console.log("user",err);} else {console.log("notification done");}
                        });
                    }
                    //end notification
    
    
                //start notification for provider 
                if(newarr[i].fcm_token !='' && newarr[i].role==2){
                    console.log(sendto)
                    var message = { 
                    to: newarr[i].fcm_token, 
                    collapse_key: '',
                    
                    notification:{
                    title:'Admin Message',
                    body:`${text}`
                    },
                     data:{
                        // order_id:order_id,
                        title:'Admin Message',
                        body:`${text}`,
                        click_action:'user_and_provider',
                    }
                    };
                    
                    fcm1.send(message, function(err, response){
                     if (err) { console.log("provider",err);} else {console.log("notification done");}
                    });
                    
                    }
                    //end notification
                  
            }


        }else{

            var newarr = userdata.concat(providerdata)
            for(var i=0 ; i<newarr.length; i++)
            {   
                var user= await User.findOne({where:{id:newarr[i],is_deleted:0}});
              
                // user.notification=notification
                // user.save();
              
                    //start notification for user
                   if(user.fcm_token !='' && user.role==1){
                    
                  
                    var message = { 
                    to: user.fcm_token, 
                    collapse_key: '',
                    
                    notification:{
                    title:'Admin Message',
                    body:`${text}`
                    },
                     data:{
                        // order_id:order_id,
                        title:'Admin Message',
                        body:`${text}`,
                        click_action:'user_and_provider',
                    }
                    };
                    
                        fcm.send(message, function(err, response){
                        if (err) {console.log("user",err);} else {console.log("notification done");}
                        });
                    }
                    //end notification
    
    
                //start notification for provider 
                if(user.fcm_token !='' && user.role==2){
                    var message = { 
                    to: user.fcm_token, 
                    collapse_key: '',
                    
                    notification:{
                    title:'Admin Message',
                    body:`${text}`
                    },
                     data:{
                        // order_id:order_id,
                        title:'Admin Message',
                        body:`${text}`,
                        click_action:'user_and_provider',
                    }
                    };
                    
                    fcm1.send(message, function(err, response){
                     if (err) { console.log("provider",err);} else {console.log("notification done");}
                    });
                    
                    }
                    //end notification
                  
            }
        }
        return res.json({status:true,message:"All notifications"})


    }catch(err){
       
        return res.json({status:false,message:"Somthing is wrong."})
    }
})



// //admin push message on user and provider

// router.post('/send-notification',accessToken,async(req,res)=>{
//     const {user_id,notification}= req.body;
//     if(!notification) return res.json({status:false,message:"Notification is require."})
//     try{
//         var admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}});
//         if(!admin) return res.json({status:false,message:"Admin not found."});

//         var xx=[];
//        for(var i=0 ; i<user_id.length; i++)
//         {   
//             var user= await User.findOne({where:{id:user_id[i],is_deleted:0}});
           
//             user.notification=notification
//             user.save();

//             //start notification for provider 
//             if(user.fcm_token !='' && user.role==2){
//                 var message = { 
//                 to: user.fcm_token, 
//                 collapse_key: '',
                
//                 notification:{
//                 title:'Admin Message',
//                 body:`${notification}`
//                 },
//                  data:{
//                     // order_id:order_id,
//                     title:'Admin Message',
//                     body:`${notification}`,
//                     click_action:'user_and_provider',
//                 }
//                 };
                
//                 fcm1.send(message, function(err, response){
//                 if (err) {
//                  ;
//                 } else {
//                 console.log("notification done");
//                 }
//                 });
                
//                 }
//                 //end notification


//                  //start notification for user
//                 if(user.fcm_token !='' && user.role==1){
                
                   
//                     var message = { 
//                     to: user.fcm_token, 
//                     collapse_key: '',
                    
//                     notification:{
//                     title:'Admin Message',
//                     body:`${notification}`
//                     },
//                      data:{
//                         // order_id:order_id,
//                         title:'Admin Message',
//                         body:`${notification}`,
//                         click_action:'user_and_provider',
//                     }
//                     };
                    
//                     fcm.send(message, function(err, response){
//                     if (err) {
//                      ;
//                     } else {
//                     console.log("notification done");
//                     }
//                     });
//                     }
//                     //end notification


//                 xx.push({
//                     notification:user.notification
//                 })
//         }
      
//         return res.json({status:true,data:xx,message:"All notifications"})


//     }catch(err){
       
//         return res.json({status:false,message:"Somthing is wrong."})
//     }
// })




//user cron in node js

router.post('/abcd',async(req,res)=>{
    try{

        var cronJob = cron.job("* * * * * *", function(){
        // perform operation e.g. GET request http.get() etc.
        console.info('cron job completed');
        }); 
        cronJob.start();

    }catch(err)
    {
        return res.json(err)
    }
})

//chunk in node js 
router.post('/chunk',async(req,res)=>{
    try{

       
       // chunk lagaya h user panal me sabse upr cron chal raha h vaha { limit: 20//for a every second 20 recurring order post }

    } catch(err)
    {
        return res.json(err)
    }
})

// today recurring order details get

router.post('/today-recu',accessToken,async(req,res)=>{
    try{
       
        var admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}});
        if(!admin) return res.json({status:false,message:"Admin not found."});
     
        var today_date = moment().format('YYYY-MM-DD');

        var today_recu = await Recurring_history.findAll({
           
            where:{
                
                [Op.and]:sequelize.where(sequelize.fn('date', sequelize.col('date')), '=', today_date),
            },
            order:[['id','desc']],
            include:[
                 {
                  model:User,as:'userdata'
                 }
                 ]
            
        })
        var stack=[];
        for(var i=0;i<today_recu.length; i++)
        {
            stack.push({
                order_id:today_recu[i].order_id,
                status:today_recu[i].status,
                workDate:today_recu[i].date,
                user_name:today_recu[i].userdata.fristname+" "+today_recu[i].userdata.lastname

            })
        }

        return res.json({stack})
     
    } catch(err)
    {
        return res.json(err)
    }
})

    //send eta by admin

    router.post('/send-eta',accessToken,async(req,res)=>{
        const {dateAndtime,order_id} = req.body;
        if(!dateAndtime) return res.json({status:false,message:"Date and Time is require."});
        if(!order_id) return res.json({status:false,message:"Order id is required."})
        try{

            var admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}});
            if(!admin) return res.json({status:false,message:"Admin not found."});

            var order = await Order.findOne({where:{order_id,is_deleted:0,status:2}})
            if(!order) return res.json({status:false,message:"Order not found"})

            order.eta_date=dateAndtime;
            order.save();

            
            var user= await User.findOne({where:{id:order.user_id,is_deleted:0}});
            if(!user) return res.json({status:false,message:"user not found"})
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
                

        }catch(err)
        {
            return res.json()
        }
    })
    //get ETA details...
    router.post('/get_eta',accessToken,async(req,res)=>{
        const {order_id}= req.body;
        if(!order_id) return res.json({status:false,message:"Order_id is require"});
        try{
    
            var admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}});
            if(!admin) return res.json({status:false,message:"Admin not found."});

    
        var order = await Order.findOne({where:{order_id,is_deleted:0,status:2}});
        if(!order) return res.json({status:false,message:"Order not found"})
    
        return res.json({status:true,data:{order:order.eta_date},message:"ETA time and date"})
        }catch(err)
        {
        return res.json({status:false,data:{err},message:"Somthing is wrong"})
        }
    })

//change Day of the week admin recurring service ke din ko change kar sakta he

router.post('/change-recurring-day',accessToken,async(req,res)=>{
    const {order_id,change_date} = req.body;
    if(!change_date) return res.json({status:false,message:"Chaneg date is require"})
    if(!order_id) return res.json({status:false,message:"Order_id is require"});
    try{
        var admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}});
        if(!admin) return res.json({status:false,message:"Admin not found."});


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
        // return res.json(order);
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
        var admin = await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}});
        if(!admin) return res.json({status:false,message:"Admin not found."});

        var order = await Order.findOne({
            where:{order_id,is_deleted:0},
            include:[
                {
                    model:User,as:'user_details'
                }
            ]
        })
    //   return res.json(order)
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


//Recurring job filter by Day |Week | Month  &&  every 2 weeks , 10 days and 14 days

router.post('/rucurring-filter',accessToken,async(req,res)=>{
    const {condition,action,days}= req.body;
    //condition=>today, week ,month
    //action=>1,2
    //days=>7,10,14
    if(!action) return res.json({status:false,message:"Action is required"})
   
    try{

        var admin = await Admin.findOne({ where: {id:req.user.admin_id,is_deleted:0}});
        if(!admin) return res.json({status: false, message: "Admin not found"});

        if(action==1)
        {  
            if(!condition) return res.json({status:false,message:"condition is require"})
        var recurring_data = await Recurring_history.findAll({
            where:{is_deleted:0,status:{[Op.not]:"Pending"}},
            order:[['id','desc']],
            include:[
                 {
                  model:User,as:'userdata'
                 }
                 ]  
         })
         
         //return res.json(recurring_data)
      

        var today_date = moment().format('YYYY-MM-DD');
        if(condition==="today")
        {
            last_date = moment(today_date,'YYYY-MM-DD').add(0, 'days').format("YYYY-MM-DD");
        //  return res.json(last_date)
        }
        if(condition==="week")
        {
            last_date = moment(today_date,'YYYY-MM-DD').add(7, 'days').format("YYYY-MM-DD");
        //   return res.json(last_date)
        }
        if(condition==="month")
        {
            last_date = moment(today_date,'YYYY-MM-DD').add(30, 'days').format("YYYY-MM-DD");
        //   return res.json(last_date)
        }
        // return res.json(last_date)
       
      var plus=[];
        for(var i=0 ; i<recurring_data.length; i++)
        {
           
            // recurring_data[i].date 
            var d1 = today_date.split("-");
            var d2 = last_date.split("-");
            var check = recurring_data[i].date.split("-");
        //   return res.json(check)
             
         if(check >= d1 && check <= d2)
            {
                var last_s= moment(recurring_data[i].createdAt).format('YYYY-MM-DD');
                //return res.json(last_s)
                plus.push({
                    id:recurring_data[i].id,
                    order_id:recurring_data[i].order_id,
                    user_id:recurring_data[i].user_id,
                    user_name:recurring_data[i].userdata.fristname+" "+recurring_data[i].userdata.lastname,
                    provider_id:recurring_data[i].provider_id,
                    recurring_plan:`Every ${recurring_data[i].on_every} days`,
                    status:recurring_data[i].status,
                    last_service:recurring_data[i].last_s,
                    next_service:recurring_data[i].date,
                    city:recurring_data[i].userdata.city,
                    state:recurring_data[i].userdata.state,
                })
               
            }
        }
      
      return res.json({status:true,data:{plus},message:"Recurring Jobs"})
    }else{
        if(!days) return res.json({status:false,message:"Days is require"})

        var recurring_data = await Recurring_history.findAll({
            where:{is_deleted:0,status:{[Op.not]:"Pending"},on_every:days},
            order:[['id','desc']],
            include:[
                 {
                  model:User,as:'userdata'
                 }
                 ]  
         })
         var plus=[];
         for(var i=0 ; i<recurring_data.length; i++)
         {
            
             plus.push({
                     id:recurring_data[i].id,
                     order_id:recurring_data[i].order_id,
                     user_id:recurring_data[i].user_id,
                     user_name:recurring_data[i].userdata.fristname+" "+recurring_data[i].userdata.lastname,
                     provider_id:recurring_data[i].provider_id,
                     recurring_plan:`Every ${recurring_data[i].on_every} days`,
                     status:recurring_data[i].status,
                     last_service:recurring_data[i].last_s,
                     next_service:recurring_data[i].date,
                     city:recurring_data[i].userdata.city,
                     state:recurring_data[i].userdata.state,
                 })
                
             
         }

         return res.json({status:true,data:{plus},message:"Recurring Jobs"})    
    }
    }catch(err)
    {
        return res.json({status:false,message:"Something is wrong.",err:err})
    }
})


// //cancel order details ....OLD

// router.post('/cancel-order-list',accessToken,async(req,res)=>{
   
//     try{
     
//          const admin= await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
//          if(!admin) return res.json({status:false,message:"Admin not found"})
//          //   return res.json("okkk")
//          const order =await Declined_order.findAll({where:{is_deleted:0,status:1},
         
//          include:[
//              {
//                  model:User,as:'provider_details'
//              }
//          ]
             
//          })
//         //  return res.json(order)
//          var capsul=[];
//          for(let i=0; i<order.length; i++)
//          {
         
//              capsul.push({
//                  id:order[i].id,
//                  order_id:order[i].order_id,
//                  provider_id:order[i].provider_id,
//                  provider_name:order[i].provider_details.fristname +" "+ order[i].provider_details.lastname,
//                  cancel_reason:(order[i].cancel_reason !=null)?order[i].cancel_reason:"",
//                  decline_date:moment(order[i].updatedAt).format('MM/DD/YYYY'),
                 
                 
//              })
//          }
        
//         return res.json({status:true,data:{capsul},message:"Cancel order has show"})
         
//      }catch(err){
          
//          return res.json({status:false,err : err ,message:"Something is wrong"})
//      }
//  })


//cancel order details ....NEW
 
router.post('/cancel-order-list',accessToken,async(req,res)=>{
   
    try{
        
         const admin= await Admin.findOne({where:{id:req.user.admin_id,is_deleted:0}})
         if(!admin) return res.json({status:false,message:"Admin not found"})
         //   return res.json("okkk")
         const decline_orders =await Declined_order.findAll({
             where:{is_deleted:0,status:1},
             // include:[{model:User,as:'provider_details'}]
             
         })
         
         var capsul=[];
         for(let i=0; i<decline_orders.length; i++)
         {
             var order = await Order.findOne({
                 where:{order_id:decline_orders[i].order_id},
                 include:[{model:User,as:'user_details'}]
             });
             // var user = await User.findOne({where:{id:order[i].user_id}});
             capsul.push({
                 id:decline_orders[i].id,
                 order_id:decline_orders[i].order_id,
                 user_id:order.user_details.user_id,
                 username:order.user_details.fristname +" "+ order.user_details.lastname,
                 cancel_reason:decline_orders[i].cancel_reason,
                 decline_date:moment(decline_orders[i].updatedAt).format('MM/DD/YYYY'),
                 amount:order.grand_total
                 })
         }
        // return res.json("okkkkk")
        return res.json({status:true,data:{capsul},message:"Cancel order has show"})
         
     }catch(err){
          
         return res.json({status:false,err : err ,message:"Something is wrong"})
     }
 })
 
 
//10000 randum number
router.post('/ca',async(req,res)=>{
   const {len,alfa}= req.body;
//    if(!len) return res.json({status:false,message:"len is require"})

    try{

        var num =0;
        var Onum=[];
        for(var i=num; i<=9999;i++)
        {
            if(i>-1 && i<10)
            {
                Onum.push({Number:`000${i}`}) 
            }
            if(i>9 && i<100)
            {
                // Onum=`00${i}`
                Onum.push({Number:`00${i}`})
            }
            if(i>99 && i<1000)
            {
                // Onum=`0${i}`
                Onum.push({Number:`0${i}`})
            }
            if(i>999 && i<10000)
            {
                // Onum=`${i}`
                Onum.push({Number:`${i}`})
            }
        }
        return res.json({status:false,data:Onum})
    //  var text="";
    //     for(var i=0; i<=10000; i++){   

    //      var jj = Math.floor(1000+ Math.random() * 900);
    //      text += jj +","
    //     }
    //     return res.json([text])
        
       
            // var text = [];
           
            // var char_list =
            //   "12345252522";
            // for (var i = 0; i < len; i++) {
            //     text.push(char_list.charAt(Math.floor(Math.random() * char_list.length)))
              
            // }
           
               

            if(alfa){
                // var char_list ="abcdefgh";

                // for (var i = 0; i < len; i++) {
                //     RandomNumber.push(`0${Math.floor(100 + Math.random() * 900)}`)
                //    }
                
                var RandomNumber = [];
            
                    while(RandomNumber.length < 100){
                        var r = `0${Math.floor(100 + Math.random() * 199)}` ;
                        
                        if(RandomNumber.includes(r) === false) 
                        //  if(RandomNumber.indexOf(r) === -1) dono same hi he indexof data nahi milne pr  -1 return krta h or include true false
                        {   
                        
                        RandomNumber.push(r);
                        }
                    }
                    // console.log(RandomNumber);

            }else{

                var char_list ="1234567890"

                for (var i = 0; i < 100; i++) {
                    RandomNumber.push(`${Math.floor(1000 + Math.random() * 9020)}`)
                }
                            //     var nums = [1,2,3,4,5,6,7,8,9,10],
                            
                            //     i = nums.length,
                            //     j = 0;

                            // while (i--) {
                            //     j = Math.floor(Math.random() *(i+1));
                            //     RandomNumber.push(nums[j]);
                            //     nums.splice(j,1);
                            // }
                        
                        

            } 

          
          
          
        
     }catch(err){
          
         return res.json({status:false,err,err, message:"Something is wrong"})
     }
 })
module.exports = router;