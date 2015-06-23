$(function(){

  $.ajax({
    type: "GET",
    url: '/attend',
    success: function(data) {
      if (data.status === "ok") {
        var myAttendInfo = _.map(data.result, function (record) {
          return moment(record);
        });
        attachRecordToTable(myAttendInfo);
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

  function attachRecordToTable(records) {
    _.each(records, function(record) {
      var query = '<tr><td>' + record.format('YYYY/MM/DD') + '</td><td>' + record.format('HH:mm:ss') + '</td></tr>';
      $('#my_table_body').append(query);
    });
  }
})