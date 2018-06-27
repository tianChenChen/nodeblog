$(function(){
  var $loginBox = $('#loginBox')
  var $registerBox = $('#registerBox')

  //切换到注册
  $loginBox.find('a.colMint').click(function(){
    $loginBox.hide()
    $registerBox.show()
  })

  //切换到登录
  $registerBox.find('a.colMint').click(function(){
    $loginBox.show()
    $registerBox.hide()
  })

  //注册
  $registerBox.find('button').on('click',function(){
    $.ajax({
      type:'post',
      url:'/api/user/register',
      data:{
        username: $registerBox.find('[name="username"]').val(),
        password: $registerBox.find('[name="password"]').val(),
        repassword: $registerBox.find('[name="repassword"]').val()
      },
      dataType:'json',
      success:function(data){
        console.log(result)
      }
    })
  })
})