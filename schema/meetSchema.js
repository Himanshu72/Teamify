const mongoose = require("mongoose");
const  Schema = mongoose.Schema;
let meet= new Schema({
    name:{type:String,required:true,unique:true},
    meetLink:{type:String,required:true},
    minutesOfMeeting:{ title:String,description:String,date:Date,author:String },
    creatorID:{type:String,required:true},
    attendes:[
        {type:String,required:true}
    ],
    dateTime:{type:Date,required:true},
    duration:{type:String}
  });

  module.exports=meet;