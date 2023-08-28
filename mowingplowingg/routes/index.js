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

const { json } = require('body-parser');
const category = require('../models/category');
const user = require('../models/user');
const image = require('../models/product_images');
const moment = require('moment');  
const product = require('../models/product');

const {Order} = require('../models');
const {sequelize, Sequelize, User,Category,Subcategory,Equipment,Privacy_policy,User_detail,Bank_detail,Provider_equipment,Admin,Option} = require('../models');
const Op = Sequelize.Op;

const client = require('twilio')("ACa7971b7881e2db94aff914f7efb68c81", "20326a88cc3feca1af3a5df461e340eb");//sms ke liye


router.post("/sendotp",async(req,res) =>{
    try{
    //   var reslt = await client.messages.create({ 
    //       body: "hi check form nodejs",
    //       from: "+17075874531",
    //       to: "+919753244000"
    //   });
     
     return res.json(Math.floor(100000 + Math.random() * 900000))
    }catch(err){
        return res.json(err)
    }    
});

router.post('/register',async(req,res)=>{

 
  const {fristname,lastname,email,mobile,address,password,device_id,fcm_token,lat,long,role,street,city,zip_code,state,country,dob}=req.body;
  if(!fristname) throw res.json({status:false,message:'Enter your frist name '})
  if(!lastname) throw res.json({status:false,message:"Enter your last name"})
  if(!email) throw res.json({status:false,message:"Enter your email address"})
  if(!mobile) throw res.json({status:false,message:"Enter your mobile number"})
//   if(!address) throw res.json({status:false,message:"Enter your address"})
  if(!password) throw res.json({status:false,message:"please create password"})
  
//   if(role==2){
//      if(!dob) throw res.json({status:false,message:"Enter your dob"}) 
//   }
  
  if(role == 2){
      if(!role) throw res.json({status:false,message:"Role is required."})
    //   if(!street) throw res.json({status:false,message:"Enter your street"})
      if(!city) throw res.json({status:false,message:"Enter your city"})
      if(!zip_code) throw res.json({status:false,message:"Enter your zip_code"})
      if(!state) throw res.json({status:false,message:"Enter your state"})
      if(!country) throw res.json({status:false,message:"Enter your country"})
  }
  
  
 
  try{   
      
    // const checkEmail = await User.findOne({where:{email:email,status:1,is_blocked:0,is_deleted:0,role}})
    // if(checkEmail) return res.json({status:false,message:"Email is already exist"})
    
    // const checkPhone = await User.findOne({where:{mobile:mobile,status:1,is_blocked:0,is_deleted:0,role}})
    // if(checkPhone) return res.json({status:false,message:"Mobile number is already exist"})
    const checkEmail = await User.findOne({where:{email:email,is_blocked:0,is_deleted:0,role}})
    if(checkEmail) return res.json({status:false,message:"Email is already exist"})
    
    const checkPhone = await User.findOne({where:{mobile:mobile,is_blocked:0,is_deleted:0,role}})
    if(checkPhone) return res.json({status:false,message:"Mobile number is already exist"});

   
    const hash = bcrypt.hashSync(password,10)
    var otp = Math.floor(100000 + Math.random() * 900000)
    if(role==1){
        
         var user = await User.create({
                            image:'/users/default.png',
                            fristname,
                            lastname,
                            email,
                            mobile,
                            address:address,
                            street:street ? street:'',
                            city:'',
                            zip_code:'',
                            state:'',
                            country:'',
                            password:hash,
                            device_id,
                            fcm_token,
                            lat,
                            lng:long,
                            role,
                            dob:dob ? dob:"",
                            otp
        
                          })
                          
                          
                           var reslt = await client.messages.create({ 
                              body: "Your OTP:"+otp+" for mowingandplowing signup user",
                              from: "+17075874531",
                              to: "+1"+mobile,
                          });
      

    }else{
     
         var user = await User.create({
                            image:'/users/default.png',
                            fristname,
                            lastname,
                            email,
                            mobile,
                            address:address,
                            street:street?street:"",
                            city,
                            zip_code,
                            state,
                            country,
                            password:hash,
                            device_id,
                            fcm_token,
                            lat,
                            lng:long,
                            role,
                            dob:dob ? dob:"",
                            otp
        
                          })
                          console.log("useruser",user)
                       return res.json(user);
                             
                          //  var reslt = await client.messages.create({ 
                          //     body: "Your OTP:"+otp+" for mowingandplowing signup provider",
                          //     from: "+17075874531",
                          //     to: "+1"+mobile,
                          // });
                          
    }
   
    

    //  const token=jwt.sign({user_id:user.id},"aabbcc")
     
     return res.json({status:true,data:{user_id:user.id,lat:user.lat,lng:user.lng},message:"Registered successfully"})
    
    }catch{
    (err)=>{
      console.log(err)
      return res.json({status:false,message:"somthing is wrong"})
    }
  }
})


// router.post('/otp-verify',async(req,res) =>{
    
//     const {otp} = req.body;
//     if(!otp) return res.json({status:false,message:'otp is required.'});
    
//     try{
        
//     }catch(err){
//         console.log(err)
//         return res.json({status:false,message:'something is wrong.'});
//     }
    
// });
router.post('/login',async(req,res)=>{
  const {email,password,device_id,fcm_token,lat,long,role}= req.body

  if(!email) return res.json({status:false,message:"Email is require"})
  if(!password) return res.json ({status:false,message:"Password is required"})

  try{
   
    const user = await User.findOne({where:{email:email,role,is_deleted:0}})
    if(!user) return res.json({status:false,message:"Check your email."});
    
     var otp = Math.floor(100000 + Math.random() * 900000)
   
    
    if(user.is_blocked==1) return res.json({status:false,message:'User is blocked.'})
    
     user.device_id = device_id;
     user.fcm_token = fcm_token;
     user.otp = otp;
    //  user.lng = long;
     user.role = role;
     user.save();
     
  
    const match = await bcrypt.compare(password,user.password)
    if(!match) return res.json({status:false,message:"password is wrong"})
   
   
    const token = jwt.sign({user_id:user.id},"aabbcc")
   
    
    if(user.role==1){
        
       if(user.status==1){
           
          //  const mailOption={
               
          //       to:user.email,
          //       from:`Mowing and Plowing"<hello@mowingandplowing.com>`,
          //       subject:'Welcome to Mowing And Plowing App',
          //       html:`<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta name="x-apple-disable-message-reformatting"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title></title> <style type="text/css"> table, td { color: #000000; } a { color: #0000ee; text-decoration: underline; } @media (max-width: 480px) { #u_content_image_8 .v-src-width { width: auto !important; } #u_content_image_8 .v-src-max-width { max-width: 40% !important; } #u_content_heading_6 .v-container-padding-padding { padding: 35px 10px 6px !important; } #u_content_text_16 .v-container-padding-padding { padding: 10px 22px 20px !important; } }@media only screen and (min-width: 620px) { .u-row { width: 600px !important; } .u-row .u-col { vertical-align: top; } .u-row .u-col-25 { width: 150px !important; } .u-row .u-col-50 { width: 300px !important; } .u-row .u-col-100 { width: 600px !important; }}@media (max-width: 620px) { .u-row-container { max-width: 100% !important; padding-left: 0px !important; padding-right: 0px !important; } .u-row .u-col { min-width: 320px !important; max-width: 100% !important; display: block !important; } .u-row { width: calc(100% - 40px) !important; } .u-col { width: 100% !important; } .u-col > div { margin: 0 auto; }}body { margin: 0; padding: 0;}table,tr,td { vertical-align: top; border-collapse: collapse;}p { margin: 0;}.ie-container table,.mso-container table { table-layout: fixed;}* { line-height: inherit;}a[x-apple-data-detectors='true'] { color: inherit !important; text-decoration: none !important;}table{ border: none !important;}</style> </head><body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #dde5e7;color: #000000"> <table style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #f9f8f8;width:100%" cellpadding="0" cellspacing="0"> <tbody> <tr style="vertical-align: top"> <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;"> <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"> <div style="width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]--> <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left"> <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <span>&#160;</span> </td> </tr> </tbody> </table> </td> </tr> </tbody></table></div> </div></div> </div> </div></div><div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;"> <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"> <div style="background-color: #17203a;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <table id="u_content_image_8" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:arial,helvetica,sans-serif;" align="left"> <table width="100%" cellpadding="0" cellspacing="0" border="0"> <tr> <td style="padding-right: 0px;padding-left: 0px;" align="center"> <a href="https://unlayer.com" target="_blank"> <img align="center" border="0" src="https://mowingandplowing.com/mowingplowing/template/user/image-6.jpeg" alt="Logo" title="Logo" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 32%;max-width: 192px;" width="192" class="v-src-width v-src-max-width"/> </a> </td> </tr></table> </td> </tr> </tbody></table> </div> </div></div> </div> </div></div><div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;"> <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"> <div style="width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <table id="u_content_heading_6" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:20px 10px 6px;font-family:arial,helvetica,sans-serif;" align="left"> <h1 style="margin: 0px; color: #17203a; line-height: 140%; text-align: center; word-wrap: break-word; font-weight: normal; font-family: tahoma,arial,helvetica,sans-serif; font-size: 32px;"> <strong>Welcome to Mowing and Plowing</strong> </h1> </td> </tr> </tbody></table><table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left"> <div style="color: #3eabf7; line-height: 140%; text-align: center; word-wrap: break-word;"> <p style="font-size: 14px; line-height: 140%;"><span style="font-size: 20px; line-height: 28px;">Thanks for signing up! We're excited to have you join us for Mowing and Plowing services.</span></p> </div> </td> </tr> </tbody></table><table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left"> <div style="color: #000000; line-height: 140%; text-align: center; word-wrap: break-word;"> <p style="font-size: 14px; line-height: 140%;">Just request Lawn Mowing or snow plowing, and one of our pros will take care of your job at your scheduled time.</p> </div> </td> </tr> </tbody></table><table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left"> <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <span>&#160;</span> </td> </tr> </tbody> </table> </td> </tr> </tbody></table> </div> </div></div> </div> </div></div><div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;"> <div class="u-col u-col-50" style="max-width: 320px;min-width: 300px;display: table-cell;vertical-align: top;"> <div style="width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:20px 10px 1px;font-family:arial,helvetica,sans-serif;" align="left"> <div style="color: #333333; line-height: 140%; text-align: center; word-wrap: break-word;"> <p style="font-size: 14px; line-height: 140%;"><span style="font-size: 22px; line-height: 30.8px;"><strong>Get the new app</strong></span></p> </div> </td> </tr> </tbody></table> </div> </div></div><div class="u-col u-col-50" style="max-width: 320px;min-width: 300px;display: table-cell;vertical-align: top;"> <div style="background-color: #ffffff;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:61px 10px 10px;font-family:arial,helvetica,sans-serif;" align="left"> <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="0%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <span>&#160;</span> </td> </tr> </tbody> </table> </td> </tr> </tbody></table> </div> </div></div> </div> </div></div><div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;"> <div class="u-col u-col-50" style="max-width: 320px;min-width: 300px;display: table-cell;vertical-align: top;"> <div style="background-color: #ffffff;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 22px;font-family:arial,helvetica,sans-serif;" align="left"> <table width="100%" cellpadding="0" cellspacing="0" border="0"> <tr> <td style="padding-right: 0px;padding-left: 0px;" align="center"> <img align="center" border="0" src="https://mowingandplowing.com/mowingplowing/template/user/image-7.png" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 200px;" class="v-src-width v-src-max-width"/> </td> </tr></table> </td> </tr> </tbody></table> </div> </div></div><div class="u-col u-col-50" style="max-width: 320px;min-width: 300px;display: table-cell;vertical-align: top;"> <div style="background-color: #ffffff;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left"> <div style="color: #000000; line-height: 140%; text-align: left; word-wrap: break-word;"> <p style="font-size: 14px; line-height: 140%;"><strong>Choose a service </strong></p><p style="font-size: 14px; line-height: 140%;">&nbsp;</p><p style="font-size: 14px; line-height: 140%;">Download our APP, and enter a few details about your property.&nbsp;</p><p style="font-size: 14px; line-height: 140%;">&nbsp;</p><p style="font-size: 14px; line-height: 140%;"><strong>Schedule it</strong></p><p style="font-size: 14px; line-height: 140%;">&nbsp;</p><p style="font-size: 14px; line-height: 140%;">Pick the best day and time for you. Choose between Instant, One-time, Weekly, Bi-weekly, and Every 14 days</p><p style="font-size: 14px; line-height: 140%;">&nbsp;</p><p style="font-size: 14px; line-height: 140%;"><strong>Feel Free</strong></p><p style="font-size: 14px; line-height: 140%;">&nbsp;</p><p style="font-size: 14px; line-height: 140%;">Now it&rsquo;s our time to work. We will keep you informed from start to finish of each job.&nbsp;</p><p style="font-size: 14px; line-height: 140%;">You will also receive job completion pictures each time</p> </div> </td> </tr> </tbody></table><div class="u-col u-col-25" style="max-width: 320px;min-width: 150px;display: table-cell;vertical-align: top;"> <div style="background-color: #ffffff;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:11px;font-family:arial,helvetica,sans-serif;" align="left"> <table width="100%" cellpadding="0" cellspacing="0" border="0"> <tbody><tr> <td style="padding-right: 0px;padding-left: 0px;" align="center"> <a href="https://play.google.com/store/apps/details?id=com.cw.mowingplowing_user" target="_blank"> <img align="center" border="0" src="https://mowingandplowing.com/mowingplowing/template/user/image-4.png" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 128px;" width="128" class="v-src-width v-src-max-width"> </a> </td> </tr></tbody></table> </td> </tr> </tbody></table> </div> </div></div><div class="u-col u-col-25" style="max-width: 320px;min-width: 150px;display: table-cell;vertical-align: top;"> <div style="background-color: #ffffff;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:12px 10px 10px;font-family:arial,helvetica,sans-serif;" align="left"> <table width="100%" cellpadding="0" cellspacing="0" border="0"> <tbody><tr> <td style="padding-right: 0px;padding-left: 0px;" align="center"> <a href="https://apps.apple.com/us/app/mowing-and-plowing/id1583943448" target="_blank"> <img align="center" border="0" src="https://mowingandplowing.com/mowingplowing/template/user/image-5.png" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 130px;" width="130" class="v-src-width v-src-max-width"> </a> </td> </tr></tbody></table> </td> </tr> </tbody></table> </div> </div></div></div> </div></div> </div> </div></div><div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;"> <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"> <div style="background-color: #ffffff;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left"> <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <span>&#160;</span> </td> </tr> </tbody> </table> </td> </tr> </tbody></table> </div> </div></div> </div> </div></div><div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;"> <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"> <div style="width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left"> <h1 style="margin: 0px; color: #3eabf7; line-height: 140%; text-align: center; word-wrap: break-word; font-weight: normal; font-family: tahoma,arial,helvetica,sans-serif; font-size: 22px;"> <strong>Tips to get started</strong> </h1> </td> </tr> </tbody></table><table id="u_content_text_16" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 50px 20px;font-family:arial,helvetica,sans-serif;" align="left"> <div style="color: #333333; line-height: 120%; text-align: left; word-wrap: break-word;"> <p style="font-size: 14px; line-height: 120%;"><span style="font-size: 16px; line-height: 19.2px;"><strong>Request a provider when you&rsquo;re Ready</strong></span></p><p style="font-size: 14px; line-height: 120%;">&nbsp;</p><p style="font-size: 14px; line-height: 120%;">Lawn mowing you can choose between recurring service or on-demand same day. Snow Plowing is strictly on-demand. Just open the APP or online a little bit in advance of when you need your driveway cleared.</p><p style="font-size: 14px; line-height: 120%;">&nbsp;</p><p style="font-size: 14px; line-height: 120%;"><span style="font-size: 16px; line-height: 19.2px;"><strong>You do not have to be home</strong></span></p><p style="font-size: 14px; line-height: 120%;">&nbsp;</p><p style="font-size: 14px; line-height: 120%;">Once our providers show up they will immediately begin work on your job. No knocking on doors.</p><p style="font-size: 14px; line-height: 120%;">&nbsp;</p><p style="font-size: 14px; line-height: 120%;"><span style="font-size: 16px; line-height: 19.2px;"><strong>Live alerts on every job</strong></span></p><p style="font-size: 14px; line-height: 120%;">&nbsp;</p><p style="font-size: 14px; line-height: 120%;">We will alert you when your contractor is on the way. Provider is at your location, has started job, has completed job, has completed job, All via push message directly to your phone. We will alert you when your contractor is on the way. Provider is at your location, has started job, has completed job, has completed job, All via push message directly to your phone. </p> </div> </td> </tr> </tbody></table> </div> </div></div> </div> </div></div><div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;"> <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"> <div style="width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:50px 10px 10px;font-family:arial,helvetica,sans-serif;" align="left"> <table width="100%" cellpadding="0" cellspacing="0" border="0"> <tr> <td style="padding-right: 0px;padding-left: 0px;" align="center"> <a href="Help Line Icon" target="_blank"> <img align="center" border="0" src="https://mowingandplowing.com/mowingplowing/template/user/image-3.png" alt="Icon" title="Icon" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 15%;max-width: 87px;" width="87" class="v-src-width v-src-max-width"/> </a> </td> </tr></table> </td> </tr> </tbody></table><table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:20px 50px 35px;font-family:arial,helvetica,sans-serif;" align="left"> <div style="color: #333333; line-height: 180%; text-align: center; word-wrap: break-word;"> <p style="line-height: 180%; font-size: 14px;"><span style="font-size: 18px; line-height: 32.4px; color: #3eabf7;"><strong>Contact Us</strong></span></p><p style="line-height: 180%; font-size: 14px;">Our community managers are here to answer any questions you may have and make sure you have a great experience. To get in touch please visit our live chat feature online or in your mowing and plowing app</p> </div> </td> </tr> </tbody></table></div> </div></div> </div> </div></div><div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #34495e;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;"> <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"> <div style="width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:27px 10px 30px;font-family:arial,helvetica,sans-serif;" align="left"> <div align="center"> <div style="display: table; max-width:103px;"> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 20px"> <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://facebook.com/mowingandplowingapp" title="Facebook" target="_blank"> <img src="https://mowingandplowing.com/mowingplowing/template/user/image-2.png" alt="Facebook" title="Facebook" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> </td></tr> </tbody></table> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 0px"> <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://instagram.com/mowingandplowing" title="Instagram" target="_blank"> <img src="https://mowingandplowing.com/mowingplowing/template/user/image-1.png" alt="Instagram" title="Instagram" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> </td></tr> </tbody></table> </div></div> </td> </tr> </tbody></table></div></div> </div> </div></div> </td> </tr> </tbody> </table> </body></html>`
          //     }
          //  //   return res.json("okk")
          //     const sendEmail = await transporter.sendMail(mailOption);
           
            // const mailOption={
            //     to:user.email,
            //     from:'project@cloudwapp.in',
            //     subject:'Welcome email',
            //     html:'<b>WELCOME USER</b></h4>' +
              
            //     '<br><br>' +
            //     '<p>--Teamclodwapp</p>'
            //   }
            //   const sendEmail = await transporter.sendMail(mailOption);
            // //return res.json(sendEmail)
             return res.json({status:true,data:{token:token,user_id:user.id,name:user.fristname+' '+user.lastname,image:user.image,is_verified:user.status,phone:user.mobile,role:user.role,is_blocked:user.is_blocked,
             lat:user.lat,
             lng:user.lng},
             message:"Login Successfully"})
             
                          
        }else{
                 
                   var reslt = await client.messages.create({ 
                      body: "Your OTP:"+otp+" for mowingandplowing signup user",
                      from: "+17075874531",
                      to: "+1"+user.mobile,
                   });
                     
             return res.json({status:true,data:{token:'',user_id:user.id,name:user.fristname+' '+user.lastname,image:user.image,is_verified:user.status,phone:user.mobile,role:user.role,is_blocked:user.is_blocked,lat:user.lat,lng:user.lng},message:"User not verified."})
        }
    
    }else{
        
       var checkdocument       =  await User_detail.findOne({where:{provider_id:user.id}});
       var bank_detail         =  await Bank_detail.findOne({where:{provider_id:user.id}}); 
       var provider_equipment  =  await Provider_equipment.findOne({where:{provider_id:user.id}});
       
       
        var working_status='';
        var order_table= await Order.findOne({where:{started_job:1,assigned_to:user.id,is_deleted:0,finished_job:0,status:2}, order:[['updatedAt','desc']]})
        if(order_table!=null)
         {
             var working_status=order_table.order_id;
         }
       
       
        
        if(user.status==1){
            
            // const mailOption={
               
            //     to:user.email,
            //     from:'project@cloudwapp.in',
            //     subject:'Welcome email',
            //     html:'<b>WELCOME USER</b></h4>' +
              
            //     '<br><br>' +
            //     '<p>--Teamclodwapp</p>'
            //   }
            //   // return res.json("okk")
            //   const sendEmail = await transporter.sendMail(mailOption);
            
            //   return res.json({sendEmail})///hhhhh
            
            const mailOption={
               
                to:user.email,
                from:`Mowing and Plowing"<hello@mowingandplowing.com>`,
                subject:'Welcome to Mowing And Plowing App',
                html:`<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta name="x-apple-disable-message-reformatting"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title></title> <style type="text/css"> table, td { color: #000000; } a { color: #0000ee; text-decoration: underline; } @media (max-width: 480px) { #u_content_image_8 .v-src-width { width: auto !important; } #u_content_image_8 .v-src-max-width { max-width: 40% !important; } #u_content_heading_6 .v-container-padding-padding { padding: 35px 10px 6px !important; } } @media only screen and (min-width: 620px) { .u-row { width: 600px !important; } .u-row .u-col { vertical-align: top; } .u-row .u-col-33p33 { width: 199.98px !important; } .u-row .u-col-100 { width: 600px !important; } } @media (max-width: 620px) { .u-row-container { max-width: 100% !important; padding-left: 0px !important; padding-right: 0px !important; } .u-row .u-col { min-width: 320px !important; max-width: 100% !important; display: block !important; } .u-row { width: calc(100% - 40px) !important; } .u-col { width: 100% !important; } .u-col > div { margin: 0 auto; } } body { margin: 0; padding: 0; } table, tr, td { vertical-align: top; border-collapse: collapse; } p { margin: 0; } .ie-container table, .mso-container table { table-layout: fixed; } * { line-height: inherit; } a[x-apple-data-detectors='true'] { color: inherit !important; text-decoration: none !important; } </style></head><body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #dde5e7;color: #000000"> <table style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #dde5e7;width:100%" cellpadding="0" cellspacing="0"> <tbody> <tr style="vertical-align: top"> <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;"> <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"> <div style="width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left"> <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <span>&#160;</span> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </div> </div> </div> </div> </div> </div> <div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;"> <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"> <div style="background-color: #17203a;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <table id="u_content_image_8" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:arial,helvetica,sans-serif;" align="left"> <table width="100%" cellpadding="0" cellspacing="0" border="0"> <tr> <td style="padding-right: 0px;padding-left: 0px;" align="center"> <a href="https://unlayer.com" target="_blank"> <img align="center" border="0" src="https://mowingandplowing.com/mowingplowing/template/provider/image-5.jpeg" alt="Logo" title="Logo" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 32%;max-width: 192px;" width="192" class="v-src-width v-src-max-width" /> </a> </td> </tr> </table> </td> </tr> </tbody> </table> </div> </div> </div> </div> </div> </div> <div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;"> <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"> <div style="width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <table id="u_content_heading_6" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:20px 10px 6px;font-family:arial,helvetica,sans-serif;" align="left"> <h1 style="margin: 0px; color: #17203a; line-height: 140%; text-align: center; word-wrap: break-word; font-weight: normal; font-family: tahoma,arial,helvetica,sans-serif; font-size: 32px;"> <strong>Welcome to Mowing and Plowing</strong> </h1> </td> </tr> </tbody> </table> <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left"> <div style="color: #3eabf7; line-height: 140%; text-align: center; word-wrap: break-word;"> <p style="font-size: 14px; line-height: 140%;"><span style="font-size: 24px; line-height: 33.6px;">The free lawn &amp; snow plowing marketplace for providers</span></p> </div> </td> </tr> </tbody> </table> </div> </div> </div> </div> </div> </div> <div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;"> <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"> <div style="background-color: #ffffff;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left"> <div align="center"> <a href="" target="_blank" style="box-sizing: border-box;display: inline-block;font-family:arial,helvetica,sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #17203a; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;"> <span style="display:block;padding:10px 40px;line-height:120%;"><span style="font-size: 20px; line-height: 24px;">Go to app</span></span> </a> </div> </td> </tr> </tbody> </table> </div> </div> </div> </div> </div> </div> <div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;"> <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"> <div style="background-color: #ffffff;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left"> <div style="line-height: 140%; text-align: left; word-wrap: break-word;"> <p style="font-size: 14px; line-height: 140%; text-align: center;">We are here to help you grow a new business, maintain an existing one,</p> <p style="font-size: 14px; line-height: 140%; text-align: center;">or just pick up some extra cash</p> </div> </td> </tr> </tbody> </table> </div> </div> </div> </div> </div> </div> <div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;"> <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"> <div style="width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:20px 10px 1px;font-family:arial,helvetica,sans-serif;" align="left"> <div style="color: #333333; line-height: 140%; text-align: center; word-wrap: break-word;"> <p style="font-size: 14px; line-height: 140%;"><strong><span style="font-size: 24px; line-height: 33.6px;">How Mowing and Plowing works</span></strong></p> </div> </td> </tr> </tbody> </table> </div> </div> </div> </div> </div> </div> <div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;"> <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"> <div style="background-color: #ffffff;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left"> <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="64%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 6px solid #3eabf7;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <span>&#160;</span> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </div> </div> </div> </div> </div> </div> <div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;"> <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"> <div style="background-color: #ffffff;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 22px;font-family:arial,helvetica,sans-serif;" align="left"> <table width="100%" cellpadding="0" cellspacing="0" border="0"> <tr> <td style="padding-right: 0px;padding-left: 0px;" align="center"> <img align="center" border="0" src="https://mowingandplowing.com/mowingplowing/template/provider/image-4.png" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 320px;" width="320" class="v-src-width v-src-max-width" /> </td> </tr> </table> </td> </tr> </tbody> </table> </div> </div> </div> </div> </div> </div> <div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;"> <div class="u-col u-col-33p33" style="max-width: 320px;min-width: 200px;display: table-cell;vertical-align: top;"> <div style="background-color: #ffffff;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left"> <div style="line-height: 140%; text-align: center; word-wrap: break-word;"> <p style="font-size: 14px; line-height: 140%;"><span style="font-size: 16px; line-height: 22.4px; color: #3eabf7;"><strong>Free Jobs</strong></span></p> <p style="font-size: 14px; line-height: 140%;">&nbsp;</p> <p style="font-size: 14px; line-height: 140%;">Pick up jobs daily based on price, Description and Location</p> <p style="font-size: 14px; line-height: 140%;">&nbsp;</p> </div> </td> </tr> </tbody> </table> </div> </div> </div> <div class="u-col u-col-33p33" style="max-width: 320px;min-width: 200px;display: table-cell;vertical-align: top;"> <div style="background-color: #ffffff;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left"> <div style="line-height: 140%; text-align: center; word-wrap: break-word;"> <p style="font-size: 14px; line-height: 140%;"><span style="color: #3eabf7; font-size: 14px; line-height: 19.6px;"><strong><span style="font-size: 16px; line-height: 22.4px;">No bids</span></strong> </span> </p> <p style="font-size: 14px; line-height: 140%;">&nbsp;</p> <p style="font-size: 14px; line-height: 140%;">All jobs are already priced and paid from customers so no having to worry about pay</p> <p style="font-size: 14px; line-height: 140%;">&nbsp;</p> </div> </td> </tr> </tbody> </table> </div> </div> </div> <div class="u-col u-col-33p33" style="max-width: 320px;min-width: 200px;display: table-cell;vertical-align: top;"> <div style="background-color: #ffffff;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left"> <div style="line-height: 140%; text-align: center; word-wrap: break-word;"> <p style="font-size: 14px; line-height: 140%;"><span style="color: #3eabf7; font-size: 14px; line-height: 19.6px;"><strong><span style="font-size: 16px; line-height: 22.4px;">Pay</span></strong> </span> </p> <p style="font-size: 14px; line-height: 140%;">&nbsp;</p> <p style="font-size: 14px; line-height: 140%;">All jobs are paid out from us daily may take 2-3 days for direct deposit to post to your account</p> </div> </td> </tr> </tbody> </table> </div> </div> </div> </div> </div> </div> <div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;"> <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"> <div style="background-color: #ffffff;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left"> <div align="center"> <a href="" target="_blank" style="box-sizing: border-box;display: inline-block;font-family:arial,helvetica,sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #17203a; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;"> <span style="display:block;padding:10px 40px;line-height:120%;"><span style="font-size: 20px; line-height: 24px;">Go to app</span></span> </a> </div> </td> </tr> </tbody> </table> </div> </div> </div> </div> </div> </div> <div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;"> <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"> <div style="width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:50px 10px 10px;font-family:arial,helvetica,sans-serif;" align="left"> <table width="100%" cellpadding="0" cellspacing="0" border="0"> <tr> <td style="padding-right: 0px;padding-left: 0px;" align="center"> <a href="Help Line Icon" target="_blank"> <img align="center" border="0" src="https://mowingandplowing.com/mowingplowing/template/provider/image-2.png" alt="Icon" title="Icon" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 15%;max-width: 87px;" width="87" class="v-src-width v-src-max-width" /> </a> </td> </tr> </table> </td> </tr> </tbody> </table> <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:20px 50px 35px;font-family:arial,helvetica,sans-serif;" align="left"> <div style="color: #333333; line-height: 180%; text-align: center; word-wrap: break-word;"> <p style="line-height: 180%; font-size: 14px;"><span style="font-size: 18px; line-height: 32.4px; color: #3eabf7;"><strong>Contact Us</strong></span></p> <p style="line-height: 180%; font-size: 14px;">Our community managers are here to answer any questions you may have and make sure you have a great experience. To get in touch please visit our live chat feature online or in your mowing and plowing app</p> </div> </td> </tr> </tbody> </table> </div> </div> </div> </div> </div> </div> <div class="u-row-container" style="padding: 0px;background-color: transparent"> <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #34495e;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;"> <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"> <div style="width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"> <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:27px 10px 30px;font-family:arial,helvetica,sans-serif;" align="left"> <div align="center"> <div style="display: table; max-width:103px;"> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 20px"> <tbody> <tr style="vertical-align: top"> <td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://facebook.com/mowingandplowingapp" title="Facebook" target="_blank"> <img src="https://mowingandplowing.com/mowingplowing/template/provider/image-1.png" alt="Facebook" title="Facebook" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> </td> </tr> </tbody> </table> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 0px"> <tbody> <tr style="vertical-align: top"> <td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://instagram.com/mowingandplowing" title="Instagram" target="_blank"> <img src="https://mowingandplowing.com/mowingplowing/template/provider/image-3.png" alt="Instagram" title="Instagram" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> </td> </tr> </tbody> </table> </div> </div> </td> </tr> </tbody> </table> </div> </div> </div> </div> </div> </div> </td> </tr> </tbody> </table> </body></html>`}
        //   return res.json("okk")
              const sendEmail = await transporter.sendMail(mailOption);
             return res.json({
                                 status:true,
                                 data:{
                                     token:token,
                                     user_id:user.id,
                                     name:user.fristname+' '+user.lastname,
                                     image:user.image,
                                     is_verified:user.status,
                                     phone:user.mobile,
                                     role:user.role,
                                     is_document_uploaded:(checkdocument) ? 1:0,
                                     is_basic_details_uploaded:(bank_detail && provider_equipment) ? 1:0,
                                     is_blocked:user.is_blocked,
                                     admin_approved:user.admin_approved,
                                     lat:(user.lat) ? user.lat : '' ,
                                     lng:(user.lng) ? user.lng : '' ,
                                     working_status : working_status,
                                     
                                 },
                                 message:"Login Successfully"})
        }else{
        //   return res.json(user)
                   var reslt = await client.messages.create({ 
                      body: "Your OTP:"+otp+" for mowingandplowing signup user",
                      from: "+17075874531",
                      to: "+1"+user.mobile,
                   });
                   
                    
             return res.json({
                                 status:true,
                                 data:{
                                     token:'',
                                     user_id:user.id,
                                     name:user.fristname+' '+user.lastname,
                                     image:user.image,
                                     is_verified:user.status,
                                     phone:user.mobile,
                                     role:user.role,
                                     is_document_uploaded:(checkdocument) ? 1:0,
                                     is_basic_details_uploaded:(bank_detail && provider_equipment) ? 1:0,
                                     is_blocked:user.is_blocked,
                                     admin_approved:user.admin_approved,
                                     lat:(user.lat) ? user.lat : '',
                                     lng:(user.lng) ? user.lng : '' 
                                     
                                 },
                                 message:"User not verified."})
        }
        
        
    }
    

  }catch{
    (err)=>{
      console.log(err)
      return res.json({status:false,message:"somthing is wrong"})
    }
  }
})




router.post("/resend-otp",async(req,res) =>{
    const {user_id} = req.body;
    var otp = Math.floor(100000 + Math.random() * 900000);
    
    try{
        const user = await User.findOne({where:{id:user_id,is_deleted:0}}) 
        if(!user) return res.json({status:false,message:'User not found'})
        if(user.is_blocked==1) return res.json({status:false,message:'User is blocked.'});
        user.otp = otp;
        user.save();
        
         var reslt = await client.messages.create({ 
                      body: "Your OTP:"+otp+" for mowingandplowing",
                      from: "+17075874531",
                      to: "+1"+user.mobile,
                   });
        
        return res.json({status:true,message:"Otp has sent to your number."});
    }catch(err){
        return res.json({status:false,message:"somthing is wrong"});
    }
});

//forget password phone sending
 router.post('/forget-password-mobile',async(req,res) =>{
   const {mobile} = req.body;
  
   if(!mobile) return res.json({status:false,message:"Enter your registered mobile number"})
    var otp = Math.floor(100000 + Math.random() * 900000);
   try{
    
     const user = await User.findOne({where:{mobile:mobile,status:1,is_blocked:0,is_deleted:0}});
     if(!user) return res.json({status:false,message:'Mobile number not match'});
       user.otp = otp;
       user.save();
     
         var reslt = await client.messages.create({ 
                      body: "Your OTP:"+otp+" for mowingandplowing",
                      from: "+17075874531",
                      to: "+1"+user.mobile,
                   });
     
    return res.json({status:true,data:{user_id:user.id},message:'user is valid'})
    // console.log(sendEmail)
   }catch(err){
    // console.log(err)
     return res.json({status:false,message:'Something is wrong try,again.'});
   }
 })
 
 
 
 
 
  //set new password
 router.post('/setpassword',async(req,res) =>{
     
  const {user_id,password} =req.body;//user_id 1 2
  
  if(!user_id) return res.json({status:false,message:"enter user_id"})
  if(!password) return res.json({status:false,message:"enter new password"})
  
  try{
      const user = await User.findOne({
       where:{id:user_id,status:1,is_blocked:0,is_deleted:0}
     });
      if(!user) return res.json({status:false,message:'Invalid Token or Token Expired'});
    const hash = bcrypt.hashSync(password, saltRounds);
    user.password = hash;
    // user.forget_password="";
    user.save();

     return res.json({status:true,message:'password has been changed successfully.'});
  }catch(err){
  console.log(err)
  return res.json({status:false,message:'Something is wrong try,again.'});
  }
});




// 
router.post('/get-category',async(req,res)=>{
    
    try{
    //   var category = await Category.findAll({
    //       where:{status:1,is_deleted:0},
    //       include:[{model:Subcategory,as:'subcategory'}]
    //   });
      
        var equipments = await Equipment.findAll({
               where:{status:1,is_deleted:0}
           });
      
      
      var commercial = [];
      var residential =[];
      
      var snow_removal =[];
      var both =[];
      
     
      for(var i=0; i<equipments.length; i++){
          
          
          
          
          if(equipments[i].type==0){
              snow_removal.push({
                  equipment_id:equipments[i].id,
                  image:equipments[i].image,
                  name:equipments[i].name,
                  category_id:equipments[i].category_id,
                  type:equipments[i].type,
                  
              });
          }
          
          if(equipments[i].type==1){
              commercial.push({
                  equipment_id:equipments[i].id,
                  image:equipments[i].image,
                  name:equipments[i].name,
                  category_id:equipments[i].category_id,
                  type:equipments[i].type,
                  
              });
          }
          
            if(equipments[i].type==2){
              residential.push({
                  equipment_id:equipments[i].id,
                  image:equipments[i].image,
                  name:equipments[i].name,
                  category_id:equipments[i].category_id,
                  type:equipments[i].type,
                  
              });
          }
          
         
      }
      
       both =[{"commercial_name":"Commercial","commercial":commercial},{"residential_name":"Residential",'residential':residential}];
      
      
      
      return res.json({status:true,data:{commercial_name:"Commercial",commercial,residential_name:"Residential",residential,snow_removal:"Snow removal",snow_removal,both},message:'Equipments list.'})
    }catch(err){
        console.log(err)
         return res.json({status:false,message:'Something is wrong try,again.'});
    }
});
 
 
 


router.post('/otp-verify',async(req,res) =>{
     const { user_id,otp } = req.body;
     
     if(!user_id) return res.json({status:false,message:'user id is required.'});
     if(!otp) return res.json({status:false,message:'otp is required.'});
     
    try{
        const user = await User.findOne({where:{id:user_id,is_blocked:0,is_deleted:0}});
        if(!user) return res.json({status:false,message:'user not found.'});
        
        if(user.otp!=otp) return res.json({status:false,message:'Invalid otp.'});
        
        user.status =1;
        user.otp    ="";
        user.save();
        
        const token = jwt.sign({user_id:user.id},"aabbcc")
        return res.json({status:true,data:{user_id:user.id,role:user.role,token},message:'otp verified successfully.'});
    }catch(err){
        console.log(err)
        return res.json({status:false,message:'something is wrong.'});
    }
});


router.post('/privacy-policy',async(req,res) =>{
    try{
        var privacy_policy = await Privacy_policy.findOne({});
        return res.json({status:true,data:{privacy_policy},message:'Privacy policy.'});
    }catch(err){
        return res.json({status:false,message:'something is wrong.'})
    }
});

//forget password email sending
//  router.post('/forget-password-mail',async(req,res) =>{
//   const {email} = req.body;
  
//   if(!email) return res.json({status:false,message:"Email is require"})
//   try{
    
//     //  return res.json(req.headers.host)
//     //   var token           = '';
//     //   var characters       = 'AssBCaaaD588666654EFGHIJ57855KLMNfsdfffWWWsd551441444WWgdgO1232514444414f4kdksf44ds5703PQRSTUVW7XYZabcd87686efghijklmnopqrstuvwxyz0123456789';
//     //   var charactersLength = characters.length;
//     //   for ( var i = 0; i < 40; i++ ) {
//     //     token += characters.charAt(Math.floor(Math.random() * charactersLength));
//     //   }
//      var code = Math.floor(Math.random() * 899999 + 100000)
//      const user = await User.findOne({where:{email:email}});
//     //  return res.json(user)
//      if(!user) return res.json({status:false,message:'Account not found.'});
//      user.otp =code;
//      user.save();
   
     
//      const mailOption={
//       to:email,
//       from:'project@cloudwapp.in',
//       subject:'Forget Password',
//       html:'<b>Reset Password</b></h4>' +
//       '<p>Code:'+code+'</p>' +
//       '<br><br>' +
//       '<p>--Teamclodwapp</p>'
//      }
//     const sendEmail = await transporter.sendMail(mailOption);
//     // return res.json(sendEmail)
//     return res.json({status:true,message:'OTP has been sent to your ' +email+' account.'})
//     console.log(sendEmail)
//   }catch(err){
//     console.log(err)
//      return res.json({status:false,message:'Something is wrong try,again.'});
//   }
//  })

// //Verify otp
//  router.post('/verify-otp',async(req,res) =>{
//      const {email, otp} = req.body;
//      try{
//         const user = await User.findOne({
//           where:{email,otp}
//         });
//         if(!user) return res.json({status:false,message:'Invalid OTP.'});
  
//         return res.json({status:true,data:{user_id:user.id},message:'OTP has matched'});
//      }catch(err){
//      console.log(err)
//      return res.json({status:false,message:'Something is wrong try,again.'});
//      }
//    });


//    //set new password
//  router.post('/setpassword',async(req,res) =>{
//   const {user_id,password} =req.body;
//   if(!user_id) return res.json({status:false,message:"enter user_id"})
//   if(!password) return res.json({status:false,message:"enter new password"})
//   try{
//      const user = await User.findOne({
//        where:{id:user_id}
//      });
//       if(!user) return res.json({status:false,message:'Invalid Token or Token Expired'});
//     const hash = bcrypt.hashSync(password, saltRounds);
//     user.password = hash;
//     // user.forget_password="";
//     user.save();

//      return res.json({status:true,message:'password has been changed successfully.'});
//   }catch(err){
//   console.log(err)
//   return res.json({status:false,message:'Something is wrong try,again.'});
//   }
// });
 
//  //add category
// router.get('/category',async(req, res)=> {

//   try{
//     var category = await Category.findAll();
//     return res.json({status:true,data:{category},'message':'category list'});
//   }catch(err){
//   return res.json({status:false,message:'something is wrong.'});
//   }
// });

// //home 
// router.get('/home',async(req, res)=> {
// try{
//   const now= moment().add(2, 'days').format("YYYY-MM-DD")
//    //console.log(now)
//     const product = await Product.findAll({where:{
//        expire: {
//           [Op.between]: [now+" 00:00:00", now+" 23:59:59"]
//                }}});
//   //console.log(product)
//     var category = await Category.findAll();
//     return res.json({status:true,data:{category,product},'message':'category list'});
//   }catch(err){
//     console.log(err)
//   return res.json({status:false,message:'something is wrong.'});
//   }
// });

// //my favourites
// router.get('/myfavourites',async(req, res)=> {

//   try{
//     var category = await Category.findAll();
//     return res.json({status:true,data:{category},'message':'category list'});
//   }catch(err){
//   return res.json({status:false,message:'something is wrong.'});
//   }
// });


// //sell
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // cb(null,'backend/public/documents/')
//    cb(null, path.join(__dirname,'../public/images'))
//     },
//   filename: function (req, file, cb) {
//     cb(null, Date.now()+'.png')
//   }
// })
// var upload = multer({ storage: storage })

// router.post('/sell',accessToken,upload.array('image', 4),async(req, res)=>{//yaha pr image key ka nam he

// const {name,description,price,expire,type,starting_bid,increasedby}=req.body

// if(!name) return res.json({status:false,message:"Name is required"})
// if(!price) return res.json({status:false,message:"Price is required"})
// if(!expire) return res.json({status:false,message:"Expire date is required"})
// if(!description) return res.json({status:false,message:"put a description "})
// if(!type) return res.json({status:false,message:"Type is required"})
// if(!starting_bid) return res.json({status:false,message:"Starting Bid is required"})
// if(!increasedby) return res.json({status:false,message:"Bid can be increased by ..."})

// //return res.json(req.files);
// try{
//   const product = await Product.create({ name,description,price,expire,type,starting_bid,increasedby})
//   //return res.json(req.files.length)
//   console.log(product)
//   for(var i=0; i<req.files.length; i++)
//             {
//               console.log("ok")
//               console.log(i)
//                await Product_image.create({image:req.files[i].filename,product_id:product.id});
//             }

//   //const image = await Product_image.create({image,product_id,status,is_deleted})
//  // user.document="/public/images/documents/"+req.file.filename;
//   return res.json({status:true,message:"data added successfully"})
  
//   }catch{
//   (err)=>{
//     console.log(err)
//     return res.json({status:false,message:"somthis is wrong"})
//   }
// }
// });



// router.get('/categories',async(req, res)=> {
//  try{
//     var category = await Category.findAll();
//     return res.json({status:true,data:{category},'message':'category list'});
//   }catch(err){
//   return res.json({status:false,message:'something is wrong.'});
//   }
// });

 
 router.get("/get-api",async(req,res) =>{
     try{
          var getadmin = await Admin.findOne();
        //   return res.json(getadmin)
          return res.json({status:true,data:{google_api_key:getadmin.google_api_key},message:"data"});
     }catch(err){
         return res.json({status:false,message:"Something is wrong."});
     }
 });


 router.post('/testemail',async(req,res)=>{  
 //ye test live server pr hi hoga
  try{

       const mailOption={ 
             
              to:"cwptest1@mailinator.com",
              from:'hello@mowingandplowing.com',
              subject:'Welcome email',
              html:`<h2>html code </h2>`
             }
              //return res.json("okk")
             const sendEmail = await transporter.sendMail(mailOption);
          
             return res.json(sendEmail)///hhhhh
  }catch(err)
  {
      return res.json(err)
  }
})


 module.exports = router;

 