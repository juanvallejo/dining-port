#!/bin/env node

/**
* Provided under the MIT License (c) 2014
* See LICENSE @file for details.
*
* @file local.js
*
* @author juanvallejo
* @date 4/24/15
*
* Small server application. Integrates with Red Hat's OPENSHIFT platform.
* Can be used for pretty much any app though.
*
**/

var SERVER_HOST 			= process.env.OPENSHIFT_NODEJS_IP 	|| '127.0.0.1';
var SERVER_PORT				= process.env.OPENSHIFT_NODEJS_PORT || 8000;
var SERVER_HEAD_OK			= 200;
var SERVER_HEAD_NOTFOUND 	= 404;
var SERVER_HEAD_ERROR 		= 500;
var SERVER_RES_OK 			= '200. Server status: OK';
var SERVER_RES_NOTFOUND		= '404. The file you are looking for could not be found.';
var SERVER_RES_ERROR 		= '500. An invalid request was sent to the server.';

var fs = require('fs');
var http = require('http');
var util = require('util');
var exec = require('child_process').exec;

var server = http.createServer(function(req,res) {
	var path = req.url == '/' ? '/index.html' : req.url;

	if(path.split("?")[1]) path = path.split("?")[0];

	var file = path.split('.');
	var filetype = file[file.length-1];
	var mimetype = {
		'css':'text/css',
		'js':'application/javascript',
		'html':'text/html',
		'json':'application/json',
		'text':'text/plain',
		'xml':'application/xml'
	};
	var api;
	var data;

	if(api = req.url.match(/(\/apis\/)(.*)/gi)) {
		api = api[0].split('/apis/')[1];
		if(api.match(/http:\/\/www.cnusports.com(.*)/gi)) {
			var url = 'http://www.cnusports.com/calendar.ashx/calendar.rss?sport_id=8';
			var child = exec('curl '+url,function(error,stdout,stderr) {
				if(error) {
					res.writeHead(500);
					res.end('An error occurred attempting to get the http content for this api.');
					return console.log(error);
				}

				res.writeHead(200,{'Content-Type':mimetype['xml']});
				res.end(stdout);
			});
		} else {
			data = '';
			http.get(api,function(response) {
				response.on('data',function(chunk) {
					data += chunk;
				});
				response.on('end',function() {
					res.writeHead(200,{'Content-Type':mimetype['xml']});
					res.end(data);
				});
			}).on('error',function(err) {
				res.writeHead(500);
				res.write('There was an error requesting the api \''+api+'\'\n');
				res.end(err.message);
			});
		}
	} else {
		if(req.url.match(/\/cordova.js/gi)) {
			res.writeHead(200,{'Content-Type':mimetype['js']});
			res.end();
		} else {
			fs.readFile(__dirname+path,function(err,data) {
				if(err) {
					res.writeHead(404);
					return res.end("404: This page was not found.");
				}

				res.writeHead(200,{'Content-Type':mimetype[filetype]});
				res.end(data);
			});
		}
	}
}).listen(SERVER_PORT, SERVER_HOST);

