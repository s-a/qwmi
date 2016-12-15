#!/usr/bin/env node

"use strict";

var fs = require("fs");
var path = require("path");

var Cli = new require("n-cli");
var cli = new Cli({
	silent: true,
	handleUncaughtException : true,
	// runcom : runcomFilename
});


var queryFilename = cli.resolvePath(cli.argv._[0]);
var config = fs.readFileSync(queryFilename).toString();
config = JSON.parse(config);
 
var wmi = require('node-wmi');
wmi.Query(config.query, function(err, wmiData) {
	var response = config.response;
	var data = [];
	if (wmiData){
		for (var i = wmiData.length - 1; i >= 0; i--) {
			var row = wmiData[i];
			for(var key in row){
				if (row.hasOwnProperty(key)){			
					var newRow = {
						"name": key,
						"value": row[key] || "-"
					}
					data.push(newRow);
				}
			}

		}
	}
	if (data.length !== 0){	
		response.fields = data;
	  	console.log(JSON.stringify(response, null, 4));
	}
});