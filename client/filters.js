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

QBA.utils.filterWidgets = {
    text: {
        html: function (filterNumber) {
            "use strict";
            return "<input type='text' class='filter-widget' name='filter_widget_" + filterNumber + "'/>";
        },

        selectors: ["input.filter-widget"]
    },

    date_range: {
        html: function (filterNumber) {
            "use strict";
            var html = "<input type='date' class='filter-widget from datepicker' name='filter_widget_" + filterNumber + "_from'/>";
            html += " to <input type='date' class='filter-widget to datepicker' name='filter_widget_" + filterNumber + "_to'/>";
            return html;
        },

        selectors: ["input.filter-widget.from", "input.filter-widget.to"]
    },

    number_range: {
        html: function (filterNumber) {
            "use strict";
            // TODO
        },

        selectors: []
    }
};

QBA.utils.getFilterWidget = function (filter) {
    "use strict";
    var key = filter.get("widget"),
        widget;

    if (QBA.utils.filterWidgets.hasOwnProperty(key)) {
        widget = QBA.utils.filterWidgets[key];
    } else {
        widget = QBA.utils.filterWidgets.text;
    }

    return widget;
};

// Browser
if (typeof exports === "undefined") {
    window.exports = {};
}

exports.getFilterWidget = QBA.utils.getFilterWidget;
