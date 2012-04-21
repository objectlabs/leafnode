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

if (!Fiber) require("fibers");

/****************************************************************************************************
 * sync
 *
 * Based on technique used by 0ctave and olegp:
 *     (https://github.com/0ctave/node-sync/blob/master/lib/sync.js)
 *     (https://github.com/olegp/mongo-sync/blob/master/lib/mongo-sync.js)
 *
 * @param {Object} that - receiver
 * @param {String} method - name of method
 * @param {Array} args
 *
 * @return {*} returns what the method would have returned via the supplied callback
 * @throws {Error} 
 *
 * @ignore
 */
var sync = function(that, method, args) {
    var result;
    var fiber = Fiber.current;
    var yielded = false;
    var callbackCalled = false;

    // augment original args with callback
    args = args ? Array.prototype.slice.call(args) : [];
    args.push(function(error, value) {
        callbackCalled = true;
        if (yielded) { // this may or may not occur after the yield() call below       
	    fiber.run(error || value);
        } else {
            result = error || value;
        }
    });

    // apply() may or may not result in callback being called synchronously
    that[method].apply(that, args);
    if (!callbackCalled) { // check if apply() called callback
        yielded = true;
        result = Fiber.yield();
    }

    if (result instanceof Error) {
	throw new Error(result.message);
    }
    return result;
}

/****************************************************************************************************
 * parseMongoURI
 *
 * @param {String} uri
 *
 * 'mongodb://[username:password@]host1[:port1],...[,hostN[:portN]]][/[database][?options]]'
 *
 * @return {Object} parsed URI
 *
 * - **username** {String}
 * - **password** {String}
 * - **hosts** {Array}
 * - **db** {String}
 * - **options** {Object}
 *
 * Options:
 * - **replicaSetName**
 * - **slaveOk**
 * - **safe**
 * - **w**
 * - **wtimeoutMS**
 * - **fsync**
 * - **journal**
 * - **connectTimeoutMS**
 * - **socketTimeoutMS**
 */
function parseMongoURI(uri) { // TODO: url decoding (decodeURIComponent)
    var result = {};
    var pos = 0;

    if (!uri) {
        throw new Error("Null uri");
    }

    if (uri.indexOf("mongodb://") != 0) {
        throw new Error("URI must start with 'mongodb://'");
    }
    pos = 10;

    // parse credentials if they exist
    var atSignIndex = uri.indexOf("@");
    if (atSignIndex !== -1) {
        var credentials = uri.slice(10, atSignIndex);
        var credsArray = credentials.split(":");
        if (credsArray.length !== 2) {
            throw new Error("Expecting '<username>:<password>'. Got '" + credentials + "'");
        }
        result.username = credsArray[0];
        result.password = credsArray[1];
        pos = pos + credentials.length + 1;
    }

    // parse host(s)
    var hostsString;
    var finalSlashIndex = uri.indexOf("/", pos);
    if (finalSlashIndex !== -1) {
        hostsString = uri.slice(pos, finalSlashIndex);
        pos = pos + hostsString.length + 1;
    } else {
        hostsString = uri.slice(pos);
        pos = pos + hostsString.length;
    }

    var hostsArray = hostsString.split(";");
    result.hosts = hostsArray;

    // parse db and options if they exist
    if (pos < uri.length) {
        var dbAndOptionsString = uri.slice(pos);
        var dbAndOptionsArray = dbAndOptionsString.split("?");
        
        // db
        var dbName = dbAndOptionsArray[0];
        if (dbName) {
            result.db = dbName;
        }

        // options
        if (dbAndOptionsArray.length === 2) {
            var optionsString = dbAndOptionsArray[1];
            if (optionsString) {
                var options = {};
                var optionsArray = optionsString.split(";");
                for (var i in optionsArray) {
                    var optionString = optionsArray[i];
                    var optionArray = optionString.split("=");
                    var optionName = optionArray[0];
                    var optionValue = optionArray[1];
                    options[optionName] = optionValue;
                }
                result.options = options;
            }
        }
    }
    
    return result;
};

/****************************************************************************************************
 * exports
 */
if (typeof exports != "undefined") {
    exports.sync = sync;
    exports.parseMongoURI = parseMongoURI;
}
