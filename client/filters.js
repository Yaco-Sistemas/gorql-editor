/*jslint vars: false */
/*global QBA: true, exports */

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

if (typeof QBA === 'undefined') {
    var QBA = {};
}

if (typeof QBA.utils === 'undefined') {
    QBA.utils = {};
}

QBA.utils.getFilterWidgetHTML = function (filter) {
    "use strict";
    var className = "filter-widget",
        html;

    html = "<input type='text' class='" + className + "' />";
    // TODO

    return html;
};

// Browser
if (typeof exports === "undefined") {
    window.exports = {};
}

exports.getFilterWidgetHTML = QBA.utils.getFilterWidgetHTML;
