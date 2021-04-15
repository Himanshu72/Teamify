const mongoose = require("mongoose");
const  Schema = mongoose.Schema;
let notification= new Schema({
    _id:{type:String,required:true,unique:true},

    senderUsername:{type:String,required:true,unique:true},
	receiverUsername:[ {type:String,required:true,unique:true} ],
	title:{type:String,required:true,unique:true},
	message:{type:String,required:true,unique:true},
	type:{type:String,required:true,unique:true},
	link:{type:String,required:true,unique:true},
	task:{type:String,required:true,unique:true}

  });

  module.exports=notification;