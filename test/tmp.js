var ReplSet = require('mongodb').ReplSetServers;
var Server = require('mongodb').Server;
var Db = require('mongodb').Db;

var set = new ReplSet([new Server("shadrach.mongolab.com", 45767)]);

var db = new Db('will', set);

db.open(function(err, db) {
    console.log("22");
    db.authenticate("will", "will", function(err, res) {
        console.log(err);
        console.log(res);
        //    console.log(db.authenticate("will", "will"));
        console.log(db.collection("foo", {}, function(err, c) {
            c.insert({});
            c.find({}).toArray(function(err, ds) {
                console.log(err);
                if (ds) {
                    ds.forEach(function(e, r) {
                        console.log(e);
                    });
                }
            });
        }));
    });
});

