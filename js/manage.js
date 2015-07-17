$(function(){
  var recordsGroupedByUserId;

  $.ajax({
    type: "GET",
    url: '/attends',
    success: function(data) {
      if (data.status === "ok") {
        initializeAttendancePage(records.result);
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

  function initializeAttendancePage(records)
  {
    recordsGroupedByUserId = _.groupBy(records, 0);

    setUserListToDropDownButton();
    addEvent();
  }

  function setUserListToDropDownButton()
  {
    var users = _.keys(recordsGroupedByUserId);
    var dropDownList = $('#manage_user_list');

    _.each(users, function(user){
      var query = '<li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="drop_down_user">' + user + '</a></li>';
      $(query).appendTo(dropDownList);
    });
  }

  function addEvent()
  {
    $('.drop_down_user').click(function() {

      clearRecordTable();

      var userID = this.text();
      var attendanceTime = _.map(recordsGroupedByUserId.userID, function(record) {
        return record[1];
      });;

      attachRecordToTable(attendanceTime);
    });
  }

  function clearRecordTable()
  {
    $('#manage_table_body').empty();
  }

  function attachRecordToTable(records) {
    _.each(records, function(record) {
      var query = '<tr><td>' + record.format('YYYY/MM/DD') + '</td><td>' + record.format('HH:mm:ss') + '</td></tr>';
      $('#manage_table_body').append(query);
    });
  }
});