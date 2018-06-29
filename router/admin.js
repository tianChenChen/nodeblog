var express = require('express');
var router = express.Router();
var User =  require('../models/user')

router.use(function(req, res, next){
  if (!req.userInfo.isAdmin) {
    // 如果当前用户是非管理员
    res.send('对不起，只有管理员才能进入后台管理')
    return
  }
  next()
})

// 首页
router.get('/', function(req, res, next){
  res.render('admin/index', {
    userInfo: req.userInfo
  })
});

// 用户管理
router.get('/user', function(req, res){

  // 限制获取数据条数 limit()
  // skip(2): 忽略数据的条数
  /*
    每条显示2调
    1：1-2 skip:0 ->(当前页-1)*linmit
    2： 3-4 skip:2
  */

  // 从数据库中读取所有的用户数据
  console.log(req.query, 'shh')
  var page = req.query.page || 1;
  var limit = 1;
  var skip = (page -1)*limit
  User.find().limit(limit).skip(skip).then(function(users){
    res.render('admin/user_index', {
      userInfo: req.userInfo,
      users: users
    })
  })

  
})

module.exports = router