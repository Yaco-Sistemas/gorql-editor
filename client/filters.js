/*jslint vars: false */
/*global QBA: true, exports, $ */

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
        html: function (parameters, filterNumber) {
            "use strict";
            return "<input type='text' class='filter-widget' name='filter_widget_" + filterNumber + "'/>";
        },

        init: function (parameters, filterNumber, el) {
            "use strict";
        },

        selectors: ["input.filter-widget"]
    },

    date_range: {
        html: function (parameters, filterNumber) {
            "use strict";
            var html = "<input type='date' class='filter-widget from datepicker' name='filter_widget_" + filterNumber + "_from'/>";
            html += " to <input type='date' class='filter-widget to datepicker' name='filter_widget_" + filterNumber + "_to'/>";
            return html;
        },

        init: function (parameters, filterNumber, el) {
            "use strict";
        },

        selectors: ["input.filter-widget.from", "input.filter-widget.to"]
    },

    number_range: {
        html: function (parameters, filterNumber) {
            "use strict";
            var html = "<div class='filter-widget range' name='filter_widget_" + filterNumber + "' min='" + parameters.min + "' max='" + parameters.max + "' />";
            html += "<span class='filter-widget-help'>(From " + parameters.min + " to " + parameters.max + ")</span>";
            html += "<input type='number' class='filter-widget range from' name='filter_widget_" + filterNumber + "_from' min='" + parameters.min + "' max='" + parameters.max + "'/> to ";
            html += "<input type='number' class='filter-widget range to' name='filter_widget_" + filterNumber + "_to' min='" + parameters.min + "' max='" + parameters.max + "'/>";
            return html;
        },

        init: function (parameters, filterNumber, el) {
            "use strict";
            $(el).find("div.filter-widget.range").slider({
                range: true,
                min: parameters.min,
                max: parameters.max,
                values: [parameters.min, parameters.max],
                slide: function (event, ui) {
                    $(el).find("input.filter-widget.range.from").val(ui.values[0]);
                    $(el).find("input.filter-widget.range.to").val(ui.values[1]);
                }
            });
        },

        selectors: []
    }
};

QBA.utils.getFilterWidget = function (key) {
    "use strict";
    var widget;

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
