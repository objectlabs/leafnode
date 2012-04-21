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

var connect = require('../lib/leafnode').connect;
var parse = require('../lib/util').parseMongoURI;
var assert = require('assert');

/****************************************************************************************************
 * tests
 */
var tests = [
    {
        uri : "mongodb://localhost",
        result : {
            hosts : ["localhost"]
        }
    },

    {
        uri : "mongodb://u:p@localhost",
        result : {
            username : "u",
            password : "p",
            hosts : ["localhost"]
        }
    },

    {
        uri : "mongodb://localhost:27017",
        result : {
            hosts : ["localhost:27017"]
        }
    },

    {
        uri : "mongodb://localhost:27017/foo",
        result : {
            hosts : ["localhost:27017"],
            db : "foo"
        }
    },

    {
        uri : "mongodb://localhost:27017/foo?",
        result : {
            hosts : ["localhost:27017"],
            db : "foo"
        }
    },

    {
        uri : "mongodb://localhost:27017/foo?safe=true",
        result : {
            hosts : ["localhost:27017"],
            db : "foo",
            options : {
                safe : "true"
            }
        }
    },

    {
        uri : "mongodb://localhost:27017/?safe=true;w=2",
        result : {
            hosts : ["localhost:27017"],
            options : {
                safe : "true",
                w : "2"
            }
        }
    },

    {
        uri : "mongodb://localhost:27017;localhost:27018/?safe=true;w=2",
        result : {
            hosts : ["localhost:27017", "localhost:27018"],
            options : {
                safe : "true",
                w : "2"
            }
        }
    },

    {
        uri : "mongodb://localhost:27017;localhost:27018/bar?safe=true;w=2",
        result : {
            hosts : ["localhost:27017", "localhost:27018"],
            db : "bar",
            options : {
                safe : "true",
                w : "2"
            }
        }
    },

    {
        uri : "mongodb://u:p@localhost:27017;localhost:27018/bar?safe=true;w=2",
        result : {
            username : "u",
            password : "p",
            hosts : ["localhost:27017", "localhost:27018"],
            db : "bar",
            options : {
                safe : "true",
                w : "2"
            }
        }
    }
];

/****************************************************************************************************
 * run
 */
function run() {
    runTests();
}

/****************************************************************************************************
 * runTests
 */
function runTests() {
    console.log("Testing uri parser");
    tests.forEach(function(test) {
//        console.log("Testing '" + test.uri + "'");
        var result = parse(test.uri);
        assert.deepEqual(result, test.result);
    });
};

/****************************************************************************************************
 * main
 */
if (require.main == module) {
    run();
}

/****************************************************************************************************
 * exports
 */
exports.run = run;
