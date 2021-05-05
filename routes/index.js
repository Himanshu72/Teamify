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

  res.render('login',{title:"login"});
});

router.get("/signup",(req,res)=>{

  res.render('signup',{title:"signup"});
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

  res.render('meeting',{title:"meeting"});
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
router.post("/signup",(req,res)=>{
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
  validator.isEmail('req.body.email'); 
  let a=validator.isLength('req.body.username', 2,5); 
  console.log(a);

  req.body.name={ fname:req.body.fname,lname:req.body.lname };
 req.body._id=req.body.username;

 console.log(req.body);
 //char limite 
 //pass=cpass
 //utility.insertUser(req.body);
  res.redirect("/login");
});


router.post("/login",(req,res)=>{
  console.log(req.body);
  //req.body._id=req.body.username;
  //utility.insertUser(req.body);
  res.redirect("/dashboard");
});
router.post("/dashboard",(req,res)=>{
  
  req.body.projects={ name:req.body.name,description:req.body.description };
  console.log(req.body);
  //req.body._id=req.body.username;
  //utility.insertUser(req.body);
  res.redirect("/dashboard");
});

router.post("/meeting",(req,res)=>{

 
 
  req.body.minutesOfMeeting={ name:req.body.name,description:req.body.description, date:req.body.date , author:req.body.author};

  console.log(req.body);
 // req.body._id=req.body.username;
//  utility.insertMeet(req.body);
  res.redirect("/project");
});

router.post("/manageTask",(req,res)=>{
  
 // req.body.projects={ name:req.body.name,description:req.body.description };
  console.log(req.body);
  //req.body._id=req.body.username;
  //utility.insertUser(req.body);
  res.redirect("/manageTask");
});
module.exports = router;
