# Pi of Things local Hub

## Installation Notes

1. Mosca will give an error if you don't have Zero MQ installed. While Mosca
will run just fine if you use it for mqtt only, it is annoying to see npm try to compile Zero MQ every time
and fail. So if you are on Debian (Jessie) do this:  
``` apt-get install libzmq3-dev ```  
If you get a package not found, add this to the ```/etc/apt/sources.list```
```
deb http://httpredir.debian.org/debian/ experimental main contrib non-free
deb-src http://httpredir.debian.org/debian/ experimental main contrib non-free   
```
Run  
```apt-get update```  
```apt-get upgrade```  
```apt-get install libzmq3-dev```  
Then run mosca installation as admin again and you should not see the error
anymore  
```npm install mosca --save```  
Official ZeroMQ documentation [here http://zeromq.org/distro:debian](http://zeromq.org/distro:debian)
