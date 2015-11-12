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
 * @param {NativeDb} nativeDb
 */
var DB = function(nativeDb) {
    if ( nativeDb instanceof NativeDB ) {
        // This overloading is intended for internal use only (DB.connect())
        this._nativeDB = nativeDb;
    } else {
        throw new Error("nativeDB is not an instance of the native DB");
    }
};

/**
 * Fetch all collections for the current db.
 *
 * @method
 * @return {array} returns an array of objects containing collection info
 */
DB.prototype.getCollections = function() {
    return sync(this._nativeDB, 'collections', arguments);
};

/**
 * Fetch all collection names for the current db.
 *
 * @method
 * @return {array} returns an array of objects containing collection info
 */
DB.prototype.getCollectionNames = function() {
    var query = sync(this._nativeDB, 'listCollections', arguments);
    var collectionList = sync(query, 'toArray');
    var nameList = [];
    for(var collection in collectionList){
        nameList.push(collection.name);
    }
    return nameList;
};

/**
 * Creates a collection on a server pre-allocating space, need to create f.ex capped collections.
 *
 * @method
 * @param {string} name the collection name we wish to access.
 * @param {object} [options=null] Optional settings.
 * @param {(number|string)} [options.w=null] The write concern.
 * @param {number} [options.wtimeout=null] The write concern timeout.
 * @param {boolean} [options.j=false] Specify a journal write concern.
 * @param {boolean} [options.raw=false] Return document results as raw BSON buffers.
 * @param {object} [options.pkFactory=null] A primary key factory object for generation of custom _id keys.
 * @param {(ReadPreference|string)} [options.readPreference=null] The preferred read preference (ReadPreference.PRIMARY, ReadPreference.PRIMARY_PREFERRED, ReadPreference.SECONDARY, ReadPreference.SECONDARY_PREFERRED, ReadPreference.NEAREST).
 * @param {boolean} [options.serializeFunctions=false] Serialize functions on any object.
 * @param {boolean} [options.strict=false] Returns an error if the collection does not exist
 * @param {boolean} [options.capped=false] Create a capped collection.
 * @param {number} [options.size=null] The size of the capped collection in bytes.
 * @param {number} [options.max=null] The maximum number of documents in the capped collection.
 * @param {boolean} [options.autoIndexId=true] Create an index on the _id field of the document, True by default on MongoDB 2.2 or higher off for version < 2.2.
 * @return {Collection} returns newly created collection
 */
DB.prototype.createCollection = function(name, options) {
    if (options && options.safe) {
        result = sync(this._nativeDB, 'createCollection', arguments);
        return new Collection(this, result);
    }

    // when mode is not 'safe' mongodb-native is actually sync already
    // despite the CPS
    var result;
    this._nativeDB.createCollection(name, options, function(err, res) {
        result = res; 
    });

    return result;
},

/**
 * Fetch a specific collection (containing the actual collection information).
 *
 * @method
 * @param {string} name the collection name we wish to access.
 * @param {object} [options=null] Optional settings.
 * @param {(number|string)} [options.w=null] The write concern.
 * @param {number} [options.wtimeout=null] The write concern timeout.
 * @param {boolean} [options.j=false] Specify a journal write concern.
 * @param {boolean} [options.raw=false] Return document results as raw BSON buffers.
 * @param {object} [options.pkFactory=null] A primary key factory object for generation of custom _id keys.
 * @param {(ReadPreference|string)} [options.readPreference=null] The preferred read preference (ReadPreference.PRIMARY, ReadPreference.PRIMARY_PREFERRED, ReadPreference.SECONDARY, ReadPreference.SECONDARY_PREFERRED, ReadPreference.NEAREST).
 * @param {boolean} [options.serializeFunctions=false] Serialize functions on any object.
 * @param {boolean} [options.strict=false] Returns an error if the collection does not exist
 * @return {Collection} return the new Collection instance if not in strict mode
 */
DB.prototype.getCollection = function(name, options) {
    var result;
    result = sync(this._nativeDB, 'collection', arguments);
    return new Collection(this, result);
};

/**
 * Authenticate a user against the server.
 * @method
 * @param {string} username The username.
 * @param {string} [password] The password.
 * @param {object} [options=null] Optional settings.
 * @param {string} [options.authMechanism=MONGODB-CR] The authentication mechanism to use, GSSAPI, MONGODB-CR, MONGODB-X509, PLAIN
 * @return {boolean} returns true if authed, false otherwise
 */
DB.prototype.authenticate = function(username, password, options) {
    return sync(this._nativeDB, 'authenticate', arguments);
};

/**
 * Execute a command
 * @method
 * @param {object} command The command hash
 * @param {object} [options=null] Optional settings.
 * @param {(ReadPreference|string)} [options.readPreference=null] The preferred read preference (ReadPreference.PRIMARY, ReadPreference.PRIMARY_PREFERRED, ReadPreference.SECONDARY, ReadPreference.SECONDARY_PREFERRED, ReadPreference.NEAREST).
 * @param {number} [options.maxTimeMS=null] Number of milliseconds to wait before aborting the query.
 * @return {object} returns result of the command
 */
DB.prototype.command = function(command, options) {
    return sync(this._nativeDB, 'command', arguments);
};

/**
 * Create a new Db instance sharing the current socket connections. Be aware that the new db instances are
 * related in a parent-child relationship to the original instance so that events are correctly emitted on child
 * db instances. Child db instances are cached so performing db('db1') twice will return the same instance.
 * You can control these behaviors with the options noListener and returnNonCachedInstance.
 *
 * @method
 * @param {string} name The name of the database we want to use.
 * @param {object} [options=null] Optional settings.
 * @param {boolean} [options.noListener=false] Do not make the db an event listener to the original connection.
 * @param {boolean} [options.returnNonCachedInstance=false] Control if you want to return a cached instance or have a new one created
 * @return {DB}
 */
DB.prototype.db = function(name, options) {
    return new DB(this._nativeDB.db(name, options));
};


/**
 * Close the db and it's underlying connections
 * @method
 * @param {boolean} force Force close, emitting no events
 * @return {undefined} no return value
 */
DB.prototype.close = function(force) {
    this._nativeDB.close(force);
}

/****************************************************************************************************
 * exports
 */
if (typeof exports != "undefined") {
    exports.DB = DB;
}
