/*jslint vars: false, browser: true */
/*global QBA: true, $, DV */

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

QBA.preview.callDV = function () {
    "use strict";
    if (typeof DV.data === "undefined") {
        setTimeout(QBA.preview.callDV, 300);
    } else {
        DV.writeDataToTable($("#preview #preview_table")[0], 0);
    }
};

QBA.preview.updateTable = function () {
    "use strict";
    var SPARQL = QBA.theQuery.toSPARQL(),
        html;

    if (typeof DV.data !== "undefined") {
        delete DV.data;
    }

    if (typeof QBA.preview.$el === "undefined") {
        QBA.preview.$el = $("#preview");
    }

    html = "<script type='text/javascript' src='" + QBA.preview.viewer;
    html += "/viewer/?query=" + encodeURIComponent(SPARQL);
    html += "&amp;embedded=true&amp;idx=0'></script>";

    html += "<table id='preview_table' class='dv_table'></table>";

    QBA.preview.$el.html(html);
    setTimeout(QBA.preview.callDV, 300);
};
