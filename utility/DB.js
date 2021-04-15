const mongoose=require("mongoose");
const env=require("../env");
const user=require("../schema/userSchema");
const task=require("../schema/taskSchema");
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

module.exports={

    insertUser:(obj)=>{
     
      const userdata = new usermodel(obj);
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
       
    }
}
