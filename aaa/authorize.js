module.exports.simpleStub = function (req, res, next) {
    console.log('about to authorize (stub method)');
    return next();
};

module.exports.authorizeRequest = function (req, res, next) {
    console.log('user: %s, verb: %s, route: %s', req.username, req.method, req.path);
    
    //Whitelist of Permissions (in the form of: {"path": "/", "method": "GET"}) that never require authorization
    var whitelistURLs = [{"path": "/", "method": "GET"}, {"path": "/tail", "method": "GET"}, {"path": "/tail/f", "method": "GET"}, {"path": "/test", "method": "GET"}];
    
    //Just in case someone manages to inject this flag into the request from the client side,
    //we will always delete it from the request object at the start of this function.
    delete req.isAuthorized;

    //The below regex will capture at a depth of up to /endpoint/id/subVerb
    //Currently, the implementation only cares about the 'endpoint'
    //TODO: Figure out how to deal with ID and subVerb portions of match
    var endpointPath = req.path.match(/^(\/\w+){1,3}/);
    console.log("Comma Separated Matches for 'endpointPath': %s", endpointPath);
    //TODO: Url of "/" isn't captured, resulting in null... Is null checking good enough, or should the regex be changed?

    if (!req.username || req.username === undefined) {
        res.send(401);
    }

    whitelistURLs.some(function(wlPermission){
        if ((wlPermission.method === req.method) && (wlPermission.path === endpointPath[0])) {
            console.log("Authorization succeeded. Permission: (%s for %s) is on the whitelist", req.method, req.path);
            req.isAuthorized = true;
            next();
            return true;
        }
    });

    console.log("Not a whitelisted URL, and no other authorization is set up, sending a 401");
    res.send(401);
};

module.exports.isAdmin = function (req, res, next) {
    console.log("Checking if user is admin");
    if (req.isAuthorized === true) {
        console.log("User: %s was already authorized by group.", req.username);
        return next();
    } else {
        User.findOne({"displayName": req.username}, function(err, user) {
            if (err) { //TODO: Handle the error for real
                console.log("Error Retrieving User: " + err);
                //TODO: Don't retardedly concatenate to an empty string
                res.send({error: "" + err});
            } else {
                if (!user || user === undefined) {
                    console.log("User not found. Issuing 401");
                    return res.send(401);
                }
                if (user.isAdmin === true) {
                    console.log("User: %s is an admin. Allowing access.", req.username);
                    return next();
                } else {
                    console.log("User: %s is not an admin either. Issuing 401", req.username);
                    return res.send(401);
                }
            }
        });
    }
};
