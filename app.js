/*jslint vars: false, node: true, nomen: true */
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

/**
 * Module dependencies.
 */

var express = require('express'),
    index = require('./routes/index'),
    settings = require('./settings').settings,
    app = module.exports = express.createServer();

// Configuration

app.configure(function () {
    "use strict";

    app.set('views', __dirname + '/views');
    app.set('view engine', 'html');
    app.register('.html', require('jqtpl').express);
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    // static is not in dot notation because of JSLint
    app.use(express['static'](__dirname + '/public'));

    app.set('debugJS', settings.global.debug);
    app.set('schema', settings.global.schema);
});

app.configure('development', function () {
    "use strict";

    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('production', function () {
    "use strict";

    app.use(express.errorHandler());
});

// Routes

app.get(settings.global.root + '/', index.index);
app.get(settings.global.root + '/form', index.form);

app.listen(settings.global.port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
