const mongoose=require("mongoose");
const env=require("../env");
const user=require("../schema/userSchema");
const task=require("../schema/taskSchema");
const meet=require("../schema/meetSchema");
const notification = require("../schema/notificationSchema");
const project = require("../schema/projectSchema");

mongoose.connect(env.dbserver, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  var db = mongoose.connection;
  
  db.on("error", console.error.bind(console, "connection error:"));

  const usermodel=  mongoose.model("users",user);
  // create model
  const taskmodel= mongoose.model("tasks",task);
  // preapre data
  // save entry

  const meetModel = mongoose.model("meets",meet);
  const notificationModel = mongoose.model("notifications",notification);
  const projectModel = mongoose.model("projects",project);

module.exports={

    insertUser:(obj)=>{
     
      const userdata = new userModel(obj);
      userdata.save((err,res)=>{
        if(err)
           console.log(err); 
         else
          console.log(res);  
      });
    },
    insertTask:(obj)=>{
       const taskData= new taskmodel(obj);
       taskData.save( (err,res)=>{
          if(err) 
              console.log(err);
          else
              console.log(res);    
       } )  
       
    },
    insertMeet:(obj)=>{
      const meetData = new meetModel(obj);
      meetData.save((err,res)=>{
        if(err)
          console.log(err);
        else
          console.log(res);
      })
    },
    insertNotification:(obj)=>{
      const notificationData = new notificationModel(obj);
      notificationData.save((err,res)=>{
        if(err)
          console.log(err);
        else
          console.log(res);
      })
    },
    insertProject:(obj)=>{
      const projectData = new projectModel(obj);
      projectData.save((err,res)=>{
        if(err)
          console.log(err);
        else
          console.log(res);
      })
    }
    
}
