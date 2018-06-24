/*jslint node: true, esversion:6 */
import React, { Component } from 'react';
import './App.css';
import Header from '../Views/header';
import CircularProgressbar from 'react-circular-progressbar';
import './specificresultscontainer.css'
import axios from 'axios';
import hr from '../img/hr.png'


import { Row, Grid, Panel, formgroups, Alert, Col} from 'react-bootstrap';

import  {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine} from 'recharts';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';


class App extends Component { 

	constructor(props) {
	    super(props);
	    
	    this.state = {
	    	stressLevel:82,
	    	data:[{
	    		unixtimestamp:93,
	    		hr:85
	    	},{
	    		unixtimestamp:95,
	    		hr:87
	    	}],
	    	processedData:[],
	    	state:0,
	    	timestamp:1529837000000,
	    	history:[],
	    	heartrate:65
		}
 	};




 	componentDidMount() {	
 		// this.triggerEverySecond();
   		   		
	}

	things_to_consider(fb_data) {
		var history = this.state.history;
		var data= this.state.data;
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

	    var timestamp=this.state.timestamp;

	    var vulnerabilitystate = this.state.stress;
	    var hratestate = this.state.heartrate;
	    
	    fb_data.forEach(function(o) {

	    	
	    	// timestamp=o.unixtimestamp;

	    	




	      if (history.length < 60) {

	        if (o.hr > 0 && o.accelx > 0 && o.accely > -1 && o.accelz > -1){
	          history.push(o)
	        }

	        

	        

	      } else {

	      	accel_average=0;

	        // calculate average accelerometer data for previous 60 seconds
	        history.forEach(function(e) {
	            accel_average += (Math.sqrt((Math.pow(e.accelx, 2) + Math.pow(e.accely, 2) + Math.pow(e.accelz, 2))) );
	        });

	        // calculate exercise intensity


	        if ((o.hr > (o.hrrest * mildExHRMultiplier)) && (accel_average > mildExAccelThreshold)) {
	          exercise_intensity = ((hrWeight*(o.hr-o.hrrest))) + (accelWeight*(accel_average-60*9.81)) + cModerateExer;
	        } else if ((o.hr > (o.hrrest * modExHRMultiplier)) && (accel_average > modExAccelThreshold)) {
	          exercise_intensity = ((hrWeight*(o.hr-o.hrrest))) + (accelWeight*(accel_average-60*9.81)) + cIntenseExer;
	        } else {
	          exercise_intensity = ((hrWeight*(o.hr-o.hrrest))) + (accelWeight*(accel_average-60*9.81));
	        }


	        exercise_intensity = Math.abs(exercise_intensity);
	        
	        rrIntervalSumSq=0;

	        // calculate psychological vulnerability
	        for (var n = 44; n < 59; n++) {
	          rrIntervalSumSq += Math.pow((60 / history[n+1].hr) - (60 / history[n].hr), 2);
	        }

	        if (rrIntervalSumSq >= 1) {
	        	rrIntervalSumSq = Math.log(rrIntervalSumSq);
	        }


	        

	        // compute heartrate variability
	        hrVariability = Math.sqrt((1 / (rmssdWindow - 1)) * rrIntervalSumSq)
	        vulnerability = 1 / hrVariability;

	        

	        // update history with next object in fd_data
	        history.shift();
	        history.push(o);

	        
	        o.exerciseIntensity = exercise_intensity;
	        o.vulnerability     = vulnerability

	        vulnerabilitystate=vulnerability;

	        // push updated object to data array
	        data.push(o);
	        hratestate=o.hr;

	        





	      }
	    });  

	    
	    // console.log(data);

	    console.log(hratestate);
	    
	    this.setState({
	    	history:history,
	    	data:data,
	    	stressLevel:Math.round(vulnerabilitystate*10),
	    	heartrate:hratestate
	    });

	    
	  }

	 	triggerEverySecond(){

	 		alert('fhddd');

	 		
	 		
	 		var abb=setInterval(function(){

	 			console.log(Date.now());

	 			var params={
	 			unixtimestamp: Date.now()-20000
	 		}
	 	
	 			axios.get('https://jccz1ryij4.execute-api.us-east-2.amazonaws.com/prod/aggrdata/',{ 
		    		params: params
		  		})
				.then(function (response) {
					

					var currentData=response.data;

					console.log(currentData);

					var data = this.state.data;




					currentData.forEach(function(eachdata){

						if(eachdata["hr"]!=-1){
							data.push(eachdata);	
						}
						

					})


					var heartrate = 65;


					if(data.length>0){
						heartrate=data[data.length-1].hr;
					}
					

					this.setState({
						
						data:data,
						heartrate:heartrate
					})


				}.bind(this))
				.catch(function (error) {
		    		
		  		});
	 			
			}.bind(this), 1000);
	 	}


	  render() {

	  	var temp = this.state.data;

	  	console.log(temp);

	  	var heartrate = 56

	  	if((temp.length)>0){
	  		heartrate=temp[temp.length-1].heartrate


	  	}







	  	
	  	
	    return (
	    <Router>
	    	<div id= "container">
	    		<Header />
	      		<div className="App">
	      			<Grid> 

	          			<Col xs={12} md={12}>
	          				<center><h5><b>Current Stress Level:</b></h5>
	          				<CircularProgressbar percentage={(this.state.heartrate)%75+35} /></center>
	          			</Col>
	          			<Col xs={12} md={12}>
	          				<center><h5><b>Heart Rate:</b> </h5>
	          				<img  className="hr"  src={hr} onClick={()=>{this.triggerEverySecond()}}  />
	          				<br/>
	          				{this.state.heartrate-4}
	          				</center>

	          				
	          			</Col>

	          			<Col xs={12} md={12}>
	          				<center><h5><b>HeartRate Graph</b> </h5>
	          				<LineChart width={200} height={300} data={this.state.data.slice(this.state.data.length-1000, this.state.data.length-1)}
            margin={{top: 0, right: 0, left: 0, bottom: 5}}>
       <XAxis dataKey="name"/>
       <YAxis/>
       <CartesianGrid strokeDasharray="3 3"/>
       <Tooltip/>
       <Legend />
       <Line type="monotone" dataKey="hr" stroke="#8884d8" activeDot={{r: 8}}/>
      
      </LineChart>		





	          				</center>

	          				
	          			</Col>

	          			
	        		</Grid>

		        </div>
	        </div>
	    </Router>
	    );
	  }
	}

export default App; 