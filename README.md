##### Please note that while I still hope to return to this project some day, I'm not convinced anymore that this is the best method to acheive the stated goals (Node web servers may be too heavy unless you're already working within a node environment). I haven't had time to work on it in quite a while, and am not sure when/if I'll return. The repo continues to exist for posterity, and documentation of the idea.

mimir - README
-----
	This project will serve as a set of RESTful web services endpoints that will allow a consuming system to preform various system administrative and monitoring functionality.

	The main problem attempting to be solved with mimir is that of being able to retrieve vital system information and preform sysadmin tasks without requiring the establishment of an SSH session (that cannot be easily further scripted).

	One of its largest advantages is that it is an extremely low footprint but high throughput application meaning that unless you are kicking thousands of requests per second at it, we should not be able to notice its impact on any server (unless preforming an intensive operation on the server - like tarring a large directory, etc.)

###How To Run:
 - Prerequisites: node.js (installed)
  	1. Run the command: "node app.js"


####Standard JSON Object
_Note: for a 'vanilla' command (no processing of any sort on the server side), only the file parameter is required_

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

###Things you can do...

####'tail'
 - `http://localhost:9999/tail` (`GET` - Pass a `Standard JSON Object` and retrieve a standard tail)
 - `http://localhost:8888/tail/f` (GET - Pass a `Standard JSON Object` and retrieve a streaming tail. This is equivalent to passing `["-f"]` to the `args` variable of the `Standard JSON Object`, itself the equivalent of a local `tail -f` command)

-----

As a brief aside prior to giving the command, Roy Fielding (author of the HTTP specification and co-author of Apache HTTPd) believes the following:

> In other words, any HTTP request message is allowed to contain a message body, and thus must parse messages with that in mind. Server semantics for GET, however, are restricted such that a body, if any, has no semantic meaning to the request. The requirements on parsing are separate from the requirements on method semantics.
>
> So, yes, you can send a body with GET, and no, it is never useful to do so.
>
> This is part of the layered design of HTTP/1.1 that will become clear again once the spec is partitioned (work in progress).
>
> ….Roy (from: http://tech.groups.yahoo.com/group/rest-discuss/message/9962)
>

For now, I've still just decided to do it like this anyways, as I like the robustness of the JSON object for specifiying the parameters generically across the whole API. I also like the 'cleanliness' and avoidance of the URL character limit of not passing the whole JSON object as a request parameter. This whole scheme is open for later thought and change...

-----

_Note: several non-required parameters are ommitted from these examples_

  - Use the following CURL command to `GET` a straight stream of a log (method 1):

          curl -v -H "Content-Type: application/json" -X GET -d '{
    	  	"file": "/var/log/messages"
    	  }' http://localhost:9999/tail/f

  - Use the following CURL command to `GET` a straight stream of a log (method 2):

          curl -v -H "Content-Type: application/json" -X GET -d '{
    	  	"file": "/var/log/messages",
    	  	"args": ["-f"]
          }' http://localhost:9999/tail

  - Use the following CURL command to `GET` a streamed log, grep filtered by 'test':

          curl -v -H "Content-Type: application/json" -X GET -d '{
    	  	"file": "/var/log/messages",
    	  	"pipe": {
    			"command": "grep",
    			"args": ["-e 'test'"]
    		}
          }' http://localhost:9999/tail/f

  - Use the following CURL command to `GET` a streamed log, grep filtered by 'test', tee'd to a temporary file:

          curl -v -H "Content-Type: application/json" -X GET -d '{
    	  	"file": "/var/log/messages",
    	  	"pipe": {
    			"command": "grep",
    			"args": ["-e 'test'"],
    			"pipe": {
    				"command": "tee",
    				"args": ["/tmp/test.txt"]
    			}
    		}
          }' http://localhost:9999/tail/f

  - Etc...
