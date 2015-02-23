var http = require('http');
var fs = require('fs');

var options = {
	path: 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=nickskelton101&api_key=4eb3cc7816bc86b302c85c2f0e2aa0f8&limit=1&format=json',
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
		var jsonResponse = JSON.parse(str);

		$("#txt").text(jsonResponse.recenttracks.track[0].artist);
	});
};

http.request(options, callback).end();