var tailHandler = require("../handlers/tailHandler");

module.exports = function(apiServer){
    apiServer.get('/tail', tailHandler.regular);
    apiServer.get('/tail/f', tailHandler.stream);
};
