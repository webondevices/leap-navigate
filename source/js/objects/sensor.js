LeapApp.sensor = (function (app) {

	var obj = {};

	// Sensor measurements in mms
	obj.w = 76.20;
	obj.h = 30.48;

	// Sensor distances from the monitor in cms
	// Use the sensor size as a ference without a ruler
	// h : horizontal offset from the center of the monitor
	// v : vertical offset from the bottom of the monitor
	// d : distance from the surface of the monitor
	obj.distance = {
		h : 0,
		v : - obj.w * 1,
		d : - obj.w * 2,
		// Definition for the for loop
		def : ["h", "v", "d"]
	};

	var fingerBase = [],
		fingerTip = [],
		fingerBaseAbsolute = [],
		fingerTipAbsolute = [],
		fingerAngles = [];

	// Calculating the Y cursor coords
	obj.getCoords = function(direction){
		var monitor1 = document.getElementById('monitor1');
		var monitor2 = document.getElementById('monitor2');
		var monitor3 = document.getElementById('monitor3');

		var distance = fingerBaseAbsolute[2],
			fingerAngle = Math.abs(fingerAngles[direction]),
			fingerDirection = fingerAngles[direction] < 0 ? -1 : +1,
			fingerBase = fingerBaseAbsolute[direction],
			monitorAngle = Math.PI - (Math.PI / 2) - fingerAngle,
			monitorProjection = distance / Math.tan(monitorAngle);

		return fingerBase + (fingerDirection * monitorProjection);
	}

	// Calculating the cursor coords where the finger is pointing on the screen
	obj.calculateCoords = function(finger){

		for(var i = 0; i < 3; i++ ){

			// Storing the X, Y, Z coords of the finger base and tip
			fingerBase[i] = finger.mcpPosition[i];
			fingerTip[i] = finger.stabilizedTipPosition[i];

			// Calculating and storing the absolute X, Y, Z coords of the finger base and tip relative to the screen position
			fingerBaseAbsolute[i] = fingerBase[i] + obj.distance[ obj.distance.def[i] ] + (app.monitor.w / 2);
			fingerTipAbsolute[i]  = fingerTip[i]  + obj.distance[ obj.distance.def[i] ] + (app.monitor.w / 2);

			// Calculating and storing the finger angles in radians
			fingerAngles[0] = finger.direction[0];
			fingerAngles[1] = finger.direction[1];

		}

		return {
			xCoord: obj.getCoords(0),
			yCoord: obj.getCoords(1)
		}

	}

	return obj;

})(LeapApp);