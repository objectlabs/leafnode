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

var DB = require('./db').DB;
var sync = require('./util').sync;
var MongoClient = require('mongodb').MongoClient;

/****************************************************************************************************
 * connect
 *
 * @param {!String} uri
 * @param {Object=} options
 */
function connect(uri, options) {
    // Don't call DB.connect() as it defers to the native Db.connect(), which doesn't use MongoClient
    return new DB(sync(MongoClient, 'connect', arguments));
}

/****************************************************************************************************
 * open
 *
 * @param {MongoClient} mongoClient
 * @param {String} dbName
 */
function open(mongoClient, dbName) {
    return new DB(sync(mongoClient, 'open').db(dbName));
}

/****************************************************************************************************
 * exports
 */
if (typeof exports != "undefined") {
    exports.connect = connect;
}


