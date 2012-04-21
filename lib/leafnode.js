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

var ServerConnector = require('./connectors').ServerConnector;
var parseMongoURI = require('./util').parseMongoURI;

/****************************************************************************************************
 * connect
 *
 * @param {string} uri
 */
function connect(uri) {
    var mongoURI = parseMongoURI(uri);
    if (mongoURI.hosts.length > 1) {
        throw new Error("ReplicaSet connections not supported: '" + uri + "'");
    } else {
        return _singleServerConnect(mongoURI);
    }

    throw new Error("Could not create connection to uri: '" + uri + "'");
};

/****************************************************************************************************
 * _singleServerConnect
 *
 * @param {string} uri
 */
function _singleServerConnect(uri) {
    var hostString = uri.hosts[0];
    var db = uri.db || "test";
    var uriOptions = uri.options || {};
    var serverOptions = _createServerConnectorOptions(uriOptions);
    var username = uri.username;
    var password = uri.password;

    var server = new ServerConnector(hostString, null, serverOptions);

    var dbOptions = _createDatabaseOptions(uriOptions);
    var db = server.getDB(db, dbOptions);

    if (username) {
        db.authenticate(username, password);
    }

    return db;
}

/****************************************************************************************************
 * _createServerConnectorOptions
 *
 */
function _createServerConnectorOptions(uriOptions) {
    return {}; // TODO
}

/****************************************************************************************************
 * _createDatabaseOptions
 *
 */
function _createDatabaseOptions(uriOptions) {
    return {}; // TODO
}

/****************************************************************************************************
 * exports
 */
if (typeof exports != "undefined") {
    exports.connect = connect;
}


