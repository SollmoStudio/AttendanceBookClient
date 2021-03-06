$(function() {
  $.ajax({
    type: "POST",
    url: '/isLogin',
    data: {},
    success: function(data1) {
      var isLogin = data1.result[0];
        $.ajax({
          type: "POST",
          url: '/getEmail',
          data: {},
          success: function(data2) {
            var email = data2.result[0];
            successCallback(isLogin, email);
          },
          error: function(errorData) {
            alert('getEmail -> 서버 에러' + JSON.stringify(errorData));
            location.href = "error.html";
          },
          dataType: 'json'
        });
    },
    error: function(data) {
      alert('isLogin -> 서버 에러' + JSON.stringify(data));
      location.href = "error.html";
    },
    dataType: 'json'
  });

  function successCallback(isLogin, email) {
    makeHeaderMenu(isLogin, email);
    addEvent(isLogin);
  }

  function makeHeaderMenu(isLogin, email) {
    if (isLogin) {
      var left_target = $('#navbar_left');
      $('<li id="nav_attendance_page_button"><a href="attendance.html">출근 도장</a></li>' +
        '<li id="nav_my_page_button"><a href="my.html">내 근태 기록</a></li>' +
        '<li id="nav_event_page_button"><a href="event.html">이벤트 추가</a></li>' +
        '<li id="nav_manage_page_button"><a href="manage.html">관리자 페이지</a></li>' +
        '<li id="nav_account_page_button"><a href="account.html">계정관리</a></li>').appendTo(left_target);
    }

    var right_target = $('#navbar_right');
    if (isLogin) {
      $('<li><a href="#">' + email + '</a></li>').appendTo(right_target);
      $('<li id="nav_logout_page_button"><a href="#">Logout</a></li>').appendTo(right_target);
    }
    else {
      $('<li id="nav_login_page_button"><a href="login.html">Login</a></li>').appendTo(right_target);
    }
  }

  function addEvent(isLogin) {
    var url = document.URL;
    if (contains(url, 'login')) {
      $('#nav_login_page_button').addClass('active');
    } else if(contains(url, 'attendance')) {
      $('#nav_attendance_page_button').addClass('active');
    } else if(contains(url, 'manage')) {
      $('#nav_manage_page_button').addClass('active');
    } else if(contains(url, 'rank')) {
      $('#nav_rank_page_button').addClass('active');
    } else if(contains(url, 'my')) {
      $('#nav_my_page_button').addClass('active');
    } else if(contains(url, 'account')) {
      $('#nav_account_page_button').addClass('active');
    } else if(contains(url, 'event')) {
      $('#nav_event_page_button').addClass('active');
    }

    $('#nav_logout_page_button').click(function() {
      $.ajax({
        type: "POST",
        url: '/logout',
        data: {},
        success: function(data) {
          location.href = "index.html";
        },
        error: function(data) {
          alert('logout -> 서버 에러' + JSON.stringify(data));
          location.href = "error.html";
        },
        dataType: 'json'
      });
    });
  }

  function contains(str1, str2) {
    if (str1.indexOf(str2) != -1)
      return true;
    return false;
  }
});