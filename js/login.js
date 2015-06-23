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
        if (data.status === "ok") {
          location.href = "attendance.html";
        } else {
          alert('잘못된 아이디 혹은 패스워드');
        }
      },
      error: function(data) {
        alert('login -> 서버 에러' + JSON.stringify(data));
        location.href = "index.html";
      },
      dataType: 'json'
    });

    event.preventDefault();
  });

  $('#login_sign_in_button').click(function() {
    location.href = "makeAccount.html";
    event.preventDefault();
  });
})