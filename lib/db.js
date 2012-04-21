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
var Collection = require('./collection').Collection;
var sync = require('./util').sync;

/****************************************************************************************************
 * @class DB
 *
 * @ignore
 *
 * @param {Server} server
 * @param {string} name
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
 */
var DB = function(server, name, options) {
    this._nativeDB = new NativeDB(name, server._nativeServer, options || {});
};

/****************************************************************************************************
 * getCollectionNames
 *
 * @returns {Array} collection names
 */
DB.prototype.getCollectionNames = function() {
    return sync(this._nativeDB, 'collectionNames', arguments);
},

/****************************************************************************************************
 * createCollection
 *
 * @param {string} name
 * @param {object} options
 *
 * @returns {Collection}
 * @throws {Error}
 */ 
DB.prototype.createCollection = function(name, options) {
    if (options && options.safe) {
        return sync(this._nativeDB, 'createCollection', arguments);
    }

    // when mode is not 'safe' mongodb-native is actually sync already
    // despite the CPS
    var result;
    this._nativeDB.createCollection(name, options, function(err, res) {
        result = res; 
    });

    return result;
},

/****************************************************************************************************
 * getCollection
 *
 * @param {string} name
 * @param {string} [options]
 * @returns {Collection}
 * @throws {Error}
 */ 
DB.prototype.getCollection = function(name, options) {
    var result;
    if (options && options.safe) {
        result = sync(this._nativeDB, 'collection', arguments);
    } else {
        this._nativeDB.collection(name, options, function(err, res) {
            result = res; // this is OK, function not async here
        });
    }
    return new Collection(this, result);
};

/****************************************************************************************************
 * authenticate
 *
 * @param {string} username
 * @param {string} password
 * @throws {Error}
 */ 
DB.prototype.authenticate = function(username, password) {
    return sync(this._nativeDB, 'authenticate', arguments);
};

/****************************************************************************************************
 * close
 *
 * @throws {Error}
 */ 
DB.prototype.close = function() {
    this._nativeDB.close();
}

/****************************************************************************************************
 * exports
 */
if (typeof exports != "undefined") {
    exports.DB = DB;
}
