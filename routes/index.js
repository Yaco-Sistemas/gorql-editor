/*jslint vars: false, node: true */
/*global */

// Copyright 2012 Yaco Sistemas S.L.
//
// Developed by Yaco Sistemas <ablanco@yaco.es>
//
// Licensed under the EUPL, Version 1.1 or – as soon they
// will be approved by the European Commission - subsequent
// versions of the EUPL (the "Licence");
// You may not use this work except in compliance with the
// Licence.
// You may obtain a copy of the Licence at:
//
// http://joinup.ec.europa.eu/software/page/eupl
//
// Unless required by applicable law or agreed to in
// writing, software distributed under the Licence is
// distributed on an "AS IS" basis,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
// express or implied.
// See the Licence for the specific language governing
// permissions and limitations under the Licence.

var app = require.main;

/*
 * GET home page.
 */

exports.index = function (request, response) {
    "use strict";

    response.render('layout', {
        layout: false,
        locals: {
            debugJS: app.exports.settings.debugJS,
            preview: {
                chart: false
            }
        }
    });
};

exports.form = function (request, response) {
    "use strict";

    response.send("oh! hai! :)");
};