$(function() {
  const LENGTH_OF_WEEK = 6;
  const SUNDAY_NUMBER = 0;
  const SATURDAY_NUMBER = 6;

  var myAttendInfo = [];
  var selectedDate = moment();
  updateCurrentTime();
  getMyAttend();

  function getMyAttend() {
    $.ajax({
      type: "GET",
      url: '/attend',
      data: {},
      success: function(data) {
        if (data.status === "ok") {
          myAttendInfo = _.map(data.result, function (record) {
            return moment(record);
          });
          getMyAttendSuccessCallback();
        } else if (data.status === "NotLogin") {
          alert('로그인 해주세요~ :)');
          location.href = "login.html";
        } else {
          alert('get attend -> 서버 에러' + JSON.stringify(data));
          location.href = "error.html";
        }
      },
      error: function(data) {
        alert('get attend -> 서버 에러' + JSON.stringify(data));
        location.href = "error.html";
      },
      dataType: 'json'
    });
  }

  function getMyAttendSuccessCallback() {
    makeAttendanceCalendar();
    addEvent();
  }

  function updateCurrentTime()
  {
  	var date = moment().format('MMMM Do YYYY, h:mm:ss a');
  	var currentTime = date;
  	$('#current_time').text(currentTime);
    setTimeout(updateCurrentTime, 1000);
  }

  function addEvent() {
    addRewardEvent();

    $('#attend_button').click(function() {
        $.ajax({
          type: "POST",
          url: '/attend',
          data: {},
          xhrFields: { withCredentials:true },
          success: function(data) {
            if(data.status === "ok") {
              alert('지각은 마음의 병 출첵 완료!!');
              location.reload();
            } else if (data.status === "NotLogin") {
              alert('로그인 해주세요~ :)');
              location.href = "login.html";
            } else {
              alert('post attend -> 서버 에러' + JSON.stringify(data));
              location.href = "error.html";
            }
          },
          error: function(data) {
            alert('post attend -> 서버 에러' + JSON.stringify(data));
            location.href = "error.html";
          },
          dataType: 'json'
        });
    });

    $('#go_before_month_button').click(function() {
      selectedDate.subtract(1, 'month');
      makeAttendanceCalendar();
      addRewardEvent();
    });

    $('#go_next_month_button').click(function() {
      selectedDate.add(1, 'month');
      makeAttendanceCalendar();
      addRewardEvent();
    });

    function addRewardEvent() {
      $('.attendance_table_attend_reward').click(function() {
        alert("뿌듯함 +100");
      });
    }
  }

  function makeAttendanceCalendar() {
    removeAllRowsExceptTableFrame();

    var calendarTable = $('#attendance_table');
    var year = selectedDate.year();
    var month = selectedDate.month();
    var date = selectedDate.date();
    var query = '';

    query += createDummyColumnQueryBeforeFirstDay(year, month);
    query += createMonthColumnQuery(year, month);
    query += createDummyColumnQueryAfterLastDay(year, month);

    calendarTable.append(query);
    setCurrentYearAndMonthUI();
  }

  function removeAllRowsExceptTableFrame() {
    $('#attendance_table tr:not(.attendance_table_frame)').remove();
  }

  function setCurrentYearAndMonthUI () {
    var currentYearAndMonthUi = $('#current_year_month');
    currentYearAndMonthUi.text(selectedDate.format("YYYY년 MM월"));
  }

  function createMonthColumnQuery (year, month) {
    var query = '';
    for (var i = 1; i <= getLastDateOfMonth(year, month); i++) {
      if(isSunday(year, month, i)) {
        query += makeSundayColumnQuery(year, month, i);
      } else if (isSaturday(year, month, i)) {
        query += makeSaturdayColumnQuery(year, month, i);
      } else {
        query += makeWeekdayColumnQuery(year, month, i);
      }
    }
    return query;
  }

  function createDummyColumnQueryBeforeFirstDay(year, month) {
    var query = '';
    if (getFirstDayOfMonth(year, month) != SUNDAY_NUMBER) {
      query += '<tr class="active attendance_table_row">';
    }

    for (var i = SUNDAY_NUMBER; i < getFirstDayOfMonth(year, month); i++) {
      query += '<td></td>';
    }

    return query;
  }

  function  createDummyColumnQueryAfterLastDay (year, month) {
    var query = '';
    for (var i = getLastDayOfMonth(year, month); i < LENGTH_OF_WEEK; i++) {
      query += '<td></td>';
    }

    if (getLastDayOfMonth(year, month) != LENGTH_OF_WEEK) {
      query += '</tr>';
    }
    return query;
  }

  function makeSundayColumnQuery(year, month, date) {
    var createNewRowQuery = '<tr class="active attendance_table_row">';
    if (isToday(year, month, date))
      return createNewRowQuery + '<td class="sunday_text attendance_table_today">' + date + '</td>';
    else
      return createNewRowQuery + '<td class="sunday_text">' + date + '</td>';
  }

  function makeSaturdayColumnQuery(year, month, date) {
    var endRowQuery = '</tr>';
    var rewardObject = '<div class="attendance_table_attend_reward"></div>';
    if (isToday(year, month, date))
      return '<td class="saturday_text attendance_table_today">' + date + rewardObject + '</td>' + endRowQuery;
    else
      return '<td class="saturday_text">' + date + rewardObject + '</td>' + endRowQuery;
  }

  function makeWeekdayColumnQuery(year, month, date) {
    var attendanceRecordDate = getAttendanceRecordDate(year, month, date);

    if (isToday(year, month, date) && attendanceRecordDate) {
      $('#attend_button').attr('disabled', 'disabled');
    }

    var query = '';
    if (isToday(year, month, date)) {
      query += '<td class="attendance_table_today">' + date + makeAttendanceTimeQuery(attendanceRecordDate) + '</td>';
    }
    else {
      query += '<td>' + date + makeAttendanceTimeQuery(attendanceRecordDate) + '</td>';
    }

    return query;
  }

  function makeAttendanceTimeQuery(attendanceRecordDate)
  {
    const LIMIT_HOUR = 9;
    const LIMIT_MINUTE = 30;

    if (!attendanceRecordDate)
      return '';

    var attenanceQuery;
    var limitTime = attendanceRecordDate.clone();
    limitTime.hour(LIMIT_HOUR);
    limitTime.minute(LIMIT_MINUTE);

    if (attendanceRecordDate.diff(limitTime) < 0)
      return '<span class="attendance_table_attend_time">' + attendanceRecordDate.format("HH:mm:ss") + '</span>';
    else
      return '<span class="attendance_table_attend_time attend_late">' + attendanceRecordDate.format("HH:mm:ss") + '</span>';
  }

  function getAttendanceRecordDate (year, month, date) {
    var dateToFind = moment(new Date(year, month, date));
    var filteredData = _.filter(myAttendInfo, function(record) {
      return record.year() === dateToFind.year() && record.month() === dateToFind.month() && record.date() === dateToFind.date();
    });

    if (filteredData.length === 0)
      return null;
    else
      return filteredData[0];
  }

  //Sunday
  function isSunday(year, month, date) {
    return moment(new Date(year, month, date)).day() === SUNDAY_NUMBER;
  }

  //Saturday
  function isSaturday(year, month, date) {
    return moment(new Date(year, month, date)).day() === LENGTH_OF_WEEK;
  }

  function getFirstDayOfMonth(year, month) {
    return moment(new Date(year, month, 1)).day();
  }

  function getLastDayOfMonth(year, month) {
    return moment(new Date(year, month, getLastDateOfMonth(year, month))).day();
  }

  function getLastDateOfMonth(year, month) {
    return moment(new Date(year, month + 1, 1)).subtract(1, 'day').date();
  }

  function isToday(year, month, date) {
    var date = moment(new Date(year, month, date));
    var today = moment();
    return date.year() === today.year() && date.month() === today.month() && date.date() === today.date();
  }
});