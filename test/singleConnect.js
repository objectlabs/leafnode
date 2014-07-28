/****************************************************************************************************
 *
 *  Copyright (C) 2012 ObjectLabs Corporation
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

var connect = require("./../lib/leafnode.js").connect;
var Fiber = require('fibers');
var mongodbUri = require("mongodb-uri");

var args = process.argv.slice(2);
var uri = args[0];

Fiber(function() {
    var uriObj = mongodbUri.parse(uri);
    var singleNodeConnection = uriObj.hosts.length==1;
    var options = {
        "db":{

        },
        "server": {
            "auto_reconnect": true
        }
    };
    var db = connect(uri, options, singleNodeConnection);
    console.log(db.command({"isMaster":1}));
}).run();

