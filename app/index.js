import * as messaging from "messaging";
import { HeartRateSensor } from "heart-rate";
import { Accelerometer } from "accelerometer";
import { user } from "user-profile";
import { today } from "user-activity";
import { me as device } from "device";

var hrm   = new HeartRateSensor();
var accel = new Accelerometer({ frequency: 1 });

console.log("App Started");
var document = require('document');

//When a button is pressed
document.onkeypress = function (e) {
  
    console.log("Key pressed: " , e.key);
  
    //Create obkect containing details of button
    var display = document.getElementById("response");
    display.text = e.key;
  
    var data = {'key' : e.key}
    
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        //Send object as JSON string to companion
        messaging.peerSocket.send(JSON.stringify(data));
    }
};

accel.onreading = function() {
  
  // accelerometer date
  var ts      = Date.now();
  var accel_x = accel.x;
  var accel_y = accel.y;
  var accel_z = accel.z;

  
  console.log("Accelerometer data { ts:", ts, "x:", accel_x, "y:", accel_y, "z:", accel_z, "}");

  var data = [];
  data.push(
    {
      username      : "Luke",
      label         : "accelx",
      unixtimestamp : ts,
      reading       : accel_x
    },
    {
      username      : "Luke",
      label         : "accely",
      unixtimestamp : ts,
      reading       : accel_y
    },
    {
      username      : "Luke",
      label         : "accelz",
      unixtimestamp : ts,
      reading       : accel_z
    }
  );
  
  messaging.peerSocket.send(JSON.stringify(data));
  
}

hrm.onreading = function() {
  
  // heartrate data
  var ts      = Date.now();
  var hr      = hrm.heartRate;
  var hr_rest = (user.restingHeartRate) ? user.restingHeartRate : -1;
  var hr_exer = (hr_rest > 0) ? (hr_rest * 1.7) : -1;
  var steps   = (today.local.steps) ? today.local.steps : 0;

  
  console.log("Heartrate data { ts:", ts, "hr:", hr, "rest:", hr_rest, "exercise:", hr_exer, "}");
  
  var data = [];
  data.push(
    {
      username      : "Luke",
      label         : "hr",
      unixtimestamp : ts,
      reading       : hr
    },
    {
      username      : "Luke",
      label         : "hrrest",
      unixtimestamp : ts,
      reading       : hr_rest
    },
    {
      username      : "Luke",
      label         : "hrexer",
      unixtimestamp : ts,
      reading       : hr_exer
    },
    {
      username      : "Luke",
      label         : "steps",
      unixtimestamp : ts,
      reading       : steps
    }
  );
  
  messaging.peerSocket.send(JSON.stringify(data));
  
}

hrm.start();
accel.start();


//When companion sends a message
messaging.peerSocket.onmessage = evt => {
  //Write to the display
  var display = document.getElementById("response");
  display.text = JSON.stringify(evt.data);
}
