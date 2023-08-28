var nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
        host:"cloudwapp.in",
        // port:465,
         secure:true,
    //   service: 'gmail',
      auth:{
          user:'project@cloudwapp.in',
          pass:'cloudwappsaif'
      }
});


module.exports = transporter;