var express = require('express');
var swig = require('swig');
var mongoose = require('mongoose');
var app = express();

app.use('/public', express.static(__dirname + '/public'));

app.engine('html', swig.renderFile);
app.set('views', './views');
app.set('view engine','html');
swig.setDefaults({cache: false})

app.use('/admin',require('./router/admin'));
app.use('/api',require('./router/api'));
app.use('/',require('./router/main'));

mongoose.connect('mongodb://localhost:27018/blog', function(err){
  if (err) {
    console.log('数据库链接失败')
  } else {
    console.log('数据可链接成功')
    app.listen(8081);
  }
});

