leafnode
---------

```leafnode``` is a "synchronous" MongoDB driver. It is a wrapper around [node-mongodb-native](https://github.com/mongodb/node-mongodb-native) implemented using the [node-fibers](https://github.com/laverdet/node-fibers) co-routine library. 

```leafnode``` is currently experimental and in alpha.

Example:

```
var connect = require('leafnode').connect;

try {
   var db = connect("mongodb://localhost:27017/mydb");
   var c = db.getCollection("users");
   var results = c.find({"firstName" : "Joe"}).toArray();
   console.log(results);
} catch e {
   console.log(e);
}
```

No callbacks needed. If an error occurs an exception is thrown.

We say "synchronous" because ```leafnode``` code execution is still asynchronous under the hood, but uses Fibers to provide a synchronous programming interface. One should therefore note that many functions and methods of this driver actually yield control to the event loop during execution. For more on Fibers see the documenentation [here](https://github.com/laverdet/node-fibers).

Installation
------------

Using npm 

```
% cd <your-app>
% npm install leafnode
```

From git

```
% git clone git@github.com:objectlabs/leafnode.git
% cd <your-app>
% npm install <path-to-leafnode>
```

To run unit tests
-----------------

```node
% node ./test/all.js
```


Using ```leafnode``` in your code
----------------------------------

In order to use ```leafnode``` you need to properly bootstrap your application by creating a ```Fiber``` for the code to run in. 

The basic idea is as follows:

```
require('fibers');

Fiber(function() {
  //do stuff
}).run();

```

In practice you will want to do this at the beginning of a command line program or, if using an application toolkit like [express](https://github.com/visionmedia/express), as you process each request. One nice way of achieving this in ```express``` is to add a middleware function that wraps request handling in a ```Fiber```. 

```
app.use(function(req, res, next) {
   Fiber(function() {
      next();
   }).run();
});
```

Open issues
-----------

* Support for options in MongoDB URI uneven

v3.0.0 Changelog
----------------

* Fixes to the `sync` function. It used to be that if an object came in through the error parameter in the callback but was not an instanceof Error, then that object would be return by `sync` as the result. Now any object passed to callback as the error parameter will result in a thrown Error object.
* New sort and limit functions have been added to the Cursor class
* Implemented db switching within a single connection. This is a call to the driver's `DB.db(dbName)` function 

