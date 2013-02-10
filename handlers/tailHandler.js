var spawn = require("child_process").spawn;

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
