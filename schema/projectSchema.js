const mongoose = require("mongoose");
const  Schema = mongoose.Schema;
let project= new Schema({
    _id:{type:String,required:true,unique:true},
    meets:[
           {
            _id:{type:String,unique:true},
            meetingName:{type:String}
           }
          ],
    group:[
            {
              _id:{type:String,required:true,unique:true},
              groupName:{type:String},
              leader:{type:String,required:true}
              ,
              member:[
                {type:String,required:true} 
              ],
              card:[
                {
                  cardName:{type:String},
                  task:[
                    {
                      _id:{type:String,unique:true},
                      taskName:{type:String},
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
                      taskIDs:[  
                          {type:String} // taskID  
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