import * as messaging from "messaging";


import { me } from "companion"

console.log("Companion Running ");

//Server where the API is runnong (must be HTTPS)
const host = "https://kcfojvchif.execute-api.us-east-2.amazonaws.com/prod";

// The Device application caused the Companion to start
var myHeaders = new Headers();
myHeaders.append('Content-Type', 'application/json');

if (me.launchReasons.peerAppLaunched) {
  // The Device application caused the Companion to start
  console.log("Device application was launched!")
}

//When the watch sends a message
messaging.peerSocket.onmessage = evt => {

  var url = host + "/writedata"; // add a path to the URL

  var data = evt.data;;
  console.log("hello");

  fetch(url, {
      method : "POST",
      headers : myHeaders,
      body: JSON.stringify(data)},3000) // Build the request
    .then(function(response){
      return response.json();
    }) //Extract JSON from the response
    .then(function(data) { 
      console.log(JSON.stringify(data));
  //    messaging.peerSocket.send(JSON.stringify(data)); 
  }) // Send it to the watch as a JSON string
    .catch(function(error) {
      console.log("hamza3");
      console.log(error);}); // Log any errors with Fetch
}