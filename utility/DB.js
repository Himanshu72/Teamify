const mongoose = require("mongoose");
const env = require("../env");
const user = require("../schema/userSchema");
const meet = require("../schema/meetSchema");
const notification = require("../schema/notificationSchema");
const project = require("../schema/projectSchema");

mongoose.connect(env.dbserver, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

const userModel = mongoose.model("users", user);
// create model

// preapre data
// save entry

const meetModel = mongoose.model("meets", meet);
const notificationModel = mongoose.model("notifications", notification);
const projectModel = mongoose.model("projects", project);

module.exports = {

  insertUser: (obj) => {

    userdata = new userModel(obj);

    return new Promise((resolve, rej) => {
      userdata.save((err, res) => {
        if (res) {
          console.log("dkng");
          resolve(obj);
        } else {
          console.log(err);
          rej(err);
        }

      });
    });



  },
  insertMeet: (obj) => {
    const meetData = new meetModel(obj);
    meetData.save((err, res) => {
      if (err)
        console.log(err);
      else
        console.log(res);
    })
  },
  insertNotification: (obj) => {
    const notificationData = new notificationModel(obj);
    notificationData.save((err, res) => {
      if (err)
        console.log(err);
      else
        console.log(res);
    })
  },
  updatePassword: (id, pass) => {
    return new Promise((resolve, reject) => {
      userModel.updateOne({ _id: id }, { $set: { password: pass } }, (err, res) => {
        if (res)
          resolve(res);
        else
          reject(err);
      });
    })

  }
  ,
  insertProject: (obj) => {

    return new Promise((resolve, reject) => {
      const projectData = new projectModel(obj);
      projectData.save((err, res) => {
        if (err)
          reject(err)
        else
          resolve(res);
      })
    })


  },
  updateAnnounce: (id, data) => {
    return new Promise((resolve, reject) => {
      projectModel.updateOne({ _id: id }, { announcement: data }, (err, res) => {
        if (res) {
          resolve(res);
        } else {
          reject(err);
        }
      });
    })
  }
  , pushProject: (username, obj) => {

    return new Promise(async (resolve, rej) => {
      userModel.findOneAndUpdate(
        { _id: username }, { $addToSet: { projects: obj } }, { new: true }, (err, res) => {
          if (res) {

            resolve(res);
          } else {
            rej();
          }
        });

    })


  },
  updateProfile: (id, obj) => {
    return new Promise((resolve, reject) => {
      userModel.findOneAndUpdate({ _id: id }, { $set: obj }, {
        new: true
      }, (err, res) => {
        if (res) {
          console.log(res);
          resolve(res);
        } else {
          reject(err);
        }
      });
    });
  }
  , finduserByusername: (id) => {

    return new Promise((resolve, rej) => {

      userModel.findById(id, (err, res) => {
        if (res != null) {
          resolve(res)
        } else {
          rej(res);
        }
      });


    });


  },
  addGroup: (projid, obj) => {

    return new Promise((resolve, reject) => {
      projectModel.updateOne({ _id: projid }, {
        $addToSet: { group: obj }
      }, (err, res) => {
        if (res) {
          resolve(res);
        } else {
          reject(err);
        }
      })
    });
  }
  , getAllusers: () => {
    return new Promise((resolve, reject) => {
      userModel.find({}, (err, res) => {
        if (res)
          resolve(res);
        else
          reject(err);
      })
    })

  }, getProjectById(id) {
    return new Promise((resolve, reject) => {
      projectModel.findOne({ _id: id }, (err, res) => {
        if (res)
          resolve(res);
        else
          reject(err);

      });
    })
  }, addMember(projid, groupid, username) {
    return new Promise((resolve, reject) => {
      // projectModel.aggregate
      /*projectModel.findOne({ _id: projid }, { group: [{ _id: groupid, leader: leader }] }, (err, res) => {
        if (res)
          resolve(res);
        else
          reject(err);
      })
    })*/
    projectModel.findOne({ _id: projid },{group: {$elemMatch: {_id: groupid}}}, (err, res) => {
      if (res)
        resolve(res);
      else
        reject(err);
    })

  })
}

}
