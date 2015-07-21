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
    var dropDownList = $('#manage_user_list');
    _.each(recordsGroupedByUserId, function(record){
      var query = '<li role="presentation"><a role="menuitem" tabindex="-1" href="#" alt="' + record[0][0] +'" class="drop_down_user">' + record[0][2] + '</a></li>';
      $(query).appendTo(dropDownList);
    });
  }

  function addEvent()
  {
    $('#date_form').change(function() {
      clearRecordTableByDate();
      var date = $(this).val();
      var attendanceTime = _.mapObject(recordsGroupedByUserId, function(values, key) {
        return _.filter(values, function (value) {
          var recordToMoment = moment(value[1]);
          var selectedDate = moment(date);
          return  recordToMoment.year() === selectedDate.year() && recordToMoment.month() === selectedDate.month() && recordToMoment.date() === selectedDate.date();
        });
      });;

      attachRecordToTableByDate(attendanceTime);
    });

    $('.drop_down_user').click(function() {
      clearRecordTableByName();
      var userID = $(this).attr('alt');
      var attendanceTime = _.map(recordsGroupedByUserId[userID], function(record) {
        return moment(record[1]);
      });

      attachRecordToTableForName(attendanceTime);
    });
  }

  function clearRecordTableByDate()
  {
    $('#manage_table_body_by_date').empty();
  }

  function clearRecordTableByName()
  {
    $('#manage_table_body_by_name').empty();
  }

  function attachRecordToTableByDate(records) {
    _.mapObject(records, function(values, key) {
      var query = '<tr><td>' + recordsGroupedByUserId[key][0][2] + '</td><td>';
      if (values.length != 0)
        query += moment(values[0][1]).format('HH:mm:ss');
      else
        query += '기록 없음';
      query += '</td></tr>';
      $('#manage_table_body_by_date').append(query);
    });
  }

  function attachRecordToTableForName(records) {
    _.each(records, function(record) {
      var query = '<tr><td>' + record.format('YYYY/MM/DD') + '</td><td>' + record.format('HH:mm:ss') + '</td></tr>';
      $('#manage_table_body_by_name').append(query);
    });
  }
});