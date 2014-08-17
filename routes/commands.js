var tailHandler = require("../handlers/tailHandler");
var commandHandler = require("../handlers/commandHandler");

module.exports = function(apiServer){
  // Most specific routes first (for speed)
  // Short-hand routes for common and useful variations
  apiServer.get('/cmd/tail/f', tailHandler.stream);
  
  // Generic 'command' route
  apiServer.get('/cmd/:command', commandHandler.command);
  apiServer.post('/cmd/:command', commandHandler.command);

};
