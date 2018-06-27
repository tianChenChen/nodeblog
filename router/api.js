var express = require('express');
var router = express.Router();

// 统一返回格式
var responseData;

// router.use(function(req, res, next){
//   responseData ={
//     code: 0,
//     message: ''
//   }
// })

/*
  用户注册
   注册逻辑
   1.用户名不能为空
   2.密码不能为空
   3.两次输入密码必须一致

    1.用户是否已经被注册了
      数据库查询
    2.
*/
router.post('/user/register', function(req, res, next){
  console.log( 'eee', req.body )

  var username = req.body.username;
  var password = req.body.password;
  var repassword = req.body.repassword;

  // 用户是否为空
  if(username == ''){
    responseData.code = 1;
    responseData.message = '用户名不能为空';
    res.json(responseData);
    return
  }

  //密码不能为空
  if(password == ''){
    responseData.code = 2;
    responseData.message = '密码不能为空';
    res.json(responseData);
    return;
  }

  //两次输入的密码必须一致
  if(password != repassword) {
    responseData.code = 3
    responseData.message = '两次输入的密码不一致'
    res.json(responseData);
    return;
  }

  responseData.message="注册成功";
  res.json(responseData)

})

module.exports = router