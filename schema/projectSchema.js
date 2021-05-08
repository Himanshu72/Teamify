const mongoose = require("mongoose");
const  Schema = mongoose.Schema;
let project= new Schema({
 
    announcement:{type:String},
    meets:[
           {
            type:String
           }
          ],
    group:[{type:String}],
    notifications:[
        {type:String,required:true}
    ]

  });

  module.exports=project;
  /*
      username
      type (req,message)
       message 
       send  
  */
 /*
 AcessContole
 Mange task
Workspace
 meet 
 communication
  */