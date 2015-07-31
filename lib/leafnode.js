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
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var Server = require('mongodb').Server;
var NativeDB = require('mongodb').Db;
var mongodbUri = require("mongodb-uri");

/****************************************************************************************************
 * connect
 *
 * @param {!String} uri
 * @param {Object=} options
 * @param {Boolean} singleNodeConnection
 *
 * Options are as specified for MongoClient.connect
 * http://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html#mongoclient-connect-options
 *
 * Unfortunately, MongoClient.connect will always return a connection to the master node if it can find one.
 * In order to connect to specific node, set singleNodeConnection to true and a different connection strategy
 * will be used. singleNodeConnections cannot recognize URI options.
 *
 */
function connect(uri, options, singleNodeConnection) {

    if(singleNodeConnection){
        return _singleNodeConnect(uri,options);
    }
    else{
        // Don't call DB.connect() as it defers to the native Db.connect(), which doesn't use MongoClient
        return new DB(sync(MongoClient, 'connect', arguments));
    }
}


/****************************************************************************************************
 * _singleNodeConnect
 *
 * @param {!String} uri
 * @param {Object=} options
 *
 * Options are as specified for MongoClient.connect
 * http://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html#mongoclient-connect-options
 *
 * MongoClient.connect will return a Master connection if available, regardless of the node specified.
 * The _singleNodeConnect strategy ensures that a connection to the specified node is returned,
 * not necessarily Master.
 *
 * This connection strategy cannot recognize URI options.
 */
function _singleNodeConnect(uri, options){
    var uriObj = mongodbUri.parse(uri);
    if(uriObj.hosts.length>1){
        throw new Error("Multiple hosts found for single node connection");
    }
    var host = uriObj.hosts[0];
    var serverOptions = options["server"] || null;
    var dbOptions = options["database"] | null;

    var server = new Server(host.host, host.port, serverOptions);
    var db = new NativeDB(uriObj.database, server, dbOptions);
    db = sync(db, 'open');

    if(uriObj.username && uriObj.password){
        var authed = sync(db, 'authenticate',[uriObj.username, uriObj.password, {}]);
        if(!authed){
            throw new Error("Unable to authenticate");
        }
    }

    return new DB(db);
}

/****************************************************************************************************
 * exports
 */
module.exports = {
  connect: connect,
  BSON: mongodb.BSONPure
}

