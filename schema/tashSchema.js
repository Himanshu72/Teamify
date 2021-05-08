const mongoose = require("mongoose");
const  Schema = mongoose.Schema;

let task= new Schema( {
  taskDescription:{type:String,required:true},
  Deadline:{type:Date,required:true},
  taskTitle:{type:String},
  taskStatus:{type:Number},
  workerID:[
   {type:String}
  ],
  viewerID:[
    {type:String}
  ],
  subTask:[
    {
      subtaskName:{type:String},
      subtaskStatus:{type:Number}
    }
  ],

});

module.exports=task;