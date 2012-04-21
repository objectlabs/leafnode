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

var connect = require('../lib/leafnode').connect;
var assert = require('assert');

/****************************************************************************************************
 * run
 */
function run() {
    console.log("Testing distinct()");

    var db = connect("mongodb://localhost:27017");
    var c = db.getCollection("leafnode.distinct-test");

    // test
    try {
        testDistinct(c);
    } catch (e) {
        throw e;
    } finally {
        // cleanup
        c.drop();
        db.close();
    }
}

/****************************************************************************************************
 * testDistinct
 */
function testDistinct(c) {
    var obj1 = { "a" : 1, "b" : 2 };
    var obj2 = { "a" : 2, "b" : 3 };
    var obj3 = { "a" : 3, "b" : 3 };
    
    c.insert(obj1);
    c.insert(obj2);
    c.insert(obj3);

    var distincts = c.distinct("a");
    assert.equal(distincts.length, 3);
    distincts = c.distinct("a", { b : 3 });
    assert.equal(distincts.length, 2);
};

/****************************************************************************************************
 * main
 */
if (require.main == module) {
    run();
}

/****************************************************************************************************
 * exports
 */
exports.run = run;
