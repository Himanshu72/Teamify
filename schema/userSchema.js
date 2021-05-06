const mongoose = require("mongoose");
const  Schema = mongoose.Schema;
let user= new Schema({
    _id:{type:String,required:true,unique:true},
    name :{ fname:{type:String,require:true},lname:{type:String,require:true} },
    email:{type:String,required:true,unique:true },
    phone:{type:Number,required:true,unique:true},
    password:{type:String,required:true},
    DOB:{type:Date,required:true},
    gender:String,
    projects:[ {name:{type:String},description:{type:String},state:{type:Number,default:0},Owner:{type:String} }]

  });

  module.exports=user;