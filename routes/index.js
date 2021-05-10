var express = require('express');

var router = express.Router();
const env = require("../env");
const mongoose = require('mongoose');
const utility = require("../utility/DB");
const notify = require("../utility/notifications");
var validator = require('validator');
const { pushProject, getProjectById, insertMeet, addMeet, getAllusers } = require('../utility/DB');
const task = require('../schema/tashSchema');

//for testing only
router.get("/test", (req, res) => {

  res.render('test', { title: "test", navbar: { user: false } });
});

async function getproj(req, res, next) {
  if (req.session.proj) //project exists in session
  {
    next(); //continue
  }
  else {
    try //find the project from database
    {
      req.session.proj = await utility.getProjectById(req.params.projid);
      next();
    }
    catch //throw error
    {
      req.session.proj = undefined;
      next();
    }
  }
}


function checkproj(req, res, next) {
  req.session.user.projects.forEach((ele) => {
    if (ele._id == req.params.projid) {
      next();
    }
  });
  res.redirect(`/dashboard/${req.session.user._id}`);
}
function checkuser(req, res, next) {
  if (!req.session.user) //if not logged then redirect to login page , i.e going to the page directly from url
  {
    res.render('login', { title: "login", err: false, msg: "", type: "", navbar: { user: false } });
  }
  else //continue
  {
    next();
  }


}

/* GET home page. */
router.get('/', async function (req, res, next) {
  if (req.session.user)//if logged in
  {
    res.redirect(`/dashboard/${req.session.user._id}`);
  }
  else//not logged in
  {
    res.render('index', { title: "Home", navbar: { user: false } });
  }
});


/*For logging out*/
router.get('/logout', async function (req, res, next) {
  req.session.destroy();
  res.redirect("/login");

});


/*For logging in*/
router.get("/login", async (req, res) => {

  if (req.session.user) //if user is logged in then redirect to dashboard page
    res.redirect(`/dashboard/${req.session.user._id}`);

  else  //else redirect to login page
    res.render('login', { title: "login", err: false, msg: "", type: "", navbar: { user: false } });
});


/*For signing up */
router.get("/signup", async (req, res) => {

  res.render('signup', { title: "signup", err: false, msg: "", type: "", navbar: { user: false } });
});


/* Going to profile page for editing the profile */
router.get("/profile", checkuser, (req, res) => {

  res.render('profile', { title: "profile", navbar: { user: true }, data: req.session.user, err: false, msg: "", type: "" });
});


/*Going to Dashboard */
router.get("/dashboard/:id", checkuser, (req, res) => {
  let { projects } = req.session.user;
  if (req.params.id != req.session.user._id)
    res.redirect(`/dashboard/${req.session.user._id}`);
  res.render('dashboard', { title: "dashboard", navbar: { user: true }, err: false, msg: "", type: "", data: projects });

});


/*Going to Project page */
router.get("/project/:projid",checkuser,async (req,res)=>{
 
 try{ 

    
   
   req.session.proj=await getProjectById(req.params.projid);
   //console.log(req.session.proj);
  let owner;
       req.session.user.projects.every((ele)=>{
               if(ele._id==req.params.projid)
                  {
                    owner=ele.owner;
                    return false;

                  } else{
                     return true;
                  } 
       });
   let groups=await utility.getMygroups(req.session.proj.group,req.session.user._id,owner);
   req.session.groups=groups; 
   //console.log(groups);
     req.session.access = utility.access(req.session.user._id,owner,groups);
     console.log(req.session.access);
  res.render('project',{title:"project",data:{ proj:req.session.proj,groups:groups },err:false,mtitle:"",msg:"",type:"",navbar:{user:true,projid:req.params.projid,access:req.session.access}});
 } 
 catch(err){
    console.log(err);
    res.redirect(`/dashboard/${req.session.user._id}`);
  }
});



/*Going to Meeting page */
router.get("/meeting/:projid", checkuser,async (req, res) => {
  let result;

  let members=[];
  let meets;
  try{     

    console.log(req.params.projid);
    req.session.proj=await getProjectById(req.params.projid);
    
    meets = await utility.getMeetByids(req.session.proj.meets);
    result=await utility.getGroupsByids(req.session.proj.group);
   console.log("here==>",meets)
   result.forEach(ele=>{

    if(members.indexOf(ele.leader) === -1) 
          members.push(ele.leader);
     ele.member.forEach(name=>{
      if(members.indexOf(name) === -1) 
             members.push(name);
     });
        
   });
   console.log(req.query);
   if(req.query.err)
          throw 1;
   if(req.query.scc) 
   res.render('meeting',{data:{members:members,meets:meets},title:"meeting",mtitle:"GREAT!",err:true,msg:"Meet created",type:"success",navbar:{user:true,projid:req.params.projid,access:req.session.access}});      
   //console.log(members)
  res.render('meeting',{data:{members:members,meets:meets},title:"meeting",mtitle:"",err:false,msg:"",type:"",navbar:{user:true,projid:req.params.projid,access:req.session.access}});
  }catch(err){
    console.log(err);
    res.render('meeting',{data:{members:members,meets:meets},title:"meeting",mtitle:"ERROR",err:true,msg:"Something Went Wrong",type:"error",navbar:{user:true,projid:req.params.projid,access:req.session.access}});
  } 
});



/*Going to Access Control page */
router.get("/accessControl/:projid", checkuser, getproj, async (req, res) => {
  let result;
  try {
    result = await utility.getGroupsByids(req.session.proj.group);
  }
  catch (err) {
    console.log(err);  //what? 
  }
        
  res.render('accessControl',{title:"accessControl",data:result,err:false,msg:"",type:"",mtitle:"" ,navbar:{user:true,projid:req.params.projid,access:req.session.access}});
});


/*Going to Notification page */
router.get("/notification/:projid",checkuser, async (req, res) => {
  let tasks;
  let notify;
  try{
     tasks=await utility.getTasksBygroup(req.session.groups)
     notify=await utility.getNotifiByIds(req.session.proj.notifications);
     console.log(notify);
   let err=true,type,mtitle,msg;
     switch(req.query.code){
        case "0":
              throw 0;
              
        case "1":
            mtitle="Great!"
            type="success"
            msg="Message Sent sucessfully"
             break; 
        case "2":
          mtitle="ERROR!"
          type="error"
          msg="Invalid Username"
          break     
        default:
            err=false;

      }
      res.render('notification',{data:{tasks:tasks,notify:notify,cur:req.session.user._id},title:"notification",err:err,msg:msg,type:type,mtitle:mtitle  ,navbar:{user:true,projid:req.params.projid,access:req.session.access}});
  }catch(err){
    console.log(err);
    res.render('notification',{data:{tasks:tasks,notify:notify,cur:req.session.user._id},title:"notification",err:true ,msg:"Something went wrong",type:"error",mtitle:"ERROR",navbar:{user:true,projid:req.params.projid,access:req.session.access}});
  }
});


/*Going to Manage Task page */
router.get("/manageTask/:projid",checkuser ,async (req, res) => {
try{
  let tasks=await utility.getTasksBygroup(req.session.groups)
  
  result = await utility.getGroupsByids(req.session.proj.group);
  res.render('Manage_Task',{ data:{groups:result,tasks:tasks},title:"manageTask",err:false,msg:"",type:"",mtitle:"" ,navbar:{user:true,projid:req.params.projid,access:req.session.access}});
}catch(err){
  console.log(err);
  res.render('Manage_Task',{data:undefined,task:undefined,title:"manageTask",err:true,msg:"Something went wrong",type:"error",mtitle:"ERROR" ,navbar:{user:true,projid:req.params.projid,access:req.session.access}});
}
});


/*Going to Forgot Password page */
router.get("/forgotPassword", (req, res) => {

  res.render('forgotPassword', { title: "Forgot Password", navbar: { user: false }, err: false, msg: "", type: "", mtitle: "" });
});



/*Going to Access Control page */
router.get("/videocall/:room",checkuser, (req, res) => {
  res.render("videocall", { title: "videocall",room:req.params.room, navbar: { user: false } });
});




/*POST*/

router.post("/forgotpassword", (req, res) => {
  if (validator.isEmail(req.body.email)) {
    let flag = 0;
    utility.getAllusers().then((result) => {

      result.forEach((element) => {
        if (element.email == req.body.email) {
          flag = 1;
          notify.sendEmail({
            email: req.body.email,
            subject: "Forgot password teamify",
            text: `your password : ${element.password}`
          }).then((result) => {
            res.render('forgotPassword', { title: "Forgot Password", navbar: { user: false }, err: true, msg: "Email sent successfully", type: "success", mtitle: "Email Sent" });
          }).catch((err) => {
            res.render('forgotPassword', { title: "Forgot Password", navbar: { user: false }, err: true, msg: "Unable to send email", type: "error", mtitle: "ERROR" });
          })
        }
      });
      if (!flag)
        res.render('forgotPassword', { title: "Forgot Password", navbar: { user: false }, err: true, msg: "Email not exists", type: "error", mtitle: "ERROR" });

    }).catch(() => {
      res.render('forgotPassword', { title: "Forgot Password", navbar: { user: false }, err: true, msg: "Something Went Wrong", type: "error", mtitle: "ERROR" });
    })

  } else {
    res.render('forgotPassword', { title: "Forgot Password", navbar: { user: false }, err: true, msg: "Email not valid", type: "error", mtitle: "ERROR" });
  }
});

router.post("/announcement/:projid",checkuser,getproj,async (req,res)=>{
          if( validator.isLength(req.body.announcement,{min:15,max:150}) ){
            try{
            let result= await utility.updateAnnounce(req.params.projid,req.body.announcement);
               // console.log("date==>",result);  
                req.session.proj=await utility.getProjectById(req.params.projid) ;
                let owner;
             req.session.user.projects.every((ele)=>{
               if(ele._id==req.params.projid)
                  {
                    owner=ele.owner;
                    return false;

                  } else{
                     return true;
                  } 
       });
   let groups=await utility.getMygroups(req.session.proj.group,req.session.user._id,owner); 

                res.render( 'project',{data:{proj:req.session.proj,groups:req.session.groups} ,title:"project",err:true,mtitle:"Great",msg:"Announcement updated",type:"success",data:{proj:req.session.proj,groups:groups},navbar:{user:true,projid:req.params.projid,access:req.session.access}});
            }catch(err){
              console.log(err);
              res.render( 'project',{data:{proj:req.session.proj,groups:req.session.groups} ,title:"project",err:true,mtitle:"ERROR",msg:"Something went wrong",type:"error",data:{proj:req.session.proj},navbar:{user:true,projid:req.params.projid,access:req.session.access}});
            }
                //res.render('project',{title:"project",err:false,mtitle:"",msg:"",type:"",data:"",navbar:{user:true,projid:req.params.projid}});
          }else{
            res.render('project',{title:"project", data:{proj:req.session.proj,groups:req.session.groups},err:true,mtitle:"ERROR",msg:"validation failed",type:"error",navbar:{user:true,projid:req.params.projid,access:req.session.access}});
          }
});

router.post("/createProject", checkuser, (req, res) => {

  let { projects } = req.session.user;
  if (validator.isLength(req.body.name, { min: 5, max: 20 })
    &&
    validator.isLength(req.body.description, { min: 20, max: 200 })) {
    req.body.owner = req.session.user._id;
    utility.pushProject(req.session.user._id, req.body).then((result) => {
      req.session.user = result;
      console.log(result.projects[result.projects.length - 1]._id)
      utility.insertProject({ _id: result.projects[result.projects.length - 1]._id }).then(() => {
        res.redirect(`/dashboard/${req.session.user._id}`);

      }).catch((err) => {
        console.log(err);
        console.log(err);
        res.render('dashboard', { title: "dashboard", navbar: { user: true }, err: true, msg: "Unable to create Project", type: "error", data: projects })
      })

    }).catch(() => {
      let { projects } = req.session.user;
      res.render('dashboard', { title: "dashboard", navbar: { user: true }, err: true, msg: "Something went wrong, try agin", type: "error", data: projects });
    })

  }
  else {
    let { projects } = req.session.user;
    res.render('dashboard', { title: "dashboard", navbar: { user: true }, err: true, msg: "Validation failed", type: "error", data: projects });

  }



});

router.post("/signup", async (req, res) => {

  if (validator.isEmail(req.body.email) &&
    validator.isLength(req.body.username, { min: 3, max: 15 }) &&
    validator.isLength(req.body.fname, { min: 3, max: 15 }) &&
    validator.isLength(req.body.lname, { min: 3, max: 20 }) &&
    validator.isLength(req.body.phone, { min: 10, max: 12 }) &&
    validator.isLength(req.body.password, { min: 8, max: 20 }) &&
    validator.equals(req.body.confirm_password, req.body.password)) {
    req.body.name = { fname: req.body.fname, lname: req.body.lname };
    req.body._id = req.body.username;
    utility.insertUser(req.body).then(() => {
      res.redirect("/login");
    }).catch(() => {
      res.render('signup', { title: "signup", err: true, msg: "Something went wrong...", type: "error", navbar: { user: false } })
    })

  }
  else {
    res.render('signup', { title: "signup", err: true, msg: "Validation failed", type: "error", navbar: { user: false } });
  }

});


router.post("/login", (req, res) => {

  if (validator.isLength(req.body.username, { min: 3, max: 15 }) && validator.isLength(req.body.password, { min: 8, max: 20 })) {
    utility.finduserByusername(req.body.username).then((result) => {
      if (validator.equals(req.body.password, result.password)) {
        req.session.user = result;
        res.redirect(`/dashboard/${req.body.username}`);
      }
      else {
        res.render('login', { title: "login", err: true, msg: "Invalid password", type: "error", navbar: { user: false } });
      }
    }).catch(() => {
      res.render('login', { title: "login", err: true, msg: "Invalid username or password", type: "error", navbar: { user: false } });
    });

  }
  else {
    res.render('login', { title: "login", err: true, msg: "Email or Password validation failed", type: "error", navbar: { user: false } });
  }
  // console.log(req.body);

});

router.post("/changepassword", checkuser, (req, res) => {
  if (validator.equals(req.body.n_password, req.body.c_password)) {
    utility.updatePassword(req.session.user._id, req.body.c_password).then((result) => {
      console.log(result); //what?
      if (result.nModified == 1) {
        req.session.user.password = req.body.c_password;
        res.redirect("/profile");
      }
      else
        res.render('profile', { title: "profile", navbar: { user: true }, data: req.session.user, err: true, msg: "Something Went wrong,try again", type: "error" });
    }).catch(() => {
      res.render('profile', { title: "profile", navbar: { user: true }, data: req.session.user, err: true, msg: "Something Went wrong,try later", type: "error" });
    })
  }
  else {
    res.render('profile', { title: "profile", navbar: { user: true }, data: req.session.user, err: true, msg: "New password and confirm password aren't same..", type: "error" });
  }
});

router.post("/profile", checkuser, (req, res) => {

  if (validator.isLength(req.body.fname, { min: 3, max: 15 }) &&
    validator.isLength(req.body.lname, { min: 3, max: 20 }) &&
    validator.isLength(req.body.phone, { min: 10, max: 12 }) && (validator.equals(req.body.gender, "male") || validator.equals(req.body.gender, "female"))) {
    let obj = {};
    obj.name = {
      fname: req.body.fname,
      lname: req.body.lname
    }
    obj.gender = req.body.gender;
    obj.DOB = req.body.DOB;
    if (req.body.phone != req.session.user.phone)
      obj.phone = req.body.phone;

    utility.updateProfile(req.session.user._id, obj).then((result) => {
      req.session.user = result;
      res.redirect("/profile")
    }).catch((err) => {
      res.render('profile', { title: "profile", navbar: { user: true }, data: req.session.user, err: true, msg: "SORRY,unable to update profile", type: "error" });

    })

  }
  else {
    res.render('profile', { title: "profile", navbar: { user: true }, data: req.session.user, err: true, msg: "validation failed !", type: "error" });
  }
});

router.post("/meeting/:projid",checkuser,getproj, async (req, res) => {
  
  if (validator.isLength(req.body.name, { min: 3, max: 15 })) {
    try{
    req.body.creatorID=req.session.user._id;
    let datas=[];
    let result=await insertMeet(req.body);
     
    if(Array.isArray(req.body.attendes)){     
    req.body.attendes.forEach((ele)=>{

      datas.push({
        senderUsername:req.session.user._id,
        receiverUsername:ele,
        title:"Meet Request",
        message:"Please Join Meet at "+req.body.dateTime,
        type:2,
        room:req.body.name  
      });

    });
    }else{

      datas.push({
        senderUsername:req.session.user._id,
        receiverUsername:req.body.attendes,
        title:"Meet Request",
        message:"Please Join Meet at "+req.body.dateTime,
        type:2,
        room:req.body.name  
      });

    

    }
     

      await addMeet(req.params.projid,result._id);
      await utility.sendInvites(req.params.projid,datas)
      req.session.proj=undefined;
    res.redirect(`/meeting/${req.params.projid}/?scc=true`)
   }catch(err){
     console.log(err);
     res.redirect(`/meeting/${req.params.projid}/?err=true`)
   }
  }
  //req.body.minutesOfMeeting={ name:req.body.name,description:req.body.description, date:req.body.date , author:req.body.author};

  else {
    res.redirect(`/meeting/${req.session.projid}/?err=true`)
  }
  // req.body._id=req.body.username;
  //  utility.insertMeet(req.body);

});

router.post("/createGroup/:projid", checkuser, getproj, async (req, res) => {


  if ( validator.isLength(req.body.leader, { min: 4, max: 20 }) && validator.isLength(req.body.groupname, { min: 4, max: 20 })) 
  {


    let flag = 0;

    let data = await utility.getGroupsByids(req.session.proj.group);

    utility.getAllusers().then((result) => {
      result.every((element) => {
        if (element._id == req.body.leader) {
          flag = 1;
          return false;
        } else {
          return true;
        }

      })
      if (flag == 1) {
        console.log("Leader found");
        let { projects } = req.session.user;
        let proj;
        projects.every((ele) => {
          if (ele._id == req.params.projid) {
            proj = ele;
            return false;
          } else {
            return true;
          }
        })

        utility.pushProject(req.body.leader, proj).then(async (result) => {

          try {
            let result = await utility.insertGroup(req.body);
            await utility.addGroup(req.params.projid, result._id);
            req.session.proj = undefined;
            res.redirect(`/accessControl/${req.params.projid}`)
          } catch (err) {
            console.log(err);
            res.render('accessControl', { data: data, title: "accessControl", err: true, msg: "Something went wrong", type: "error", mtitle: "SORRY", navbar: { user: true, projid: req.params.projid,access:req.session.access } });
          }


        }).catch((err) => {
          res.render('accessControl', { data: data, title: "accessControl", err: true, msg: "Something went wrong", type: "error", mtitle: "SORRY", navbar: { user: true, projid: req.params.projid,access:req.session.access } });
        });
      } else {
        res.render('accessControl', { data: data, title: "accessControl", err: true, msg: "Leader Not found", type: "error", mtitle: "SORRY", navbar: { user: true, projid: req.params.projid,access:req.session.access } });
      }
    }).catch((error) => {
      res.render('accessControl', { data: data, title: "accessControl", err: true, msg: "Something went wrong", type: "error", mtitle: "SORRY", navbar: { user: true, projid: req.params.projid,access:req.session.access } });

    }); 
  }
  else {
    let data = await utility.getGroupsByids(req.session.proj.group);
    res.render('accessControl', { data: data, title: "accessControl", err: true, msg: "Something went wrong", type: "error", mtitle: "SORRY", navbar: { user: true, projid: req.params.projid,access:req.session.access } });

  }
});

router.post("/manageTask/:projid",checkuser ,async (req, res) => {

 if( validator.isLength(req.body.taskTitle, { min: 5, max: 20 }) && validator.isLength(req.body.taskDescription, { min: 4, max: 20 }) )
 {
  try{
    let result=await utility.insertTask(req.body);

    console.log(result);
  res.redirect(`/manageTask/${req.params.projid}`);
}catch(err){
  res.render('Manage_Task',{data:undefined,title:"manageTask",err:true,msg:"Something went wrong",type:"error",mtitle:"ERROR" ,navbar:{user:true,projid:req.params.projid,access:req.session.access}});
  console.log(err);
}

 }
 else
 {
  res.render('Manage_Task',{data:undefined,title:"manageTask",err:true,msg:"Something went wrong",type:"error",mtitle:"ERROR" ,navbar:{user:true,projid:req.params.projid,access:req.session.access}});
 }

});
router.post("/notify/:projid",checkuser,async (req,res)=>{
  //validate here  
  try{
    req.body.senderUsername=req.session.user._id;
    let users=await getAllusers();
    let got=users.find(ele=>ele._id==req.body.receiverUsername)
    console.log("got=>",got)  
    if(!got)
      res.redirect(`/notification/${req.params.projid}/?code=2`)
    if(req.body.type==0)
        req.body.title="Normal Message"
    else if(req.body.type==1)  
    req.body.title="Need Access"
    else
    req.body.title="Meet Invite"
    //console.log(req.body);
     let result=await utility.insertNotification(req.params.projid,req.body); 
    res.redirect(`/notification/${req.params.projid}/?code=1`)
    }catch(err){
      console.log(err);
         res.redirect(`/notification/${req.params.projid}/?code=0`)
    }
});

router.post("/mmeet/:projid",checkuser,async (req,res)=>{
    try{
      //validate here
      let datas=[]
      req.body.author=req.session.user._id;
      
      await utility.addMMeet(req.body.id,req.body);
        

      res.redirect(`/meeting/${req.params.projid}/?scc=true`)
    }catch(err){
      console.log(err);
      res.redirect(`/meeting/${req.params.projid}/?err=true`)
    }
})

router.post("/addmember/:projid", checkuser, checkproj, async (req, res) => {
if(validator.isLength(req.body.member, { min: 5, max: 20 })){
  let users = await utility.getAllusers();
  let data = utility.getGroupsByids(req.session.proj.group);
  let flag = 0;
  users.every((ele) => {
    if (ele._id == req.body.member) {
      flag = 1;
      return false;
    } else {
      return true;
    }

  })

  if(flag){
        try{
          await utility.addMember(req.body.groupname,req.body.member)
          let cur ;
          for(let ele of req.session.user.projects){
                 if(ele._id== req.params.projid){
                  cur=ele; 
                  break;
                 }
          }
          console.log(cur);
          await utility.pushProject(req.body.member,cur)
          res.render('accessControl',{data:data,title:"accessControl",err:true,msg:"Member Added to Group ",type:"success",mtitle:"GREAT" ,navbar:{user:true,projid:req.params.projid,access:req.session.access}});
        } catch(err){
            console.log(err);
            res.render('accessControl',{data:data,title:"accessControl",err:true,msg:"Something Went wrong",type:"error",mtitle:"SORRY" ,navbar:{user:true,projid:req.params.projid,access:req.session.access}});
        }    
  }else{
    res.render('accessControl',{data:data,title:"accessControl",err:true,msg:"Invalid username",type:"error",mtitle:"SORRY" ,navbar:{user:true,projid:req.params.projid,access:req.session.access}});
  }
}
else{
  let data = utility.getGroupsByids(req.session.proj.group);
  res.render('accessControl',{data:data,title:"accessControl",err:true,msg:"Invalid username",type:"error",mtitle:"SORRY" ,navbar:{user:true,projid:req.params.projid,access:req.session.access}});
 

}


  
});



module.exports = router;
