var express = require('express');
var router = express.Router();
const env = require("../env");
const mongoose = require('mongoose');
const utility = require("../utility/DB");
const notify=require("../utility/notifications");
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

  console.log(req.body);
  req.body.name={ fname:req.body.fname,lname:req.body.lname };
  req.body._id=req.body.username;
  utility.insertUser(req.body);
  res.redirect("/login");
});


router.post("/login",(req,res)=>{
  console.log(req.body);
  //req.body._id=req.body.username;
  //utility.insertUser(req.body);
  res.redirect("/dashboard");
});

router.post("/meeting",(req,res)=>{

  console.log(req.body);
 
 // req.body._id=req.body.username;
//  utility.insertMeet(req.body);
  res.redirect("/project");
});

module.exports = router;
