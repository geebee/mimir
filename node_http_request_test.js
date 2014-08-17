var http = require("http");

var server = http.createServer(function (req, res) {
  var body = '';
  req.on('data', function(chunk) {
    body += chunk.toString();
  });
  req.on('end', function() {
    res.end();
    console.log("request method: %s; request body: %s", req.method, body);
  });
}).listen(8080, '127.0.0.1');

function simpleRequest(isGet, cb) { 
  var options= {
    hostname: 'localhost',
    port: 8080,
    path: '/',
    method: isGet ? 'GET' : 'POST',
    headers: {'Content-Type': 'application/json'}
  };

  var r = http.request(options, function(res){console.log('status code: %d', res.statusCode);});
  r.write('{"foo":"bar"}');
  r.on('close', function() {
    console.log('r is ended');
  });
  r.end();
  cb();
};

console.log("about to run the request as a get, from 'http.request'");
simpleRequest(true, function(){
  console.log("about to run the request as a post, from 'http.request'");
  simpleRequest(false, function() {
    console.log("about to run the test as a get, from 'net.connect'");
    var net = require('net');
    var httpPacket = 'GET / HTTP/1.1\nContent-Type: application/json\nContent-Length: 13\n\n{"foo":"bar"}\n';
    var client = net.connect({host: 'localhost', port: 8080}, function() {
      client.write(httpPacket);
      client.end();
      console.log("finished");
    });
  });
});

