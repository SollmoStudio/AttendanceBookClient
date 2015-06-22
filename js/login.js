$(function(){
  $('#login_form').submit(function(event) {
    var email = $('#login_email').val();
    var password = $('#login_password').val();

    $.ajax({
      type: "POST",
      url: '/login',
      data: {
        email: email,
        password: password
      },
      success: function(data) {
        alert('성공' + JSON.stringify(data));
        location.href = "/attendance.html";
      },
      error: function(data) {
        alert('에러' + JSON.stringify(data));
        location.href = "/index.html";
      },
      dataType: 'json'
    });

    event.preventDefault();
  });
})