mimir - Requirements / To Do List / Etc.
-----
-----

#####Functionality:
- Stream a file (with pipes? Sed,awk,grep,head,tail)
- upload a file
- run a command
- compress/extract (zip, tar.gz)
- symlinks
- which
- echo
- env
- diff
- comm
- /proc/cpuinfo
- /proc/meminfo
- /proc/...
- gpg (encrypt/decrypt)
- kill (with signals)
- service control
- chkconfig
- Running processes (pipes as above, also easy way by user,parent process id, executable string)
- top CPU processes
- top memory processes
- Find files (find flags and pipes)
- Large files?
- Disk space remaining
- Disk mounts
- list of users
- list of groups
- lsb_release
- disk I/O
- network information (interfaces, hostname, ip, net mask, routes, DNS resolution,etc.)
  
#####Security:
- runs over ssl
- each instance generates a client ssl certificate (or uses an existing maybe?) for admin (rw) and client (ro) - maybe use real permissioning later if too many levels for ssl certificates to be practical

#####Other considerations:
- configurable
- command line options
- few as possible external dependencies
- caching results to reduce load on the system
- always return exit code
- have a standard return object (spot for error object)
- have a standard error object
-p2p message bus type situation (ie: can multiple instances of this on multiple machines 'swarm' in some useful way