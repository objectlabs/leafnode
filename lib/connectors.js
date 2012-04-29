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

var NativeDB = require('mongodb').Db;
var NativeServer = require('mongodb').Server;
var Collection = require('./collection').Collection;
var NativeReplSet = require('mongodb').ReplSet;
var DB = require('./db').DB;
var sync = require('./util').sync;

/****************************************************************************************************
 * @class ServerConnector
 *
 * @ignore
 *
 * @param {String} address - <hostname>[:<port>]
 * @param {Object} [options]
 *
 * Options
 *  - TODO: 
 */
var ServerConnector = function(address, options) {
    this._nativeServer = _makeNativeServer(address, options);
};

/****************************************************************************************************
 * getDB
 * 
 * @param {String} name
 * @param {Object} [options]
 *
 * Options
 *  - **strict** {true | {w:n, wtimeout:n} | {fsync:true}, default:false}, execute with a 
 *               getLastError command returning the result of the insert command.
 *  - **native_parser** {Boolean, default:false}, use c++ bson parser.
 *  - **forceServerObjectId** {Boolean, default:false}, force server to create _id fields instead 
 *                            of client.
 *  - **pkFactory** {Object}, object overriding the basic ObjectID primary key generation.
 *  - **slaveOk** {Boolean, default:false}, allow reads from secondaries.
 *  - **serializeFunctions** {Boolean, default:false}, serialize functions.
 *  - **raw** {Boolean, default:false}, peform operations using raw bson buffers.
 *  - **recordQueryStats** {Boolean, default:false}, record query statistics during execution.
 *  - **reaper** {Boolean, default:false}, enables the reaper, timing out calls that never return.
 *  - **reaperInterval** {Number, default:10000}, number of miliseconds between reaper wakups.
 *  - **reaperTimeout** {Number, default:30000}, the amount of time before a callback times out.
 *  - **retryMiliSeconds** {Number, default:5000}, number of miliseconds between retries.
 *  - **numberOfRetries** {Number, default:5}, number of retries off connection.
 *
 * @returns {DB}
 */
ServerConnector.prototype.getDB = function(name, options) {
    var result = new DB(this, name, options);
    var nativeDB = result._nativeDB;
    nativeDB = sync(nativeDB, 'open', []);
    if (nativeDB) {
        result._nativeDB = nativeDB;
    }
    return(result);
};

/****************************************************************************************************
 * @class ReplicaSetConnector
 *
 * @ignore
 *
 * @param {Array} addresses - array of addresses of the form "<hostname>:<port>"
 * @param {Object} [options]
 *
 * Options
 *  - TODO: 
 */
var ReplicaSetConnector = function(addresses, options) {
    var nativeServers = [];

    addresses.forEach(function(address) {
        nativeServers.push(_makeNativeServer(address, {})); // TODO : options
    });

    this._nativeReplSet = new NativeReplSet(nativeServers, options || {});
};

/****************************************************************************************************
 * _makeNativeServer
 */
function _makeNativeServer(address, options) {
    var hostname = address;
    var port = 27107;
    
    if (address.indexOf(":") !== -1) {
        var pair = address.split(":");
        hostname = pair[0];
        port = new Number(pair[1]).valueOf();
    } 

    return new NativeServer(hostname, port, options || {});
};

/****************************************************************************************************
 * exports
 */
if (typeof exports != "undefined") {
    exports.ServerConnector = ServerConnector;
}
