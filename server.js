var express = require('express')
var fs = require('fs');
var http = require('http');
var logfmt = require("logfmt");

var app = express();
app.use(logfmt.requestLogger());

var lastPlayedResponse;
var userNameToFollow = process.env.USERNAMELASTFM;
var api_key = process.env.APIKEY;

app.get('/nowplaying', function(req, res) {
	res.writeHead(200, {
		'Content-Type': 'text/json'
	});
	res.end(JSON.stringify(lastPlayedResponse));
});

app.get('/index.html', function(req, res) {
	console.log("request");
	fs.readFile("index.html", function(err, text) {
		res.setHeader("Content-Type", "text/html");
		res.end(text);
	});
});

app.get('/qrcode.html', function(req, res) {
	console.log("request");
	fs.readFile("qrcode.html", function(err, text) {
		res.setHeader("Content-Type", "text/html");
		res.end(text);
	});
});

app.get('/test.html', function(req, res) {
	console.log("request");
	fs.readFile("test.html", function(err, text) {
		res.setHeader("Content-Type", "text/html");
		res.end(text);
	});
});
app.get('/qrcodedebug.html', function(req, res) {
	console.log("request");
	fs.readFile("qrcodedebug.html", function(err, text) {
		res.setHeader("Content-Type", "text/html");
		res.end(text);
	});
});

app.get('/testdebug.html', function(req, res) {
	console.log("request");
	fs.readFile("testdebug.html", function(err, text) {
		res.setHeader("Content-Type", "text/html");
		res.end(text);
	});
});
app.get('/qrcodebeta.html', function(req, res) {
	console.log("request");
	fs.readFile("qrcodebeta.html", function(err, text) {
		res.setHeader("Content-Type", "text/html");
		res.end(text);
	});
});

app.get('/testbeta.html', function(req, res) {
	console.log("request");
	fs.readFile("testbeta.html", function(err, text) {
		res.setHeader("Content-Type", "text/html");
		res.end(text);
	});
});

function requestNowPlayingFromLastFm() {
	var pathUri = '/2.0/?method=user.getrecenttracks&user=' + userNameToFollow + '&api_key=' + api_key + '&limit=1&format=json';
	//console.log(pathUri);
	var options = {
		path: pathUri,
		host: 'ws.audioscrobbler.com'
			// headers: {
			// 	Host: "ws.audioscrobbler.com"
			// }
	};

	// options.host = "wp.sixt.de";
	// options.port = 8080;

	callback = function(response) {
		if (response.statusCode != 200) {
			console.log("Error from server " + response.statusCode);
		}
		var str = '';
		response.on('data', function(chunk) {
			str += chunk;
		});
		response.on('end', function() {
			lastPlayedResponse = JSON.parse(str);
		});
	};

	var req = http.request(options, callback);

	req.on('error', function(error) {
		console.log(error);
	});

	req.end();
}

setInterval(function() {
	requestNowPlayingFromLastFm();
}, 5000);

var port = (process.env.PORT || 8080);

app.listen(port, function() {
	console.log("Listening on " + port);
});