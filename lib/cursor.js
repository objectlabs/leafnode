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

/****************************************************************************************************
 * @class Cursor
 *
 * @param {mongodb.Cursor} cursor
 * @ignore
 */
function Cursor(cursor) {
    this._cursor = cursor;
};

/**
 * Get the count of documents for this cursor
 * @method
 * @param {boolean} applySkipLimit Should the count command apply limit and skip settings on the cursor or use the passed in options.
 * @param {object} [options=null] Optional settings.
 * @param {number} [options.skip=null] The number of documents to skip.
 * @param {number} [options.limit=null] The maximum amounts to count before aborting.
 * @param {number} [options.maxTimeMS=null] Number of miliseconds to wait before aborting the query.
 * @param {string} [options.hint=null] An index name hint for the query.
 * @param {(ReadPreference|string)} [options.readPreference=null] The preferred read preference (ReadPreference.PRIMARY, ReadPreference.PRIMARY_PREFERRED, ReadPreference.SECONDARY, ReadPreference.SECONDARY_PREFERRED, ReadPreference.NEAREST).
 * @return {number} returns the count
 */
Cursor.prototype.count = function(applySkipLimit, options) {
    return sync(this._cursor, 'count', arguments);
}

/**
 * Get the next available document from the cursor, returns null if no more documents are available.
 * @method
 * @throws {Error}
 * @deprecated
 * @return {object} returns the next document or null
 */
Cursor.prototype.next = function() {
    return sync(this._cursor, 'next', arguments);
}

/**
 * Sets the sort order of the cursor query.
 * @method
 * @param {(string|array|object)} keyOrList The key or a keys set used by the sort.
 * @param {number} [direction] The direction of the sorting (1 or -1).
 * @throws {Error}
 * @return {Cursor}
 */
Cursor.prototype.sort = function(keyOrList, direction) {
    return new Cursor(this._cursor.sort(keyOrList, direction));
}

/**
 * Set the limit for the cursor.
 * @method
 * @param {number} value The limit for the cursor query.
 * @throws {MongoError}
 * @return {Cursor}
 */
Cursor.prototype.limit = function(value) {
    return new Cursor(this._cursor.limit(value));
}

/**
 * Returns an array of documents. The caller is responsible for making sure that there
 * is enough memory to store the results. Note that the array only contain partial
 * results when this cursor had been previouly accessed. In that case,
 * cursor.rewind() can be used to reset the cursor.
 * @method
 * @throws {Error}
 * @return {array} returns array of docs
 */
Cursor.prototype.toArray = function() {
    return sync(this._cursor, 'toArray', arguments);
}

/**
 * Set a node.js specific cursor option
 * @method
 * @param {string} field The cursor option to set ['numberOfRetries', 'tailableRetryInterval'].
 * @param {object} value The field value.
 * @throws {MongoError}
 * @return {Cursor}
 */
Cursor.prototype.setOption = function(field, value) {
    return new Cursor(this._cursor.setCursorOption(field, value));
}

/**
 * Set the skip for the cursor.
 * @method
 * @param {number} value The skip for the cursor query.
 * @throws {Error}
 * @return {Cursor}
 */
Cursor.prototype.skip = function(value) {
    return new Cursor(this._cursor.skip(value));
}


/****************************************************************************************************
 * exports
 */
if (typeof exports != "undefined") {
    exports.Cursor = Cursor;
}
