var spawn = require("child_process").spawn;
var allowedCommands = {
  tail : true,
  cat: true,
  ls: true,
  du: true,
  dh: true,
};

exports.command = function(req, res, next) {
  /* Standard JSON Object
  {
    "file": "",
    "size": 0,
    "args": [],
    "pipe": {
      "command": "",
      "args": [],
      "pipe": {...}
    }
  }
  */
  console.log("handler 'generic command'. '%s' passed", req.params.command );
  console.log("req.params:\n%s", JSON.stringify(req.params));
  if (!allowedCommands[req.params.command]){
    console.log("'%s', was not in the whitelist, returning 403", req.params.command);
    res.send(403, {"error": "'" + req.params.command + "' is not in the whitelist", "whitelist": Object.keys(allowedCommands)});
  };

  var passedFile = req.params.file
  var command = spawn(req.params.command, [passedFile]);

  console.log("starting the '%s'", req.params.command);
  console.log("file to '%s': '%s'", req.params.command, passedFile);

  command.stdout.setEncoding("utf8"); //Ensures output is string and not a Buffer object
  command.stdout.on("data", function(data) {
    console.log("'%s' process wrote to stdout", req.params.command);
    console.log(data);
    res.contentType = "text";
    res.send(data);
  });

  command.stderr.setEncoding("utf8"); //Ensures output is string and not a Buffer object
  command.stderr.on("data", function(data) {
    console.log("'%s' process wrote to stderr. text was:\n-----\n%s\n-----", req.params.command, data);
    res.send(400, {"error": "'" + req.params.command + "' process wrote to stderr", "stderr": data});
  });

  command.on("exit", function(code) {
    console.log("'%s' process exited", req.params.command);
    if (code !== 0){
      console.log("'%s' process did not exit cleanly. code was: %s", req.params.command, code);
      res.send(500, {"error": "'" + req.params.command + "' process did not exit cleanly", "exitCode": code});
    }
  });

};
