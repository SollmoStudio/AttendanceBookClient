$(function(){
  $.ajax({
    type: "GET",
    url: '/attends',
    success: function(data) {
      if (data.status === "ok") {
        alert(data);
      } else if (data.status === "NotLogin") {
        alert('로그인 해주세요~ :)');
        location.href = "login.html";
      } else {
        alert('my -> get attend -> 서버 에러' + JSON.stringify(data));
        location.href = "error.html";
      }
    },
    error: function(data) {
      alert('login -> 서버 에러' + JSON.stringify(data));
      location.href = "index.html";
    },
    dataType: 'json'
  });
});