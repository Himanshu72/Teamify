var express = require('express');

var router = express.Router();
const env = require("../env");
const mongoose = require('mongoose');
const utility = require("../utility/DB");
const notify=require("../utility/notifications");
var validator = require('validator');
/* G  ET home page. */

function requiredAuthentication(req, res, next) {
 if(!req.session.user)
  res.render('login',{title:"login",err:false,msg:"",type:""});
  else
       next();
  
}

router.get('/', async function (req, res, next) {
 
  res.render('index',{title:"Home"});

});

router.get("/login",(req,res)=>{
   
  if(req.session.user)
       res.redirect(`/dashboard/${req.session.user._id}`);
  else
    res.render('login',{title:"login",err:false,msg:"",type:""});
  
 
});

router.get("/signup",async(req,res)=>{
 
  res.render('signup',{title:"signup" ,err:false,msg:"",type:""});
});

router.get("/profile",(req,res)=>{

  res.render('profile',{title:"profile"});
});


router.get("/dashboard/:id",(req,res)=>{

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

  
 utility.insertUser(req.body).then(()=>{
  res.redirect("/login");
 }).catch(()=>{
  res.render('signup',{title:"signup",err:true,msg:"Something went wrong...",type:"error"})
 })

 

}
else{
     res.render('signup',{title:"signup",err:true,msg:"Validation failed",type:"error"});

}

});


router.post("/login",(req,res)=>{
  
  
  if( validator.isLength(req.body.username,{min:3,max:15}) && validator.isLength(req.body.password,{min:8,max:20}) ){
   
    utility.finduserByusername(req.body.username).then((result)=>{
      if(validator.equals(req.body.password,result.password)){  
        req.session.user=result;
        res.redirect(`/dashboard/${req.body.username}`);
       
      }else{
        res.render('login',{title:"login",err:true,msg:"Invalid password",type:"error"});
      }
    }).catch(()=>{
      res.render('login',{title:"login",err:true,msg:"Invalid username or password",type:"error"});  
    });
    
  }
  else{

    res.render('login',{title:"login",err:true,msg:"Email or Password validation failed",type:"error"});
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
