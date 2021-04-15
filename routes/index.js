var express = require('express');
var router = express.Router();
const env=require("../env");
const mongoose = require('mongoose');
const utility=require("../utility/DB");
/* G  ET home page. */

router.get('/', async function(req, res, next) {
 
 utility.insertUser({
  _id:1,
  name:"test",
  email:"123@gmail.com",
  phone:1234567890,
  password:"123456",
  age:22,
  gender:"M",
  projects:[ {_id:"WP",name:"WP",description:"this is WP",state:0,Owner:"user1" }]
 });  
  res.render('index', { title: 'Express' });
});

module.exports = router;
