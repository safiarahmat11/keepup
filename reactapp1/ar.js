var ts = require("timeseries-analysis");

// The sin wave

var data = [1,2,3,5,6];


var t     = new ts.main(ts.adapter.fromArray(data));
 
// We're going to forecast the 11th datapoint
var forecastDatapoint = data.length;

console.log(t.data.slice(0,data.length));
 
// We calculate the AR coefficients of the 10 previous points
var coeffs = t.ARMaxEntropy({
    data: t.data.slice(data.length-3,data.length),
    degree: 2
});
 
// Output the coefficients to the console
console.log(coeffs);
 
// Now, we calculate the forecasted value of that 11th datapoint using the AR coefficients:
var forecast = 0;
// Init the value at 0.
for (var i=0;i<coeffs.length;i++) { // Loop through the coefficients
    forecast -= t.data[data.length-i-1][1]*coeffs[i];
    // Explanation for that line:
    // t.data contains the current dataset, which is in the format [ [date, value], [date,value], ... ]
    // For each coefficient, we substract from "forecast" the value of the "N - x" datapoint's value, multiplicated by the coefficient, where N is the last known datapoint value, and x is the coefficient's index.
}
console.log("forecast",forecast);
