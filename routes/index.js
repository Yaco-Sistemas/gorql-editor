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

var app = require.main,
    async = require('async'),
    path = require('path'),
    fs = require('fs');

/*
 * GET home page.
 */

exports.index = function (request, response) {
    "use strict";

    var callback = function (error, data) {
        var schema,
            templates;

        if (error) {
            // TODO
            console.log(error);
            response.send("Oops", 500);
        } else {
            schema = JSON.parse(data.splice(0, 1)[0]);
            templates = data;

            response.render('layout', {
                layout: false,
                locals: {
                    debugJS: app.exports.settings.debugJS,
                    viewer: app.exports.settings.viewer,
                    schema: { categories: schema },
                    schemaJSON: JSON.stringify(schema),
                    templates: templates,
                    steps: {
                        s1: '',
                        s2: 'hidden',
                        s3: 'hidden',
                        s4: 'hidden',
                        s5: 'hidden'
                    }
                }
            });
        }
    };

    async.parallel([
        async.apply(fs.readFile, path.dirname(app.filename) + '/' + app.exports.settings.schema),
        async.apply(fs.readFile, path.dirname(app.filename) + "/views/s1choose.html"),
        async.apply(fs.readFile, path.dirname(app.filename) + "/views/s2choose.html"),
        async.apply(fs.readFile, path.dirname(app.filename) + "/views/s3join.html"),
        async.apply(fs.readFile, path.dirname(app.filename) + "/views/s4filter.html"),
        async.apply(fs.readFile, path.dirname(app.filename) + "/views/s5paint.html")
    ], callback);
};

exports.form = function (request, response) {
    "use strict";

    response.send("oh! hai! :)");
};