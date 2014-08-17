/*
var http = require("http");

var postOptions = {
  hostname: 'localhost',
  port: 9999,
  path: '/cmd/cat',
  method: 'POST',
  headers: {'Content-Type': 'application/json'}
};
var getOptions= {
  hostname: 'localhost',
  port: 9999,
  path: '/cmd/cat',
  method: 'GET',
  headers: {'Content-Type': 'application/json'}
};

var responseCallback = function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
};

console.log("AS POST");
var postReq = http.request(postOptions, responseCallback).on('error', function(e) {
  console.log('problem with request: ' + e.message);
});
postReq.write('{"file": "/tmp/test.txt"}');
postReq.end();

console.log("AS GET");
var getReq = http.request(getOptions, responseCallback).on('error', function(e) {
  console.log('problem with request: ' + e.message);
});
getReq.write('{"file": "/tmp/test.txt"}');
getReq.end();
*/

var net = require('net');

var path = '/cmd/cat';
var body = '{"file":"/tmp/test.txt"}';
var httpPacket = 'GET ' + path + ' HTTP/1.1\nContent-Type: application/json\nContent-Length: ' + body.length + '\n\n' + body + '\n';

var client = net.connect({host: 'localhost', port: 9999}, function() {
  console.log('client connected');
  client.write(httpPacket);
});
client.on('data', function(data) {
  //console.log('data recieved');  
  console.log(data.toString());
  client.end();
});
client.on('end', function() {
  console.log('client disconnected');
});
