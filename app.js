var net = require('net');
var http = require('http');


var _data = '';
//The url we want is `www.nodejitsu.com:1337/`
var options = {
  host: 'http://localhoast',
  path: '/',
  //since we are listening on a custom port, we need to specify it by hand
  port: '9000',
  //This is what changes the request to a POST request
  method: 'POST',
  headers: {'Content-Type': 'message/http'}
};
var server = net.createServer();

server.on("connection", function(socket){
	console.log("new client connection is made with: %j" + socket.address());
	console.log("local address:  %s" + socket.localAddress());
	console.log("local address:  %d" + socket.localPort());
	//open a new socket with the http server


	socket.on("data", function(data){
		_data += data;
	});

	socket.once("close", function(){
		callback = function(response) {
		  var str = '';

		  //another chunk of data has been recieved, so append it to `str`
		  response.on('data', function (chunk) {
		    str += chunk;
		  });

		  //the whole response has been recieved, so we just print it out here
		  response.on('end', function () {
		    console.log(str);
		  });
		}

		var req = http.request(options, callback).end(); 
		req.write(_data); // Posting the data that 
		req.end();
	});

	socket.on("error",function(err){
		_data = err.getMessage();
	});
});

server.listen(process.env.PORT || 5000, function(){
	console.log("server is listening to %j", server.address());
});