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

if (!Fiber) var Fiber = require("fibers");

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
 * exports
 */
if (typeof exports != "undefined") {
    exports.sync = sync;
}
