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

var sync = require('./util').sync;
var Cursor = require('./cursor').Cursor;

/****************************************************************************************************
 * @class Collection
 *
 * This constructor should not be called directly. Use DB.getCollection()
 * 
 * @param {DB} collection
 * @param {mongodb.Collection} collection
 * @ignore
 */
function Collection(db, collection) {
    this.db = db;
    this._collection = collection;
};

/****************************************************************************************************
 * count
 *
 * @param {Object} [query] 
 * 
 * @returns The number of documents in this collection
 */
Collection.prototype.count = function(query) {
    return sync(this._collection, 'count', arguments);
}

/****************************************************************************************************
 * createIndex
 *
 * Creates an index on the collection.
 *
 * @param {Object} fieldOrSpec
 * @param {Object} [options]
 *
 * Options
 *  - **safe** {true | {w:n, wtimeout:n} | {fsync:true}, default:false}, executes with a 
 *  - **unique** {Boolean, default:false}, creates an unique index
 *  - **sparse** {Boolean, default:false}, creates a sparse index
 *  - **background** {Boolean, default:false}, creates the index in the background, yielding 
 *                                             whenever possible.
 *  - **dropDups** {Boolean, default:false}, a unique index cannot be created on a key that has 
 *                                           pre-existing duplicate values. If you would like to 
 *                                           create the index anyway, keeping the first document the 
 *                                           database indexes and deleting all subsequent documents 
 *                                           that have duplicate value
 *  - **min** {Number}, lower bound for the coordinates
 *  - **max** {Number}, uppder  bound for the coordinates
 *
 * @throws Error
 */
Collection.prototype.createIndex = function(fieldOrSpec, options) {
    return sync(this._collection, 'createIndex', arguments);
}

/****************************************************************************************************
 * distinct
 *
 * @param {string} key
 * @param {Object} [query]
 *
 * @returns {Array}
 * @throws {Error}
 */
Collection.prototype.distinct = function(key, query) {
    return sync(this._collection, 'distinct', arguments);
}
    
/****************************************************************************************************
 * drop
 *
 * Deletes this collection 
 */
Collection.prototype.drop = function() {
    return sync(this._collection, 'drop', arguments);
}

/****************************************************************************************************
 * dropIndex
 *
 * @param name {String} The name of this index 
 */
Collection.prototype.dropIndex = function(name) {
    return sync(this._collection, 'dropIndex', arguments);
}

/****************************************************************************************************
 * dropIndexes
 *
 * Drops all indexes from this collection
 *
 * @throws {Error}
 */
Collection.prototype.dropIndex = function(name) {
    return sync(this._collection, 'dropAllIndex', arguments);
}

/****************************************************************************************************
 * each TODO: do we want this?
 */

/****************************************************************************************************
 * ensureIndex
 * 
 * @param {Object} fieldOrSpec
 * @param {Object} [options]
 *
 * Options
 *  - **safe** {true | {w:n, wtimeout:n} | {fsync:true}, default:false}
 *  - **unique** {Boolean, default:false}, creates an unique index.
 *  - **sparse** {Boolean, default:false}, creates a sparse index.
 *  - **background** {Boolean, default:false}, creates the index in the 
 *                   background, yielding whenever possible.
 *  - **dropDups** {Boolean, default:false}, a unique index cannot be 
 *                 created on a key that has pre-existing duplicate values. 
 *                 If you would like to create the index anyway, keeping 
 *                 the first document the database indexes and deleting 
 *                 all subsequent documents that have duplicate value
 *  - **min** {Number}, lower bound for geo coordinates.
 *  - **max** {Number}, upper bound for geo coordinates.
 *  - **v** {Number}, specify the format version of the indexes.
 */
Collection.prototype.ensureIndex = function(fieldOrSpec, options) {
    return sync(this._collection, 'ensureIndex', arguments);
}

/****************************************************************************************************
 * find
 *
 * @param {Object} [query]
 * @param {Object} [options]
 *
 * Options
 *  - **limit** {Number, default:0}, sets the limit of documents returned in the query.
 *  - **sort** {Array | Object}, set to sort the documents coming back from the query. Array of 
 *                               indexes, [['a', 1]] etc.
 *  - **fields** {Object}, the fields to return in the query. Object of fields to include or  
 *                         exclude (not both), {'a':1}
 *  - **skip** {Number, default:0}, set to skip N documents ahead in your query
 *  - **hint** {Object}, tell the query to use specific indexes in the query. Object of indexes 
 *                       to use, {'_id':1}
 *  - **explain** {Boolean, default:false}, explain the query instead of returning the data.
 *  - **snapshot** {Boolean, default:false}, snapshot query.
 *  - **timeout** {Boolean, default:false}, specify if the cursor can timeout.
 *  - **tailable** {Boolean, default:false}, specify if the cursor is tailable.
 *  - **batchSize** {Number, default:0}, set the batchSize for the getMoreCommand when iterating 
 *                                       over the query results.
 *  - **returnKey** {Boolean, default:false}, only return the index key.
 *  - **maxScan** {Number}, Limit the number of items to scan.
 *  - **min** {Number}, Set index bounds.
 *  - **max** {Number}, Set index bounds.
 *  - **showDiskLoc** {Boolean, default:false}, Show disk location of results.
 *  - **comment** {String}, put a $comment field on a query to mark in profiler logs
 *  - **read** {Boolean, default:false}, Tell the query to read from a secondary server.
 * 
 * @returns {Cursor}
 * @throws {Error}
 */
Collection.prototype.find = function() {
    return new Cursor(sync(this._collection, 'find', arguments));
}

/****************************************************************************************************
 * findAndModify
 *
 * Find and update a document.
 *
 * @param {Object} query object to locate the object to modify
 * @param {Array}  sort - if multiple docs match, choose the first one in the specified sort order  
 *                        as the object to manipulate
 * @param {Object} doc - the fields/vals to be updated
 * @param {Object} [options] options
 *
 * Options
 *  - **safe** {true | {w:n, wtimeout:n} | {fsync:true}, default:false}, executes with a  
 *             getLastError command returning the results of the command on MongoDB.
 *  - **remove** {Boolean, default:false}, set to true to remove the object before returning.
 *  - **upsert** {Boolean, default:false}, perform an upsert operation.
 *  - **new** {Boolean, default:false}, set to true if you want to return the modified object 
 *                                      rather than the original. Ignored for remove.
 *
 * @returns {Object} 
 * @throws {Error}
 */
Collection.prototype.findAndModify = function(query, sort, doc, options) {
    return sync(this._collection, 'findAndModify', arguments);
}

/****************************************************************************************************
 * findOne
 *
 * @param {Object} query 
 * @param {Object} [options] 
 *
 * Options
 *  - **limit** {Number, default:0}, sets the limit of documents returned in the query.
 *  - **sort** {Array | Object}, Array of indexes, [['a', 1]] etc. // TODO: array?
 *  - **fields** {Object}, Object of fields to include or exclude (not both), {'a':1}
 *  - **skip** {Number, default:0}, set to skip N documents ahead in your query
 *  - **hint** {Object}, Object of indexes to use, {'_id':1}
 *  - **explain** {Boolean, default:false}, explain the query instead of returning the data.
 *  - **snapshot** {Boolean, default:false}, snapshot query.
 *  - **timeout** {Boolean, default:false}, specify if the cursor can timeout.
 *  - **tailable** {Boolean, default:false}, specify if the cursor is tailable.
 *  - **batchSize** {Number, default:0}, set the batchSize for the getMoreCommand.
 *  - **returnKey** {Boolean, default:false}, only return the index key.
 *  - **maxScan** {Number}, Limit the number of items to scan.
 *  - **min** {Number}, Set index bounds.
 *  - **max** {Number}, Set index bounds.
 *  - **showDiskLoc** {Boolean, default:false}, Show disk location of results.
 *  - **comment** {String}, Put a $comment field on a query to mark im profiler logs.
 *  - **read** {Boolean, default:false}, Tell the query to read from a secondary server.
 *
 * @returns {Object}
 * @throws {Error}
 */
Collection.prototype.findOne = function(query, options) {
    return sync(this._collection, 'findOne', arguments);
};

/****************************************************************************************************
 * findById
 *
 * @param {ObjectId | String | Number} id; // TODO: lookup allowed types for _id
 * 
 * @returns {Object} the matching document
 * @throws {Error}
 */
// TODO: DO WE WANT THIS?

/****************************************************************************************************
 * getIndexes
 *
 * Retrieves this collection's index definitions
 *
 * @param {Object} [options] additional options during update.
 *
 * Options
 *  - **full** {Boolean, default:false}, returns the full raw index information.
 *
 * @return {Object} index definitions
 */
Collection.prototype.indexInformation = function getIndexes(options) {
    return sync(this._collection, 'indexInformation', arguments);
}

/****************************************************************************************************
 * group
 *
 * Run a group command across a collection
 *
 * @param {Object|Array|Function|Code} keys - an object, array or function expressing the keys 
 *                                            to group by
 * @param {Object} condition - an optional condition that must be true for a row to be considered.
 * @param {Object} initial - initial value of the aggregation counter object. 
 * @param {Function|Code} reduce - the reduce function aggregates (reduces) the objects iterated
 * @param {Function|Code} finalize - an optional function to be run on each item in the result set 
 *                                   just before the item is returned.
 * @param {Boolean} command - specify if you wish to run using the internal group command  
 *                            or using eval, default is true
 *
 * @throws {Error}
 */ 
// TODO (better as one cmd object?)
Collection.prototype.group = function(keys, condition, initial, reduce, finalize, command) {
    return sync(this._collection, 'group', arguments);
}

/****************************************************************************************************
 * insert
 *
 * @param {Object | Array} obj The object or objects to be written
 * @param {Object} [options] options
 * 
 * @returns {null} // TODO: look deeper at this
 * @throws {Error}
 */ 
Collection.prototype.insert = function(docs, options) {
    return sync(this._collection, 'insert', arguments);
};

/****************************************************************************************************
 * Returns if the collection is a capped collection
 *
 * @return {Boolean}
 */
Collection.prototype.isCapped = function isCapped() {
    return sync(this._collection, 'isCapped', arguments);  
};

/****************************************************************************************************
 * mapReduce
 *
 * Run Map Reduce across a collection.
 *
 * @param {Function|String} - map the mapping function.
 * @param {Function|String} - reduce the reduce function.
 * @param {Objects} [options] - options for the map reduce job
 *
 * Options
 *  - **out** {Object, default:*{inline:1}*}, sets the output target for the map reduce job. 
 *                {inline:1} | 
 *                {replace:'collectionName'} | 
 *                {merge:'collectionName'} | 
 *                {reduce:'collectionName'}*
 *  - **query** {Object}, query filter object.
 *  - **sort** {Object}, sorts the input objects using this key. Useful for optimization, like 
 *                       sorting by the emit key for fewer reduces.
 *  - **limit** {Number}, number of objects to return from collection.
 *  - **keeptemp** {Boolean, default:false}, keep temporary data.
 *  - **finalize** {Function | String}, finalize function.
 *  - **scope** {Object}, can pass in variables that can be access from map/reduce/finalize.
 *  - **jsMode** {Boolean, default:false}, it is possible to make the execution stay in JS. Provided
 *                                         in MongoDB > 2.0.X.
 *  - **verbose** {Boolean, default:false}, provide statistics on job execution time.
 *
 * @returns {Object} Map / Reduce output
 * @throws {Error}
 */ 
Collection.prototype.mapReduce = function mapReduce(map, reduce, options) {
    return sync(this._collection, 'mapReduce', arguments);  
}

/****************************************************************************************************
 * reIndex
 *
 * Reindex all indexes on the collection
 * Warning: reIndex is a blocking operation (indexes are rebuilt in the foreground) and will be  
 *          slow for large collections.
 */
Collection.prototype.reIndex = function(name) {
    return sync(this._collection, 'reIndex', arguments);
}

/****************************************************************************************************
 * save
 *
 * Save a document. Simple full document replacement function. 
 *
 * @param {Object} obj - the object to save
 * @param {Object} [options] - additional options
 * 
 * Options
 *  - **safe** {true | {w:n, wtimeout:n} | {fsync:true}, default:false}, executes with a  
 *             getLastError command returning the results of the command on MongoDB
 *
 * @returns {Object} write result
 * @throws {Error}
 */
Collection.prototype.save = function(obj, options) {
    return sync(this._collection, 'save', arguments);
}

/****************************************************************************************************
 * stats
 * 
 * Get all the collection statistics
 *
 * @param {Object} [options] - options for the map reduce job
 *
 * Options
 *  - **scale** {Number}, divide the returned sizes by scale value
 *
 * @returns {Object} collection stats
 */
Collection.prototype.stats = function(options) {
    return sync(this._collection, 'stats', arguments);
}

/****************************************************************************************************
 * update
 *
 * Updates documents.
 *
 * @param {Object} query - the query to select the document/documents to be updated
 * @param {Object} obj - object to be updated or document defining update operations
 * @param {Object} [options] - additional options during update
 *
 * Options
 *  - **safe** {true | {w:n, wtimeout:n} | {fsync:true}, default:false}, executes with a 
 *             getLastError command returning the results of the command on MongoDB.
 *  - **upsert** {Boolean, default:false}, perform an upsert operation.
 *  - **multi** {Boolean, default:false}, update all documents matching the selector.
 *  - **serializeFunctions** {Boolean, default:false}, serialize functions on the document.
 * 
 * @returns {Object} write result
 * @throws {Error}
 */ 
Collection.prototype.update = function(query, obj, options) {
    return sync(this._collection, 'update', arguments);
}

/**
 * Removes documents specified by `selector` from the db.
 *
 * Options
 *  - **safe** {true | {w:n, wtimeout:n} | {fsync:true}, default:false}, executes with a getLastError command returning the results of the command on MongoDB.
 *  - **single** {Boolean, default:false}, removes the first document found.
 *
 * @param {Object} [selector] optional select, no selector is equivalent to removing all documents.
 * @param {Object} [options] additional options during remove.
 * @return {null}
 * @api public
 */
Collection.prototype.remove = function remove(selector, options) {
    return sync(this._collection, 'remove', arguments);
};

/****************************************************************************************************
 * exports
 */
if (typeof exports != "undefined") {
    exports.Collection = Collection;
}
