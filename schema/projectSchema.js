const mongoose = require("mongoose");
const  Schema = mongoose.Schema;
let project= new Schema({
    _id:{type:String,required:true,unique:true},
    announcement:{type:String,required:true},
    meets:[
           {
            _id:{type:String,unique:true},
            meetingName:{type:String}
           }
          ],
    group:[
            {
              groupName:{type:String},
              leader:{type:String,required:true}
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
                          _id:{type:String},
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