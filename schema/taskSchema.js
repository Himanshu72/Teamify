const mongoose = require("mongoose");
const  Schema = mongoose.Schema;
let task= new Schema({
    _id:{type:String,required:true,unique:true},
    taskTitle:{type:String,required:true},
    taskDescription:{type:String,required:true},
     Deadline:{type:Date,required:true}
  });

  module.exports=task;