const mongoose = require("mongoose");
const  Schema = mongoose.Schema;
let project= new Schema({
    _id:{type:String,required:true,unique:true},
    projectID:{type:String,required:true,unique:true},
    meets:[
           {
            meetingID:{type:String,required:true,unique:true},
            meetingName:{type:String,required:true}
           }
          ],
    group:[
            {
              groupID:{type:String,required:true,unique:true},
              groupName:{type:String,required:true},
              leader:[
                {type:String,required:true}
              ],
              member:[
                {type:String,required:true}
                
              ],
              card:[
                {
                  cardName:{type:String,required:true},
                  task:[
                    {
                      taskID:{type:String,required:true,unique:true},
                      taskName:{type:String,required:true},
                      taskStatus:{type:Number,required:true},
                      workerID:[
                       {type:String,required:true}
                        
                      ],
                      viewerID:[
                        {type:String,required:true}
                      ],
                      subTask:[
                        {
                          subtaskName:{type:String,required:true},
                          subtaskStatus:{type:Number,required:true}
                        }
                      ],
                      description:[  
                          {type:String,required:true}
                      ]
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