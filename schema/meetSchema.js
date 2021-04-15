const mongoose = require("mongoose");
const  Schema = mongoose.Schema;
let meet= new Schema({
    _id:{type:String,required:true,unique:true},

    meetID:{type:String,required:true,unique:true},
    meetLink:{type:String,required:true,unique:true},
    meetPassword:{type:String},
    minutesOfMeeting:{type:String},
    creatorID:{type:String,required:true},
    attendes:[
        {type:String,required:true}
    ],
    dateTime:{type:dateTime,required:true},
    duration:{type:String,required:true}
  });

  module.exports=meet;