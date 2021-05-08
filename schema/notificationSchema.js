const mongoose = require("mongoose");
const  Schema = mongoose.Schema;
let notification= new Schema({
    senderUsername:{type:String,required:true},
	receiverUsername:[ {type:String,required:true} ],
	title:{type:String,required:true},
	message:{type:String,required:true},
	type:{type:Number,required:true},
	link:{type:String},
	task:{type:String}

  });
// 0 message  , 1 meet link , 2 request task acess  
  module.exports=notification;