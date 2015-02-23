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

function requestNowPlayingFromLastFm() {
	var options = {
		path: 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=' + userNameToFollow + '&api_key=' + api_key + '&limit=1&format=json',
		headers: {
			Host: "ws.audioscrobbler.com"
		}
	};

	if (process.env.NODE_ENV === 'production') {

	} else {
		options.host = "wp.sixt.de";
		options.port = 8080;
	}
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

	http.request(options, callback).end();
}

setInterval(function() {
	requestNowPlayingFromLastFm();
}, 5000);

var port = (process.env.PORT || 8080);

app.listen(port, function() {
	console.log("Listening on " + port);
});