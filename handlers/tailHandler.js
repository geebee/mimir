exports.regular= function(req, res, next) {
  console.log("handler 'regular tail'");

  res.send({information: "regular tail"});
};

exports.stream = function(req, res, next) {
  console.log("handler 'streaming tail'");

  var spawn = require("child_process").spawn;
  var tailFile = "/tmp/test.txt"
  var tail = spawn("tail", ["-f", tailFile]);
  console.log("starting the tail");

  tail.stdout.on("data", function(data) {
    var lines = data.toString().split("\n");
    lines.pop(); // remove trailing ""
    var raw_data = JSON.stringify({
      data: {
        lines: lines
      }
    });

    res.header("Content-Type", "text/json");
    res.header("Content-Length", raw_data.length);
    res.send(raw_data);

    // cleanup
    tail.stdout.removeListener("data", arguments.callee);
  });
};
