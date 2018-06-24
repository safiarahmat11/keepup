const stress_flags = {
  NORMAL   : 'no apparent stress',            // no sign of stress
  RECOVERY : 'period of recovery',            // recovering from stressful state
  DISTRESS : 'period psychological distress', // stress associated with psychological distress
  EXERCISE : 'period of exercise'             // stress associated with exercise
}

var data = [
  // {
  //   vulnerability     : value,
  //   exerciseIntensity : value,
  //   flag              : stress_flag
  // }
]; // data[n].key

var min_timestamp = 0;
var history       = []; // history of data recieved

function things_to_consider (fb_data) {

  // variables
  var exercise_intensity = 0; // exercise intensity value, to be determined
  var accel_average      = 0; // average accelerometer value, to be determined
  var vulnerability      = 0; // psychological vulnerability value, to be determined
  var rrIntervalSumSq    = 0; // sum of rr interval squared
  var hrVariability      = 0;

  // constants
  const mildExHRMultiplier   = 1;  // mild exercise heartrate multipler
  const mildExAccelThreshold = 1;  // mild exercise accelerometer threshold
  const modExHRMultiplier    = 1;  // moderate exercise heartrate multiplier
  const modExAccelThreshold  = 1;  // moderate exercise acceleromteter threshold
  const cModerateExer        = 1;  // constant for moderate exercise
  const cIntenseExer         = 2;  // constant for intense exercise
  const accelWeight          = 1;  // accelerometer weight
  const hrWeight             = 1;  // heartrate weight
  const rmssdWindow          = 15; // root mean square of successive differences


  // fill history array with first 60 seconds of data
  if (history.len() < 60) {

    // get the first 60 seconds of data
    fb_data.foreach(function(e) {
      history.push(e)
    });

  // start computation
  
    fb_data.foreach(function(o) {

      // calculate average accelerometer data for previous 60 seconds
      history.foreach(function(e) {
        if (e.accelx != -1 && e.accely != -1 && e.accelz != -1) {
          accel_average += ((Math.pow(e.accelx, 2) + Math.pow(e.accely, 2) + Math.pow(e.accelz, 2)) / 60);
        }
      });

      // calculate exercise intensity
      if ((o.hr > (o.hrrest * mildExHRMultiplier)) && (accel_average > mildExAccelThreshold)) {
        exercise_intensity = (hrWeight * o.hr) + (accelWeight * accel_average) + cModerateExer;
      } else if ((o.hr > (o.hrrest * modExHRMultiplier)) && (accel_average > modExAccelThreshold)) {
        exercise_intensity = (hrWeight * o.hr) + (accelWeight * accel_average) + cIntenseExer;
      } else {
        exercise_intensity = (hrWeight * o.hr) + (accelWeight * accel_average);
      }

      // calculate psychological vulnerability
      for (var n = 44; i < 59; i++) {
        rrIntervalSumSq += Math,pow((60 / history[n+1].hr) - (60 / history[n].hr), 2);
      }

      // compute heartrate variability
      hrVariability = Math.sqrt((1 / rmssdWindow - 1) * rrIntervalSumSq)
      vulnerability = 1 / hrVariability;

      // update history with next object in fd_data
      history.shift();
      hisotry.push(o);

      // update exerciseIntensity in object
      o.exerciseIntensity = exercise_intensity;
      o.vulnerability     = vulnerability

      // push updated object to data array
      data.push(o);
    });

  

}
