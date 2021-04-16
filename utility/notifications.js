const nodemailer = require("nodemailer");
const env=require("../env")
const  transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    service: 'Gmail',
    auth: {
      user: env.email, 
      pass: env.pass 
    }
  });

  module.exports={
        sendEmail:(data)=>{
            const mailOptions = {
                from: env.email,
                to: data.email,
                subject: data.subject,
                text: data.text
              };

              transport.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
              
        },
        sendOtp:(data)=>{

        }

}