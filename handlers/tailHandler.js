var spawn = require("child_process").spawn;

exports.regular= function(req, res, next) {
  console.log("handler 'regular tail'");

  var tailFile = "/tmp/test.txt"
  var tail = spawn("tail", [tailFile]);
  console.log("starting the tail");

  tail.stdout.setEncoding("utf8"); //Ensures output is string and not a Buffer object
  tail.stdout.on("data", function(data) {
    console.log("tail process wrote to stdout");
    console.log(data);
    res.contentType = "text";
    res.send(data);
  });

  tail.stderr.setEncoding("utf8"); //Ensures output is string and not a Buffer object
  tail.stderr.on("data", function(data) {
    console.log("tail process wrote to stderr unexpectedly. text was:\n-----\n%s\n-----", data);
    res.send({"error": "tail process wrote to stderr unexpectedly", "stderr": data});
  });

  tail.on("exit", function(code) {
    console.log("tail process exited");
    if (code !== 0){
      console.log("tail process did not exit cleanly. code was: %s", code);
      res.send({"error": "tail process did not exit cleanly", "exitCode": code});
    }
  });

};

exports.stream = function(req, res, next) {
  console.log("handler 'streaming tail'");

  var tailFile = "/tmp/test.txt"
  var tail = spawn("tail", ["-f", tailFile]);
  console.log("starting the tail");

  req.on("end", function() {
    // request ended normally. cannot be called after close
    console.log("request terminated normally. unregistering from new data event and killing the tail.");
    tail.stdout.removeListener("data", arguments.callee);
    tail.kill();
  });

  req.on("close", function() {
    // request closed unexpectedly. can be called after end
    console.log("request terminated unexpectedly. unregistering from the new data event and killing the tail.");
    tail.stdout.removeListener("data", arguments.callee);
    tail.kill();
  });

  tail.stdout.on("data", function(data) {
    res.write(data);
  });

};
