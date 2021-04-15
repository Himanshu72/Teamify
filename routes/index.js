var express = require('express');
var router = express.Router();
const env = require("../env");
const mongoose = require('mongoose');
const utility = require("../utility/DB");
/* G  ET home page. */

router.get('/', async function (req, res, next) {

  //Testing insert------------------
  utility.insertUser({
    _id: 1,
    name: "test",
    email: "123@gmail.com",
    phone: 1234567890,
    password: "123456",
    age: 22,
    gender: "M",
    projects: [{ _id: "WP", name: "WP", description: "this is WP", state: 0, Owner: "user1" }]
  });

  utility.insertMeet({
    _id: 1,
    meetID: "ab12",
    meetLink: "ww.ad.com",
    meetPassword: "passwor",
    minutesOfMeeting: "mmasdff daf",
    creatorID: "abc123",
    attendes: [
      { name: "vishwam" }
    ],
    dateTime: "20/20/2020",
    duration: "20"
  });

  utility.insertNotification({
    _id: "sa4",

    senderUsername: "3edf",
    receiverUsername: ["vishwam"],
    title: "Some",
    message:"Some" ,
    type: "Some",
    link: "Some",
    task: "Some"
  });

  utility.insertProject({
    _id:"Something",
    projectID:"Something",
    meets:[
           {
            meetingID:"Something",
            meetingName:"Something"
           }
          ],
    group:[
            {
              groupID:"Something",
              groupName:"Something",
              leader:[
                "Something"
              ],
              member:[
                "Something"
                
              ],
              card:[
                {
                  cardName:"Something",
                  task:[
                    {
                      taskID:"Something",
                      taskName:"Something",
                      taskStatus:2,
                      workerID:[
                        "Something"
                        
                      ],
                      viewerID:[
                        "Something"
                      ],
                      subTask:[
                        {
                          subtaskName:"Something",
                          subtaskStatus:1
                        }
                      ],
                      description:[  
                        "Something"
                      ]
                    }
                  ]
                }
              ]
            }
    ],
    notifications:[
      "Something"
    ]
  });

  //End of testing insert----------------------------
  res.render('index', { title: 'Express' });
});

module.exports = router;
