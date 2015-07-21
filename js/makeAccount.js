$(function(){
  $('#make_account_form').submit(function(event) {
  	var email = $('#make_account_email').val();
  	var password = $('#make_account_password').val();
    var name = $('#make_account_name').val();

    $.ajax({
      type: "POST",
      url: '/makeUser',
      data: {
        email: email,
        password: password,
        name: name
      },
      success: function(data) {
        alert('가입 성공');
        location.href = "login.html";
      },
      error: function(data) {
        alert('makeUser -> 서버 에러' + JSON.stringify(data));
        location.href = "makeAccount.html";
      },
      dataType: 'json'
    });

    event.preventDefault();
  });
})
