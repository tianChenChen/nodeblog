var express = require('express');
var router = express.Router();

var User =  require('../models/user')
var Category =  require('../models/Category')

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
  var page = Number(req.query.page || 1);
  var limit = 1;
  var skip = (page -1)*limit
  var pages = 0
  User.count().then(function(count){
    // 计算总页数
    pages = parseInt(count / limit);
    // 取值不能超过pages
    page = Math.min(page, pages);
    // 取值不能小于1
    page = Math.max(page, 1);

    var skip = (page - 1) * limit

    User.find().limit(limit).skip(skip).then(function(users){
      res.render('admin/user_index', {
        userInfo: req.userInfo,
        users: users,
        
        count: count,
        pages: pages,
        limit: limit,
        page: page
      })
    })
  })
})
  
// 分类首页
router.get('/category', function(req, res){
  // 从数据库中读取所有的用户数据
  var page = Number(req.query.page || 1);
  var limit = 2;
  var skip = (page -1)*limit
  var pages = 0
  Category.count().then(function(count){
    // 计算总页数
    pages = parseInt(count / limit);
    // 取值不能超过pages
    page = Math.min(page, pages);
    // 取值不能小于1
    page = Math.max(page, 1);

    var skip = (page - 1) * limit

    // 1: 升序  -1：降序
    Category.find().sort({_id: -1}).limit(limit).skip(skip).then(function(categories){
      res.render('admin/category_index', {
        userInfo: req.userInfo,
        categories: categories,
        
        count: count,
        pages: pages,
        limit: limit,
        page: page
      })
    })
  })
})

// 分类添加
router.get('/category/add', function(req, res){
  res.render('admin/category_add', {
    userInfo: req.userInfo
  })
})

// 分类保存
router.post('/category/add', function(req,res){
  var name = req.body.name || '';

  if (name == '') {
    res.render('admin/error',{
      userInfo: req.userInfo,
      message: '名称不能空'
    })
    return;
  }

  //数据库是否已经存在同名分类名称
  Category.findOne({
    name: name
  }).then(function(rs){
    if (rs) {
      // 数据库中已经存在该分类了
      res.render('admin/error',{
        userInfo: req.userInfo,
        message: '分类已经存在了'
      })
      return Promise.reject();
    } else {
      // 数据库中不存在该分类，可以保存
      return new Category({
        name: name
      }).save();
    }
  }).then(function(newcate){
    res.render('admin/success',{
      userInfo: req.userInfo,
      message: '分类保存成功',
      url: '/admin/category'
    })
  })
})
  
// 分类修改
router.get('/category/edit', function(req, res){
  // 获取要修改的分类的信息，并且用表单的形式展示出来
  var id =  req.query.id || '';
  console.log(id, 'id')
  Category.findOne({
    _id: id
  }).then(function(category){
    console.log(category, 'category')
    if (!category) {
      res.render('admin/error',{
        userInfo: req.userInfo,
        message: '分类信息不存在',
      })
      // return Promise.reject()
    } else {
      res.render('admin/category_edit',{
        userInfo: req.userInfo,
        category: category
      })
    }
  })
})

// 分类的修改保存
router.post('/category/edit', function(req,res){
  // 获取修改的id
  var id = req.query.id || ''
  var name = req.body.name || ''

  Category.findOne({
    _id: id
  }).then(function(category){
    if (!category) {
      res.render('admin/error',{
        userInfo: req.userInfo,
        message: '分类信息不存在'
      })
      return Promise.reject()
    } else {
      // 没有修改就点击提交
      if (name == category.name) {
        res.render('admin/error',{
          userInfo: req.userInfo,
          message: '修改成功',
          url: '/admin/category'
        })
        return Promise.reject()
      } else {
        // 要修改的分类名称是否已经在数据中存在
        return Category.findOne({
          _id: {$ne: id},
          name: name
        })
      }
      
    }
  }).then(function(sameCategory){
    if (sameCategory) {
      res.render('admin/error',{
        userInfo: req.userInfo,
        message: '数据库中已经存在同名分类'
      })
      return Promise.reject()
    } else {
      return Category.update({
        _id: id
      },{
        name: name
      })
    }
  }).then(function(){
    res.render('admin/success',{
      userInfo: req.userInfo,
      message: '修改成功',
      url: '/admin/category'
    })
  })
})

// 分类删除
router.get('/category/delete',function(req,res){
  var id = req.query.id || '';

  Category.remove({
    _id: id
  }).then(function(){
    res.render('admin/success',{
      userInfo: req.userInfo,
      message: '删除成功',
      url: '/admin/category'
    })
  })
})


module.exports = router