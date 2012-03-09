=======
INSTALL
=======

Install NodeJS
==============

Compile NodeJS
--------------

You must download and compile node. http://nodejs.org/#download

Download the lastest tar available (http://nodejs.org/dist/v0.6.12/node-v0.6.12.tar.gz)
and do something like this::

 tar xvf node-v0.6.12.tar.gz
 cd node-v0.6.12
 ./configure
 make
 sudo make install

You can find more details in the documentation: https://github.com/joyent/node/wiki/Installation

It includes NPM, the NodeJS package manager.

Deploy the Query Builder Assistant
==================================

Dependencies
------------

Get the code from the mercurial repository::

 hg clone https://hg.yaco.es/ceic-ogov-assistant

Install the dependencies::

 cd ceic-ogov-assistant
 npm install -d

The assistant uses memcached, but it can run without it, in that case it would
just not use the cache.

Configure it modifying the **settings.js** file.

Start the server
----------------

Now you can run it. Just do::

 node app.js

The server will start and it will listen to: http://localhost:3000/

Debug the Query Builder Assistant
=================================

Node-Inspector
--------------

Install it doing as root::

 npm install -g node-inspector

Start the server in debug mode
------------------------------

Start node-inspector first:

 node-inspector &

Start the server in debug mode::

 node --debug app.js

Now open http://localhost:8080/debug?port=5858 in a webkit-based browser. You
will find the inspector ready to debug the application.

The assistant will be available at http://localhost:3000/ as usual.
