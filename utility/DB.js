const mongoose = require("mongoose");
const env = require("../env");
const user = require("../schema/userSchema");
const meet = require("../schema/meetSchema");
const notification = require("../schema/notificationSchema");
const project = require("../schema/projectSchema");
const group= require("../schema/groupSchema")
const task =require("../schema/tashSchema");
mongoose.connect(env.dbserver, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

const userModel = mongoose.model("users", user);
const groupModel = mongoose.model("groups",group);
const taskModel  = mongoose.model("tasks",task);
const meetModel = mongoose.model("meets", meet);
const notificationModel = mongoose.model("notifications", notification);
const projectModel = mongoose.model("projects", project);
  //why do we use it?
module.exports = {
insertGroup:(obj)=>{
 const groupData= new groupModel(obj);
 return new Promise((resolve,reject)=>{
  groupData.save((err,res)=>{
    if(res)
      resolve(res)
    else 
       reject(err);  
})
 }) ;
 
},
insertTask: (obj)=>{
  const taskData=new taskModel(obj);
  return new Promise((resolve,reject)=>{
        taskData.save(async (err,res)=>{
              if(res){
                try{
                  
                  await groupModel.updateOne({_id:obj.groupid},{$addToSet:{task:res._id} })
                  resolve(res);
                }catch(err){
                  console.log(err);
                  throw err;
                }
              }else{
                   reject(err)
                 } 
        });
  });
}
,
  insertUser: (obj) => {

    let userdata = new userModel(obj);

    return new Promise((resolve, rej) => {
      userdata.save((err, res) => {
        if (res) {
          console.log("dkng");
          resolve(obj);
        } else {
          console.log(err);
          rej(err);
        }

      });
    });



  },
  addMeet:async(projid,id)=>{
      try{
     
     let res= await projectModel.updateOne({_id:projid},{
      $addToSet:{ meets:id }
    })
    return res;
      }catch(err){
          throw err;
      }
  }
  ,
  insertMeet: async(obj) => {
   try{
  
    const meetData = new meetModel(obj);
  
    let result= await meetData.save();
  
    return result;   
   
  }catch(err){
     throw err;
   }
  },
  insertNotification: async (id,obj) => {
    try{
    const notificationData = new notificationModel(obj);
    let result=await notificationData.save();
      await projectModel.updateOne({_id:id},{$addToSet:{notifications:result._id}})
    }catch(err){
      throw err;
    }
  },
  updatePassword: (id, pass) => {
    return new Promise((resolve, reject) => {
      userModel.updateOne({ _id: id }, { $set: { password: pass } }, (err, res) => {
        if (res)
          resolve(res);
        else
          reject(err);
      });
    })

  }
  ,
  insertProject: (obj) => {

    return new Promise((resolve, reject) => {
      const projectData = new projectModel(obj);
      projectData.save((err, res) => {
        if (err)
          reject(err)
        else
          resolve(res);
      })
    })


  },
  updateAnnounce: (id, data) => {
    return new Promise((resolve, reject) => {
      projectModel.updateOne({ _id: id }, { announcement: data }, (err, res) => {
        if (res) {
          resolve(res);
        } else {
          reject(err);
        }
      });
    })
  }
  , pushProject: (username, obj) => {

    return new Promise(async (resolve, rej) => {
      userModel.findOneAndUpdate(
        { _id: username }, { $addToSet: { projects: obj } }, { new: true }, (err, res) => {
          if (res) {
            resolve(res);
          } else {
            rej();
          }
        });

    })


  },
  updateProfile: (id, obj) => {
    return new Promise((resolve, reject) => {
      userModel.findOneAndUpdate({ _id: id }, { $set: obj }, {
        new: true
      }, (err, res) => {
        if (res) {
          resolve(res);
        } else {
          reject(err);
        }
      });
    });
  }
  , finduserByusername: (id) => {

    return new Promise((resolve, rej) => {

      userModel.findById(id, (err, res) => {
        if (res != null) {
          resolve(res)
        } else {
          rej(err); //changed here
        }
      });


    });


  }
  ,
  addGroup: (projid, groupid) => {

    return new Promise((resolve, reject) => {
          projectModel.updateOne({_id:projid},{
            $addToSet:{ group:groupid }},(err,res)=>{
              if(res)
                  resolve(res)
               else
                  reject(err);   
            })
    });
  }
  , getAllusers: () => {
    return new Promise((resolve, reject) => {
      userModel.find({}, (err, res) => {
        if (res)
          resolve(res);
        else
          reject(err);
      })
    })

  }, getProjectById(id) {
    return new Promise((resolve, reject) => {
      projectModel.findOne({ _id: id }, (err, res) => {
        if (res)
          resolve(res);
        else
          reject(err);

      });
    })
  },
  getGroupsByids:async(ids)=>{

       
    return new Promise((resolve,reject)=>{
      console.log(ids);   
      groupModel.find({
           _id:{$in:ids}
         },(err,res)=>{
           if(res)
                resolve(res)
             else
                reject(err)
         })
    })       
  }, addMember(groupids, username) {
    return new Promise((resolve, reject) => {
      groupModel.updateMany({_id:{ $in:groupids }},{$addToSet:{ member:username }},(err,res)=>{
         if(res)
            resolve(res)
          else
            reject(err);  
      })

  })
},getMygroups:async (groupids,username,owner)=>{
     try{
       
       let allgroup=await groupModel.find({ _id:{$in:groupids} });
       if(username==owner)
              return allgroup;
       else{
      
      let result=  allgroup.filter((ele)=>{
              return (ele.member.includes(username) || ele.leader==username );
       });
       return result;
      }
     }catch(err){
          throw err;
     }
},
getTasksBygroup:(groups)=>{
  try{
  let ids=[];
 groups.forEach((ele)=>{
   ids.push(ele.task);
 }) 
 return new Promise((resolve,reject)=>{
      taskModel.find({_id:{$in:ids}},(err,res)=>{
        if(res)
            resolve(res);
         else 
            reject(res);   
      })
 })
}catch(err){
  throw err;
}
},
sendInvites: async (projid,datas)=>{
  console.log("==>".datas) 
  try{

       
        result =await notificationModel.insertMany(datas);
        let ids=result.map((ele)=>ele._id);
        await projectModel.updateOne({_id:projid},{$addToSet:{notifications:ids}})
     }catch(err){
       throw err;
     }
}
,
 access:(username,owner,groups)=>{
        if(username==owner){
          return true;
        }else{
           let flag=0;
              groups.every((ele) =>{
                  if(ele.leader==username){
                     flag=1;
                     return false; 
                  }else{
                     return true;
                  }
              });    
              
              return (flag==1) ? true : false ;
        }
 },
 
 getMeetByids(ids){
   return new Promise((resolve,reject)=>{
      meetModel.find({_id:{$in:ids}},(err,res)=>{
        if(res)
            resolve(res)
        else
            reject(err)    
      })
    });
  },
  addMMeet:(meetid,obj)=>{
      return new Promise((resolve,reject)=>{
            meetModel.updateOne({_id:meetid},{minutesOfMeeting:obj},(err,res)=>{
              if(err)
                  reject(err)
               else 
                  resolve(res)   
            });
      })
  },
  getNotifiByIds(ids){
    return new Promise((resolve,reject)=>{
        notificationModel.find({_id:{$in:ids}},(err,res)=>{
          if(res)
          resolve(res);
          else
          reject(err);
        })
    });
  },
  getSubtaskByID:async (id)=>{
    await taskModel.findOne({"subTask._id":id}).select({subTask:{$eleMatch:{_id:id}}});
  //  User.findOne({id: req.body.myId}).select({ Friends: {$elemMatch: {id: req.body.id}}})
  }
  

}
