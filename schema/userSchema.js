const mongoose = require("mongoose");
const  Schema = mongoose.Schema;
let user= new Schema({
    _id:{type:String,required:true,unique:true},
    name :{ fname:{type:String,require:true},lname:{type:String,require:true} },
    email:{type:String,required:true,unique:true },
    phone:{type:Number,required:true,unique:true},
    password:{type:String,required:true},
    age:Number,
    gender:String,
    projects:[{name:{type:String,required:true},description:{name:String,required:true},state:{type:Number,required:true,default:0},Owner:{type:String,required:true} }]

  });

  module.exports=user;