var express = require('express');
var router = express.Router();
const env = require("../env");
const mongoose = require('mongoose');
const utility = require("../utility/DB");
const notify=require("../utility/notifications");
/* G  ET home page. */

router.get('/', async function (req, res, next) {

  res.render('index',{title:"Home"});
});

router.get("/login",(req,res)=>{

  res.render('login',{title:"login"});
});

router.get("/signup",(req,res)=>{

  res.render('signup',{title:"signup"});
});

router.get("/profile",(req,res)=>{

  res.render('profile',{title:"profile"});
});


router.get("/dashboard/:id",(req,res)=>{

  res.render('dashboard',{title:"dashboard"});
});


router.get("/test",(req,res)=>{

  res.render('test',{title:"test"});
});

module.exports = router;
