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

QBA.preview.slideInProgress = false;

QBA.preview.init = function (domain, limit) {
    "use strict";
    QBA.preview.viewer = domain;
    QBA.preview.limit = limit;
};

QBA.preview.callDV = function (chart, params) {
    "use strict";
    var func;
    if (typeof DV.data === "undefined" || QBA.preview.slideInProgress) {
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
                    if (chart === "map") {
                        DV.initMap(QBA.preview.viewer);
                    } else if (chart === "mapea") {
                        DV.initMapea(QBA.preview.viewer);
                    }
                    func("#preview #viewport #preview_chart",
                         "#preview #viewport #preview_table", params);
                    QBA.preview.$loader.addClass("hidden");
                    QBA.preview.$el.removeClassClass("hidden");
                } catch (err) {
                    QBA.preview.$loader.addClass("hidden");
                    QBA.preview.$error.find("#preview_error_text").text(QBA.lingua.preview.error);
                    QBA.preview.$error.removeClass("hidden");
                }
            } else {
                QBA.preview.$loader.addClass("hidden");
                QBA.preview.$el.removeClass("hidden");
            }
        } else {
            QBA.preview.$loader.addClass("hidden");
            QBA.preview.$error.find("#preview_error_text").text(QBA.lingua.preview.noresults);
            QBA.preview.$error.removeClass("hidden");
        }
    }
};

QBA.preview.initQuery = function (SPARQL, preventEffect) {
    "use strict";
    var html;

    if (typeof DV.data !== "undefined") {
        delete DV.data;
    }

    if (typeof QBA.preview.$el === "undefined") {
        QBA.preview.$el = $("#preview #viewport");
    }
    if (typeof QBA.preview.$error === "undefined") {
        QBA.preview.$error = $("#preview #error");
    }
    if (typeof QBA.preview.$loader === "undefined") {
        QBA.preview.$loader = $("#preview #loader");
    }
    QBA.preview.$el.addClass("hidden");
    QBA.preview.$error.addClass("hidden");
    QBA.preview.$loader.removeClass("hidden");

    QBA.views.jQueryUI("#preview");
    if (!preventEffect) {
        QBA.preview.slideEffect(true);
    }

    html = "<script type='text/javascript' src='" + QBA.preview.viewer;
    html += "/viewer/?query=" + encodeURIComponent(SPARQL);
    html += "&amp;embedded=true&amp;idx=0'></script>";

    return html;
};

QBA.preview.updateTable = function (preventEffect) {
    "use strict";
    var SPARQL = QBA.theQuery.toSPARQL() + " LIMIT " + QBA.preview.limit,
        html = QBA.preview.initQuery(SPARQL, preventEffect);

    html += "<table id='preview_table' class='dv_table'></table>";

    QBA.preview.$el.html(html);

    try {
        QBA.preview.callDV(false);
    } catch (err) {
        QBA.preview.$loader.addClass("hidden");
        QBA.preview.$error.find("#preview_error_text").text(err);
        QBA.preview.$error.removeClass("hidden");
    }
};

QBA.preview.updateChart = function (preventEffect) {
    "use strict";
    var SPARQL = QBA.theQuery.toSPARQL(),
        html = QBA.preview.initQuery(SPARQL, preventEffect),
        radio = $("input[name=chart_type]:checked")[0];

    if (radio.value === "map") {
        html += "<link rel='stylesheet' href='" + QBA.preview.viewer + "/javascripts/theme/default/style.css' />";
    }

    html += "<link rel='stylesheet' href='" + QBA.preview.viewer + "/stylesheets/" + radio.value + ".css' />";
    if (radio.value === "timeline") {
        html += "<script type='text/javascript'>var Timeline_ajax_url='" +
            QBA.preview.viewer + "/javascripts/timeline_ajax/simile-ajax-api.js';" +
            "Timeline_urlPrefix='" + QBA.preview.viewer + "/javascripts/timeline_js/';" +
            "Timeline_parameters='bundle=true&defaultLocale=\"es\"';</script>";
    }
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
    html += "<div id='preview_chart' class='dv_viewport'></div>";

    QBA.preview.$el.html(html);

    try {
        QBA.preview.callDV(radio.value, QBA.chart.getChartParams(radio.value));
    } catch (err) {
        QBA.preview.$loader.addClass("hidden");
        QBA.preview.$error.find("#preview_error_text").text(err);
        QBA.preview.$error.removeClass("hidden");
    }
};

QBA.preview.slideEffect = function (show) {
    "use strict";
    QBA.preview.slideInProgress = true;
    if (typeof QBA.preview.$containerEl === "undefined") {
        QBA.preview.$containerEl = $("#preview");
    }
    if (show) {
        $(".openPreview").addClass("hidden");
        QBA.preview.$containerEl.show("slide", { direction: "up" }, 500, function () {
            QBA.preview.slideInProgress = false;
        });
    } else {
        QBA.preview.$containerEl.hide("slide", { direction: "up" }, 500, function () {
            $(".openPreview").removeClass("hidden");
            QBA.preview.slideInProgress = false;
        });
    }
};

QBA.preview.shakeEffectLocked = false;

QBA.preview.shakeEffect = function () {
    "use strict";
    var node;
    if (QBA.preview.shakeEffectLocked) {
        return;
    }
    QBA.preview.shakeEffectLocked = true;
    if ($(".openPreview").is(".hidden") && $("#step1").is(".ui-tabs-hide")) {
        // Opened preview
        node = $("#refreshPreview");
    } else {
        node = $(".openPreview").parent().parent();
    }
    node.effect("shake", {}, 200, function () {
        QBA.preview.shakeEffectLocked = false;
    });
};
