
$(document).ready(function(){

//Function to conert time in seconds into an object with hours, minutes, and seconds
function totalToHrMinSec (total){
  hour = Math.floor(total/60/60);
  min = Math.floor((total - (hour*3600))/60);
  sec = (total - (hour*3600) - (min*60)).toFixed(2);

  var hrMinSec = new Object();
  hrMinSec.hour = hour;
  hrMinSec.min = min;
  hrMinSec.sec = sec;

  if (hrMinSec.sec == 60) {
    hrMinSec.min = hrMinSec.min + 1;
    hrMinSec.sec = 0;
  }

  return (hrMinSec);
};

function checkUnits (distance,oldVal,newVal){
  if (oldVal == "miles" && newVal == "yards"){ // miles to yards
    distance = distance * 1760;
  } else if (oldVal == "meters" && newVal == "yards"){ // meters to yards
    distance = distance * 1.09361;
  } else if (oldVal == "miles" && newVal == "meters"){ // miles to meters
    distance = distance * 1609.34;
  } else if (oldVal == "yards" && newVal == "meters"){ //yards to meters
    distance = distance * 0.9144;
  } else if (oldVal == "miles" && newVal == "kilometers") { // miles to km
    distance = distance * 1.60934;
  } else if (oldVal == "kilometers" && newVal == "miles") { // km to miles
    distance = distance * 0.621371;
  }else if (oldVal == "yards" && newVal == "miles") {
    distance = distance * 0.000568182;
  }else if (oldVal == "meters" && newVal == "miles") {
    distance = distance * 0.000621371;
  }else {
    distance = distance;
  }
  return distance;
};

function updateTotal(){
  var eventId = ["s", "b", "r", "1", "2"];
  var time = [];
  for (var i = 0; i < eventId.length; i++) {
    timeHour = Number($("#"+eventId[i]+"th").val());
    timeMin = Number($("#"+eventId[i]+"tm").val());
    timeSec = Number($("#"+eventId[i]+"ts").val());
    time[i] = (timeHour*60*60) + (timeMin*60) + timeSec;
  }
  // console.log(time);
  time = time[0] + time[1] + time[2] + time[3] + time[4];
  // console.log(time);
  time = totalToHrMinSec(time);
  $("#totalTimeHour").val(time.hour);
  $("#totalTimeMin").val(time.min);
  $("#totalTimeSec").val(time.sec);
}

function calc(eventId,fieldId) {
  // console.log("event:"+eventId+", field:"+fieldId);
  distance = $("#" + eventId + "d").val();
  distanceUnit = $("#" + eventId + "du").val();
  paceUnit = $("#"+eventId+"pu").val();
  distance = checkUnits(distance,distanceUnit,paceUnit);
  timeHour = Number($("#"+eventId+"th").val());
  timeMin = Number($("#"+eventId+"tm").val());
  timeSec = Number($("#"+eventId+"ts").val());
  time = (timeHour*60*60) + (timeMin*60) + timeSec;
  if (eventId == "s") {
    distance = distance / 100
  }
  if (eventId == "s" || eventId == "r") {
    paceMin = Number($("#"+eventId+"pm").val());
    paceSec = Number($("#"+eventId+"ps").val());
    pace = (paceMin*60) + paceSec;
  } else if (eventId == "b") {
    pace = Number($("#bp").val());
    pace = (1/pace)*3600;
  }
  if (fieldId == "d" || fieldId == "p") {
    time = pace*distance;
    time = totalToHrMinSec(time);
    $("#"+eventId+"th").val(time.hour);
    $("#"+eventId+"tm").val(time.min);
    $("#"+eventId+"ts").val(time.sec);
  } else if (fieldId == "t") {

    if (eventId == "s" || eventId == "r") {
      pace = time/distance;
      pace = totalToHrMinSec(pace);
      $("#"+eventId+"pm").val(pace.min);
      $("#"+eventId+"ps").val(pace.sec);
    } else if (eventId == "b"){
      pace = distance/time;
      pace = pace*3600;
      $("#bp").val(pace.toFixed(2));
    }
  }
  updateTotal();
}

$("#distanceSelect").change(function() {
  event.preventDefault(); //Prevents page from refreshing on submit button
  var eventDistance = $("#distanceSelect").val();
  if (eventDistance == "sprint"){
    $("#sd").val(750);
    $("#sdu").val("meters");
    $("#bd").val(20);
    $("#bdu").val("kilometers");
    $("#rd").val(5);
    $("#rdu").val("kilometers");
  } else if (eventDistance == "olympic") {
    $("#sd").val(1500);
    $("#sdu").val("meters");
    $("#bd").val(40);
    $("#bdu").val("kilometers");
    $("#rd").val(10);
    $("#rdu").val("kilometers");
  } else if (eventDistance == "half") {
    $("#sd").val(1.2);
    $("#sdu").val("miles");
    $("#bd").val(56);
    $("#bdu").val("miles");
    $("#rd").val(13.1);
    $("#rdu").val("miles");
  } else if (eventDistance == "full") {
    $("#sd").val(2.4);
    $("#sdu").val("miles");
    $("#bd").val(112);
    $("#bdu").val("miles");
    $("#rd").val(26.2);
    $("#rdu").val("miles");
  } else if (eventDistance == "none") {
    $("#sd").val("");
    $("#sdu").val("miles");
    $("#bd").val("");
    $("#bdu").val("miles");
    $("#rd").val("");
    $("#rdu").val("miles");
  }
  var eventId = ["s", "b", "r"];
  for (var i = 0; i < eventId.length; i++) {
    calc(eventId[i],"d");
  }
}) //fills event distance when event changes

//converts distance when units change
$("select[name='distance']")
  .focus(function () {
    previous = this.value;
    })
  .change( function(){
    current = this.value;

    eventId = this.id.slice(0,1) //get event type (s/b/r)
    distance = $("#"+eventId+"d").val();
    distance = checkUnits(distance,previous,current).toFixed(1);
    $("#"+eventId+"d").val(distance);
    previous = current; //set new previous value to the current one
  })

//pace unit conversion
$("select[name='pace']")
  .focus(function () {
    previous = this.value;
  })
  .change( function(){
    current = this.value;
    eventId = this.id.slice(0,1)
    if (eventId == "b") {
      pace = Number($("#bp").val());
      pace = checkUnits(pace,previous,current);
      $("#bp").val(pace.toFixed(2));
    } else {
      timeMin = Number($("#" + eventId + "pm").val());
      timeSec = Number($("#" + eventId + "ps").val());
      time = (timeMin * 60) + timeSec;
      time = checkUnits(time,current,previous); //pass current and previous backwards because min / mile not mile /min
      time = totalToHrMinSec(time);
      $("#" + eventId + "pm").val(time.min);
      $("#" + eventId + "ps").val(time.sec);
    }
    previous = current;
  })

$("input").change(function() {
  eventId = this.id.slice(0,1); // returns s(swim), b(bike), r(run)
  fieldId = this.id.slice(1,2); // returns d(distance), p(pace), or t(time)
  calc(eventId,fieldId);
})


});
