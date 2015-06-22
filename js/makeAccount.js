$(function(){
  $('#make_account_form').submit(function(event) {
  	var email = $('#make_account_email').val();
  	var password = $('#make_account_password').val();

    $.ajax({
      type: "POST",
      url: '/makeUser',
      data: {
        email: email,
        password: password
      },
      success: function(data) {
        alert('성공' + JSON.stringify(data));
        location.href = "login.html";
      },
      error: function(data) {
        alert('에러' + JSON.stringify(data));
        location.href = "makeAccount.html";
      },
      dataType: 'json'
    });

    event.preventDefault();
  });
})
