const mongoose = require("mongoose");
const  Schema = mongoose.Schema;
let project= new Schema({
 
    announcement:{type:String},
    meets:[
           {
            meetingName:{type:String}
           }
          ],
    group:[
            {
              groupname:{type:String},
              leader:{type:String,required:true,unique:true}
              ,
              member:[
                {type:String,required:true}   
              ],
              card:[
                {
                  
                  task:[
                    {
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
    
                    }
                  ]
                }
              ]
            }
    ],
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