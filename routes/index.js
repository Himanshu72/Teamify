var express = require('express');

var router = express.Router();
const env = require("../env");
const mongoose = require('mongoose');
const utility = require("../utility/DB");
const notify=require("../utility/notifications");
var validator = require('validator');
/* G  ET home page. */



function checkuser(req, res, next) {
 if(!req.session.user){
  res.render('login',{title:"login",err:false,msg:"",type:"",navbar:{user:false}});
 }else
       next();
  
}

router.get('/',async function (req, res, next) {
 if(req.session.user)
 {
  res.redirect(`/dashboard/${req.session.user._id}`);
 }else{
  res.render('index',{title:"Home",navbar:{user:false}});
 }
});

router.get('/logout', async function (req, res, next) {
  req.session.destroy();
  res.redirect("/login");

});

router.get("/login",(req,res)=>{
   
  if(req.session.user)
       res.redirect(`/dashboard/${req.session.user._id}`);
  else
    res.render('login',{title:"login",err:false,msg:"",type:"",navbar:{user:false}});
  
 
});

router.get("/signup",async(req,res)=>{
 
  res.render('signup',{title:"signup" ,err:false,msg:"",type:"",navbar:{user:false}});
});

router.get("/profile",(req,res)=>{

  res.render('profile',{title:"profile",navbar:{}});
});


router.get("/dashboard/:id",checkuser,(req,res)=>{
  let {projects}=req.session.user;
  if(req.params.id!=req.session.user._id)
        res.redirect(`/dashboard/${req.session.user._id}`);
  res.render('dashboard',{title:"dashboard",navbar:{user:true},err:false,msg:"",type:"error",data:projects});
 
});

router.get("/project/:projid",(req,res)=>{

  res.render('project',{title:"project",navbar:{user:true}});
});


router.get("/test",(req,res)=>{

  res.render('test',{title:"test",navbar:{user:false}});
});

router.get("/meeting",(req,res)=>{

  res.render('meeting',{title:"meeting",err:false,msg:"",type:"",navbar:{user:true}});
});

router.get("/accessControl",(req,res)=>{

  res.render('accessControl',{title:"accessControl",navbar:{user:true}});
});
router.get("/notification",(req,res)=>{

  res.render('notification',{title:"notification",navbar:{user:true}});
});
router.get("/manageTask",(req,res)=>{

  res.render('Manage_Task',{title:"manageTask",navbar:{user:true}});
});



/*POST*/
 router.post("/createProject",checkuser,(req,res)=>{
 
      // tanya do validation here
        req.body.owner=req.session.user._id;      
      utility.pushProject(req.session.user._id,req.body).then((result)=>{
        req.session.user=result;
        res.redirect(`/dashboard/${req.session.user._id}`);
      }).catch(()=>{
        let {projects}=req.session.user;
        res.render('dashboard',{title:"dashboard",navbar:{user:true},err:true,msg:"Unable to create Project",type:"error",data:projects});
      })

 });

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
  res.render('signup',{title:"signup",err:true,msg:"Something went wrong...",type:"error",navbar:{user:false}})
 })

 

}
else{
     res.render('signup',{title:"signup",err:true,msg:"Validation failed",type:"error",navbar:{user:false}});
}

});


router.post("/login",(req,res)=>{
  
  
  if( validator.isLength(req.body.username,{min:3,max:15}) && validator.isLength(req.body.password,{min:8,max:20}) ){
   
    utility.finduserByusername(req.body.username).then((result)=>{
      if(validator.equals(req.body.password,result.password)){  
        req.session.user=result;
        res.redirect(`/dashboard/${req.body.username}`);
       
      }else{
        res.render('login',{title:"login",err:true,msg:"Invalid password",type:"error",navbar:{user:false}});
      }
    }).catch(()=>{
      res.render('login',{title:"login",err:true,msg:"Invalid username or password",type:"error",navbar:{user:false}});  
    });
    
  }
  else{

    res.render('login',{title:"login",err:true,msg:"Email or Password validation failed",type:"error",navbar:{user:false}});
  }
  console.log(req.body);
  //req.body._id=req.body.username;
  //utility.insertUser(req.body);
  //res.redirect("/dashboard");
});






router.post("/meeting",(req,res)=>{
  if(validator.isLength(req.body.name, {min:3,max:15}) && validator.isLength(req.body.meetPassword, {min:5,max:15}) ){
    
    console.log(req.body);
    res.redirect("/project/1");
  }
  //req.body.minutesOfMeeting={ name:req.body.name,description:req.body.description, date:req.body.date , author:req.body.author};

 else{
  res.render('meeting',{title:"meeting",err:true,msg:"Failed to create meet link",type:"error",navbar:{user:true}});
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
