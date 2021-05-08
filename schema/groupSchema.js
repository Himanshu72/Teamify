const mongoose = require("mongoose");
const  Schema = mongoose.Schema;
let group= new Schema({
    groupname:{type:String},
    leader:{type:String,required:true,unique:true}
    ,
    member:[
      {type:String,required:true}   
    ],
       
    task:[
         {type:string}
        ]
      
    
  })