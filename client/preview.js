/*jslint vars: false, browser: true, nomen: true */
/*global QBA: true, $, DV, _ */

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
    window.QBA = {};
}

QBA.preview = {};

QBA.preview.setViewer = function (domain) {
    "use strict";
    QBA.preview.viewer = domain;
};

QBA.preview.fillFormWithDefaultValues = function (chart) {
    "use strict";
    if (typeof DV.defaults === "undefined") {
        return;
    }

    var params = $("#step5 #" + chart + "Params div.parameter input"),
        defaults = DV.defaults[chart];

    if (typeof defaults === "undefined") {
        return;
    }

    _.each(params, function (input) {
        var name = $(input).attr("name").split('-')[1];
        if (defaults.hasOwnProperty(name) && $(input).val() === "") {
            $(input).val(defaults[name]);
        }
    });
};

QBA.preview.callDV = function (chart, params) {
    "use strict";
    var func;
    if (typeof DV.data === "undefined") {
        setTimeout(function () {
            QBA.preview.callDV(chart, params);
        }, 300);
    } else {
        if (DV.data[0].results.length > 0) {
            DV.writeDataToTable($("#preview #viewport #preview_table")[0], 0);
            if (chart !== false) {
                func = DV[chart];
                $("#preview #viewport #preview_chart").html("");
                try {
                    func("#preview #viewport #preview_chart",
                         "#preview #viewport #preview_table", params);
                } catch (err) {
                    $("#preview #viewport #preview_chart").html("There was an error.");
                }
            }
        } else {
            QBA.preview.$el.html("No results returned.");
        }
    }
};

QBA.preview.init = function (SPARQL) {
    "use strict";
    var html;

    $("#debug #query").text(SPARQL);

    if (typeof DV.data !== "undefined") {
        delete DV.data;
    }

    if (typeof QBA.preview.$el === "undefined") {
        QBA.preview.$el = $("#preview #viewport");
    }

    html = "<script type='text/javascript' src='" + QBA.preview.viewer;
    html += "/viewer/?query=" + encodeURIComponent(SPARQL);
    html += "&amp;embedded=true&amp;idx=0'></script>";

    return html;
};

QBA.preview.updateTable = function () {
    "use strict";
    var SPARQL = QBA.theQuery.toSPARQL(),
        html = QBA.preview.init(SPARQL);

    html += "<table id='preview_table' class='dv_table'><tr><td>Working...</td></tr></table>";

    QBA.preview.$el.html(html);
    setTimeout(function () {
        QBA.preview.callDV(false);
    }, 300);
};

QBA.preview.updateChart = function () {
    "use strict";
    var SPARQL = QBA.theQuery.toSPARQL(),
        html = QBA.preview.init(SPARQL),
        radios = $("input[name=chart_type]"),
        radio = _.filter(radios, function (radio) { return radio.checked; })[0];

    html += "<link rel='stylesheet' href='" + QBA.preview.viewer + "/stylesheets/" + radio.value + ".css' />";
    html += "<script type='text/javascript' src='" + QBA.preview.viewer + "/javascripts/dv-";

    if (radio.value === "bar" || radio.value === "pie" || radio.value === "line") {
        html += "d3.js'></script>";
    } else if (radio.value === "timeline") {
        html += "time.js'></script>";
    } else if (radio.value === "map") {
        html += "openlayers.js'></script>";
    } else if (radio.value === "mapea") {
        html += "mapea.js'></script>";
    }

    html += "<table id='preview_table' class='dv_table' style='display: none;'></table>";
    html += "<div id='preview_chart' class='dv_viewport'>Working...</div>";

    QBA.preview.$el.html(html);
    setTimeout(function () {
        QBA.preview.callDV(radio.value, QBA.preview.getChartParams(radio.value));
    }, 300);
};

QBA.preview.getChartParams = function (chart) {
    "use strict";
    var params = $("#step5 #" + chart + "Params div.parameter input"),
        options = _.map(params, function (p) {
            p = $(p);
            var value = p.val();
            if (p.attr("type") === "checkbox") {
                value = p.is(":checked");
            }
            return {
                key: p.attr("name").split('-')[1],
                value: value
            };
        }),
        result = {};

    _.each(options, function (opt) {
        if (opt.value !== "") {
            result[opt.key] = opt.value;
        }
    });

    return result;
};
