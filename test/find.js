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
var numDocs = 100

/****************************************************************************************************
 * run
 */
function run() {
    console.log("Testing find()");

    var db = connect("mongodb://localhost:27017");

    var c = db.getCollection("leafnode.find-test");

    // test
    try {
        testCursor(c);
        testArray(c);
	testFindOne(c)
    } catch (e) {
        throw e;
    } finally {
        // cleanup
        c.drop();
        db.close();
    }
}

/****************************************************************************************************
 * testCursor
 */
function testCursor(c) {
    for (var i = 0; i < numDocs; i++) {
        var obj = makeObj(i);
        c.insert(obj);
    }

    var j = 0;
    var cursor = c.find({});
    var obj;
    while (obj = cursor.next()) {
        j++;
    }
    assert.equal(j, numDocs);
}

/****************************************************************************************************
 * testArray
 */
function testArray(c) {
    c.drop();
    for (var i = 0; i < numDocs; i++) {
        var obj = makeObj(i);
        c.insert(obj);
    }
    
    var all = c.find().toArray();
    assert.equal(all.length, numDocs);
    
    var o = makeObj(0);
    for (var i in all) {
        var a = all[i];
        assert.equal(o.iField, a.iField);
        assert.equal(o.ddField, a.ddField);
        assert.equal(o.bField, a.bField);
        assert.equal(o.b2Field, a.b2Field);
        assert.equal(o.dField.getTime(), a.dField.getTime());
        assert.equal(o.nField, a.nField);
        assert.deepEqual(o.aField, a.aField);
        assert.deepEqual(o.oField, a.oField);
    }
};

/****************************************************************************************************
 * testFindOne
 */
function testFindOne(c) {
    c.drop();
    var obj = {_id: 0};
    c.insert(obj);
    var result = c.findOne({_id: 0});
    assert.deepEqual(obj, result);
}

/****************************************************************************************************
 * makeObj
 */
function makeObj(i) {
    return { 
        i : i,
        iField : 22,
        ddField : 22.2,
        bField : true,
        b2Field : false,
        nField : null,
        dField : new Date(123000000),
        aField : [1, null, true, [1, 2, 3], { a: 1, b: null, c: [] }],
        oField : { a: 1, b: false, c: [{}, 0], d: { ee : 1, ff : 2 }}
    };
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
