$(function(){
  var recordsGroupedByUserId;

  $.ajax({
    type: "GET",
    url: '/attends',
    success: function(data) {
      if (data.status === "ok") {
        initializeAttendancePage(data.result);
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
    $('#date_form').change(function() {

      clearRecordTable();
      var date = $(this).val();
      var attendanceTime = _.mapObject(recordsGroupedByUserId, function(values, key) {
        return _.filter(values, function (value) {
          var recordToMoment = moment(value[1]);
          var selectedDate = moment(date);
          return  recordToMoment.year() === selectedDate.year() && recordToMoment.month() === selectedDate.month() && recordToMoment.date() === selectedDate.date();
        });
      });;

      attachRecordToTable(attendanceTime);
    });

    $('.drop_down_user').click(function() {
      clearRecordTableByName();
      var userID = $(this).text();
      var attendanceTime = _.map(recordsGroupedByUserId[userID], function(record) {
        return moment(record[1]);
      });

      attachRecordToTableForName(attendanceTime);
    });
  }

  function clearRecordTable()
  {
    $('#manage_table_body').empty();
  }

  function clearRecordTableByName()
  {
    $('#manage_table_body_by_name').empty();
  }

  function attachRecordToTable(records) {
    _.mapObject(records, function(values, key) {
      var query = '<tr><td>' + key + '</td><td>';
      if (values.length != 0)
        query += moment(values[0][1]).format('HH:mm:ss');
      else
        query += '기록 없음';
      query += '</td></tr>';
      $('#manage_table_body').append(query);
    });
  }

  function attachRecordToTableForName(records) {
    _.each(records, function(record) {
      var query = '<tr><td>' + record.format('YYYY/MM/DD') + '</td><td>' + record.format('HH:mm:ss') + '</td></tr>';
      $('#manage_table_body_by_name').append(query);
    });
  }
});