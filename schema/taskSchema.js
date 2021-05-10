const mongoose = require("mongoose");
const  Schema = mongoose.Schema;

let task= new Schema( {
  taskDescription:{type:String,required:true},
  Deadline:{type:Date,required:true},
  taskTitle:{type:String},
  taskStatus:{type:Number,default:0},
  workerID:[
   {type:String}
  ],
  viewerID:[
    {type:String}
  ],


});

module.exports=task;