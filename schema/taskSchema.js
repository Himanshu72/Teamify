const mongoose = require("mongoose");
const  Schema = mongoose.Schema;
let task= new Schema({

    taskTitle:{type:String,required:true},
    taskDescription:{type:String,required:true},
     Deadline:{type:Date,required:true}
  });

  module.exports=task;