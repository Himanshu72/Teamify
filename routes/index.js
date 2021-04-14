var express = require('express');
var router = express.Router();
const env=require("../env");
const mongoose = require('mongoose');
const utility=require("../utility/DB");
/* G  ET home page. */

router.get('/', async function(req, res, next) {
 
  
  res.render('index', { title: 'Express' });
});

module.exports = router;
