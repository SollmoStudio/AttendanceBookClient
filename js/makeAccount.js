$(function(){
  $('#make_account_form').submit(function(event) {
    alert('요청중');
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
      },
      error: function(data) {
        alert('에러' + JSON.stringify(data));
      },
      dataType: 'json'
    });

    event.preventDefault();
  });
})