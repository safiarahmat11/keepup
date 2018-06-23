import * as messaging from "messaging";
import { HeartRateSensor } from "heart-rate";

var timestamp=0;

var hrm = new HeartRateSensor();


console.log("App Started");
var document = require('document');

//When a button is pressed
document.onkeypress = function (e) {
    console.log("Key pressed: " + e.key);
    //Create obkect containing details of button
    var display = document.getElementById("response");
    display.text = e.key;
    var data = {'key' : e.key}
      if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
          //Send object as JSON string to companion
          messaging.peerSocket.send(JSON.stringify(data));
      }
};

hrm.onreading = function() {
  console.log("Current heart rate: " + hrm.heartRate);
  console.log(timestamp-Date.now());
  timestamp=Date.now()
  
  var data = [];
  data.push({
    timestamp:Date.now(),
    value:hrm.heartRate,
    label:'hr'
  });
  messaging.peerSocket.send(JSON.stringify(data));
}

hrm.start();




//When companion sends a message
messaging.peerSocket.onmessage = evt => {
  //Write to the display
  var display = document.getElementById("response");
  display.text = evt.data;
}
