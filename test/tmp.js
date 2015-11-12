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
var spawn = require('fibers-utils').spawn;

/****************************************************************************************************
 * run
 */
function run() {
    spawn(function() {
        console.log("Testing getCollectionNames()");

        var db = connect("mongodb://localhost:27017");
        var names = db.getCollectionNames();
        console.log(names);
    });
}

run();