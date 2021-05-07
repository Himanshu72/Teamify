var express = require('express');

var router = express.Router();
const env = require("../env");
const mongoose = require('mongoose');
const utility = require("../utility/DB");
const notify=require("../utility/notifications");
var validator = require('validator');
/* G  ET home page. */


function checkproj(req, res, next){
    req.session.user.projects.forEach((ele)=>{
          if(ele._id==req.params.projid){
            next();
          }
    });
    res.redirect(`/dashboard/${req.session.user._id }`);
}
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

router.get("/profile",checkuser,(req,res)=>{

  res.render('profile',{title:"profile",navbar:{user:true},data:req.session.user,err:false,msg:"",type:""});
});


router.get("/dashboard/:id",checkuser,(req,res)=>{
  let {projects}=req.session.user;
  if(req.params.id!=req.session.user._id)
        res.redirect(`/dashboard/${req.session.user._id}`);
  res.render('dashboard',{title:"dashboard",navbar:{user:true},err:false,msg:"",type:"error",data:projects});
 
});

router.get("/project/:projid",checkuser,checkproj,(req,res)=>{

  res.render('project',{title:"project",navbar:{user:true,projid:req.params.projid}});
});


router.get("/test",(req,res)=>{

  res.render('test',{title:"test",navbar:{user:false}});
});

router.get("/meeting/:projid",checkuser,checkproj,(req,res)=>{

  res.render('meeting',{title:"meeting",err:false,msg:"",type:"",navbar:{user:true,projid:req.params.projid}});
});

router.get("/accessControl/:projid",(req,res)=>{

  res.render('accessControl',{title:"accessControl",navbar:{user:true,projid:req.params.projid}});
});
router.get("/notification/:projid",(req,res)=>{

  res.render('notification',{title:"notification",navbar:{user:true,projid:req.params.projid}});
});
router.get("/manageTask/:projid",(req,res)=>{

  res.render('Manage_Task',{title:"manageTask",navbar:{user:true,projid:req.params.projid}});
});
router.get("/forgotPassword",(req,res)=>{
  
  res.render('forgotPassword',{title:"Forgot Password",navbar:{user:false},err:false,msg:"",type:"",mtitle:""  });
});

router.get("/videocall/:room",checkuser,(req,res)=>{
    res.render("videocall",{title:"videocall",navbar:{user:false}});
});

/*POST*/

router.post("/forgotpassword",(req,res)=>{
        if(validator.isEmail(req.body.email)){
          let flag=0; 
          utility.getAllusers().then((result)=>{
            
              result.forEach((element)=>{
                      if(element.email==req.body.email){
                          flag=1;
                          notify.sendEmail({
                            email:req.body.email,
                            subject:"Forgot password teamify",
                            text:`your password : ${element.password}`
                        }).then((result)=>{
                          res.render('forgotPassword',{title:"Forgot Password",navbar:{user:false},err:true,msg:"Email sent successfully",type:"success",mtitle:"Email Sent"  });
                        }).catch((err)=>{
                          res.render('forgotPassword',{title:"Forgot Password",navbar:{user:false},err:true,msg:"Unable to send email",type:"error",mtitle:"ERROR"  });
                        })
                      }
              });
                  if(!flag)
                  res.render('forgotPassword',{title:"Forgot Password",navbar:{user:false},err:true,msg:"Email not exists",type:"error",mtitle:"ERROR"  });
           
          }).catch(()=>{
            res.render('forgotPassword',{title:"Forgot Password",navbar:{user:false},err:true,msg:"Something Went Wrong",type:"error",mtitle:"ERROR"  });
          })
          
        }else{
          res.render('forgotPassword',{title:"Forgot Password",navbar:{user:false},err:true,msg:"Email not valid",type:"error",mtitle:"ERROR"  });
        }
});


 router.post("/createProject",checkuser,(req,res)=>{
 
      
      if(validator.isLength(req.body.name,{min:5,max:20})
        &&
        validator.isLength(req.body.description,{min:20,max:200})){
          req.body.owner=req.session.user._id;      
      utility.pushProject(req.session.user._id,req.body).then((result)=>{
        req.session.user=result;
        
        utility.insertProject({_id:result.projects[result.projects.length -1]._id }).then(()=>{
          res.redirect(`/dashboard/${req.session.user._id}`);
        }).catch(()=>{
          res.render('dashboard',{title:"dashboard",navbar:{user:true},err:true,msg:"Unable to create Project",type:"error",data:projects})
        })
        
      }).catch(()=>{
        let {projects}=req.session.user;
        res.render('dashboard',{title:"dashboard",navbar:{user:true},err:true,msg:"Unable to create Project",type:"error",data:projects});
      })

      }else{
        res.render('dashboard',{title:"dashboard",navbar:{user:true},err:true,msg:"Validation failed",type:"error",data:projects});

      }

        

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

router.post("/changepassword",checkuser,(req,res)=>{
      if(validator.equals(req.body.n_password,req.body.c_password)){
          utility.updatePassword(req.session.user._id,req.body.c_password).then((result)=>{
            console.log(result);
            if(result.nModified==1){
              req.session.user.password=req.body.c_password;
              res.redirect("/profile");
            }
              else  
              res.render('profile',{title:"profile",navbar:{user:true},data:req.session.user,err:true,msg:"Something Went wrong",type:"error"});  
          }).catch(()=>{
            res.render('profile',{title:"profile",navbar:{user:true},data:req.session.user,err:true,msg:"Something Went wrong",type:"error"});
          })
      }else{
        res.render('profile',{title:"profile",navbar:{user:true},data:req.session.user,err:true,msg:"Password and confirm password must be same..",type:"error"});
      }
});

router.post("/profile",checkuser,(req,res)=>{
  console.log(req.body);
  
  if(validator.isLength(req.body.fname, {min:3,max:15}) &&
  validator.isLength(req.body.lname, {min:3,max:20}) &&
  validator.isLength(req.body.phone, {min:10,max:12}) && ( validator.equals(req.body.gender,"male") || validator.equals(req.body.gender,"female"))  ){
    let obj={};
    obj.name={
           fname:req.body.fname,
           lname:req.body.lname
    }
    obj.gender=req.body.gender;
    obj.DOB=req.body.DOB;
    if(req.body.phone!= req.session.user.phone )
        obj.phone=req.body.phone;

    utility.updateProfile(req.session.user._id,obj).then((result)=>{
       req.session.user=result;
       res.redirect("/profile")
    }).catch((err)=>{
      res.render('profile',{title:"profile",navbar:{user:true},data:req.session.user,err:true,msg:"unable to update profile",type:"error"}); 
      console.log(err);
    })

  }else{
    res.render('profile',{title:"profile",navbar:{user:true},data:req.session.user,err:true,msg:"validation failed in profile",type:"error"});
  }
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
