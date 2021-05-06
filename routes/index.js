var express = require('express');
var router = express.Router();
const env = require("../env");
const mongoose = require('mongoose');
const utility = require("../utility/DB");
const notify=require("../utility/notifications");
var validator = require('validator');
/* G  ET home page. */

router.get('/', async function (req, res, next) {

  res.render('index',{title:"Home"});
});

router.get("/login",(req,res)=>{

    res.render('login',{title:"login",err:false,msg:"",type:""});
  
 
});

router.get("/signup",(req,res)=>{

  res.render('signup',{title:"signup" ,err:false,msg:"",type:""});
});

router.get("/profile",(req,res)=>{

  res.render('profile',{title:"profile"});
});


router.get("/dashboard",(req,res)=>{

  res.render('dashboard',{title:"dashboard"});
});

router.get("/project",(req,res)=>{

  res.render('project',{title:"project"});
});


router.get("/test",(req,res)=>{

  res.render('test',{title:"test"});
});

router.get("/meeting",(req,res)=>{

  res.render('meeting',{title:"meeting",err:false,msg:"",type:""});
});

router.get("/accessControl",(req,res)=>{

  res.render('accessControl',{title:"accessControl"});
});
router.get("/notification",(req,res)=>{

  res.render('notification',{title:"notification"});
});
router.get("/manageTask",(req,res)=>{

  res.render('Manage_Task',{title:"manageTask"});
});



/*POST*/
router.post("/signup",async (req,res)=>{
/*
username: 'admin',
  fname: 'Himanshu',
  lname: 'Joshi',
  phone: '647895145',
  DOB: '2021-05-20',
  gender: 'male',
  email: 'hjoshi111@gmail.com',
  password: '123',
  confirm_password: '123',
  name: { fname: 'Himanshu', lname: 'Joshi' },
  _id: 'admin'

*/
console.log(req.body);
if(
  validator.isEmail(req.body.email) &&
  validator.isLength(req.body.username, {min:3,max:15}) &&
  validator.isLength(req.body.fname, {min:3,max:15}) &&
  validator.isLength(req.body.lname, {min:3,max:20}) &&
  validator.isLength(req.body.phone, {min:10,max:12})&&
  validator.isLength(req.body.password, {min:8,max:20}) &&
  validator.equals(req.body.confirm_password,req.body.password) 
){
 

 req.body.name={ fname:req.body.fname,lname:req.body.lname };
 req.body._id=req.body.username;

await utility.insertUser(req.body);
console.log(resum)
    res.redirect("/login");
  
   
     
 
//  else{
//   res.render('signup',{title:"signup",err:true,msg:"Something went wrong...",type:"error"})
//  }

}
else{
     res.render('signup',{title:"signup",err:true,msg:"Validation failed",type:"error"});

}

});


router.post("/login",(req,res)=>{
  if( validator.isEmail(req.body.email)){
    res.render('dashboard',{title:"dashboard"});
  }
  else{
    res.render('login',{title:"login",err:true,msg:"login failed",type:"error"});
  }
  console.log(req.body);
  //req.body._id=req.body.username;
  //utility.insertUser(req.body);
  //res.redirect("/dashboard");
});


router.post("/dashboard",(req,res)=>{
  
  req.body.projects={ name:req.body.name,description:req.body.description };
  console.log(req.body);
  //req.body._id=req.body.username;
  //utility.insertUser(req.body);
  res.redirect("/dashboard");
});



router.post("/meeting",(req,res)=>{
  if(validator.isLength(req.body.name, {min:3,max:15}) && validator.isLength(req.body.meetPassword, {min:5,max:15}) ){
    
    console.log(req.body);
    res.redirect("/project");
  }
  //req.body.minutesOfMeeting={ name:req.body.name,description:req.body.description, date:req.body.date , author:req.body.author};

 else{
  res.render('meeting',{title:"meeting",err:true,msg:"Failed to create meet link",type:"error"});
 }
 // req.body._id=req.body.username;
//  utility.insertMeet(req.body);
  
});



router.post("/manageTask",(req,res)=>{
  
 // req.body.projects={ name:req.body.name,description:req.body.description };
  console.log(req.body);
  //req.body._id=req.body.username;
  //utility.insertUser(req.body);
  res.redirect("/manageTask");
});
module.exports = router;
