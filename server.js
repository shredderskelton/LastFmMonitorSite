var http = require('http');
var fs = require('fs');

var lastPlayedResponse;

var userNameToFollow = process.env.USERNAME;
var api_key = process.env.APIKEY;

http.createServer(function(req, res) {

	if (req.url == "/nowplaying") {
		res.writeHead(200, {
			'Content-Type': 'text/json'
		});
		res.end(JSON.stringify(lastPlayedResponse));
		return;
	}

	fs.readFile("index.html", function(err, text) {
		res.setHeader("Content-Type", "text/html");
		res.end(text);
	});


}).listen(1337, '127.0.0.1');

function requestNowPlayingFromLastFm() {

	var options = {
		host: "wp.sixt.de",
		port: 8080,
		path: 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=' + userNameToFollow + '&api_key=' + api_key + '&limit=1&format=json',
		headers: {
			Host: "ws.audioscrobbler.com"
		}
	};

	callback = function(response) {
		if (response.statusCode != 200) {
			console.log("Error from server " + response.statusCode);
		}
		var str = '';
		//another chunk of data has been recieved, so append it to `str`
		response.on('data', function(chunk) {
			str += chunk;
		});
		//the whole response has been recieved, so we just print it out here
		response.on('end', function() {
			// console.log(str);
			lastPlayedResponse = JSON.parse(str);

			// $("#txt").text(jsonResponse.recenttracks.track[0].artist);
		});
	};

	http.request(options, callback).end();

}

setInterval(function() {
	requestNowPlayingFromLastFm();
}, 5000);

console.log('Server running at http://127.0.0.1:1337/');