var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
  console.log(req.userInfo, '首页获取用户')
  res.render('main/index', {
    userInfo: req.userInfo
  })
})

module.exports = router