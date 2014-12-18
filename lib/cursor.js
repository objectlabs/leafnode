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

/****************************************************************************************************
 * count
 *
 * @returns {Number}
 */
Cursor.prototype.count = function() {
    return sync(this._cursor, 'count', arguments);
}

/****************************************************************************************************
 * next
 *
 * @returns {object} returns next object in cursor or null if done
 */
Cursor.prototype.next = function() {
    return sync(this._cursor, 'nextObject', arguments);
}

/****************************************************************************************************
 * sort
 *
 * @param {object} s sets the sort parameter of this cursor to the given value
 * @returns {Cursor}
 */
Cursor.prototype.sort = function(s) {
    return new Cursor(this._cursor.sort(s));
}

/****************************************************************************************************
 * limit
 *
 * @param {Number} n the size of the limit
 * @returns {Cursor}
 */
Cursor.prototype.limit = function(n) {
    return new Cursor(this._cursor.limit(n));
}

/****************************************************************************************************
 * toArray
 *
 * @returns {Array} convertes cursor to an Array
 */
Cursor.prototype.toArray = function() {
    return sync(this._cursor, 'toArray', arguments);
}

/****************************************************************************************************
 * exports
 */
if (typeof exports != "undefined") {
    exports.Cursor = Cursor;
}
